<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Events\PaymentSuccessful;
use App\Events\PaymentFailed;

use Illuminate\Support\Facades\DB;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;
use UnexpectedValueException;




class StripeWebhookController extends Controller
{
   public function handle(Request $request)
{
    $payload = $request->getContent();

    $signature = $request->header('Stripe-Signature');

    $webhookSecret = config('services.stripe.webhook_secret');

    try {

        $event = Webhook::constructEvent(
            $payload,
            $signature,
            $webhookSecret
        );

    } catch (UnexpectedValueException $e) {

        \Log::error('STRIPE WEBHOOK INVALID PAYLOAD', [
            'error' => $e->getMessage(),
        ]);

        return response()->json([
            'message' => 'Invalid payload',
        ], 400);

    } catch (SignatureVerificationException $e) {

        \Log::error('STRIPE WEBHOOK INVALID SIGNATURE', [
            'error' => $e->getMessage(),
        ]);

        return response()->json([
            'message' => 'Invalid signature',
        ], 400);
    }


    \Log::info('STRIPE WEBHOOK VERIFIED', [
        'event_id' => $event->id,
        'event_type' => $event->type,
    ]);


    if ($event->type === 'checkout.session.completed') {

        $session = $event->data->object;

        $orderId = $session->metadata->order_id ?? null;

        \Log::info('CHECKOUT SESSION COMPLETED', [
            'session_id' => $session->id,
            'order_id' => $orderId,
            'payment_status' => $session->payment_status,
        ]);


        if (!$orderId) {

            \Log::error('STRIPE ORDER ID MISSING', [
                'session_id' => $session->id,
            ]);

            return response()->json([
                'message' => 'Order ID missing',
            ], 400);
        }


        if ($session->payment_status === 'paid') {

            $this->handleSuccessfulPayment(
                (int) $orderId,
                $session->id
            );
        } elseif ($session->payment_status === 'unpaid' && $event->type === 'checkout.session.async_payment_failed') {
            $this->handleFailedPayment((int) $orderId);
        }
    } elseif ($event->type === 'payment_intent.payment_failed') {
        $paymentIntent = $event->data->object;
        
        $session = \Stripe\Checkout\Session::all(['payment_intent' => $paymentIntent->id, 'limit' => 1])->data[0] ?? null;
        if ($session && isset($session->metadata->order_id)) {
            $this->handleFailedPayment((int) $session->metadata->order_id);
        }
    }


    return response()->json([
        'received' => true,
    ]);
}

    private function handleSuccessfulPayment(
        int $orderId,
        string $stripeSessionId
    ): void {

        DB::transaction(function () use (
            $orderId,
            $stripeSessionId
        ) {

            $order = Order::with('items')
                ->lockForUpdate()
                ->find($orderId);

            if (!$order) {
                return;
            }

            /*
            |--------------------------------------------------------------------------
            | Idempotency
            |--------------------------------------------------------------------------
            |
            | Stripe may send the same webhook more than once.
            |
            */

            if ($order->payment_status === PaymentStatus::PAID) {
                return;
            }

            /*
            |--------------------------------------------------------------------------
            | Verify transaction
            |--------------------------------------------------------------------------
            */

            if (
                $order->transaction_id !==
                $stripeSessionId
            ) {
                return;
            }

            /*
            |--------------------------------------------------------------------------
            | Decrease stock
            |--------------------------------------------------------------------------
            */

            foreach ($order->items as $item) {

                $product = $item->product()
                    ->lockForUpdate()
                    ->first();

                if (!$product) {
                    continue;
                }

                $product->decrement(
                    'stock_quantity',
                    $item->quantity
                );
            }

            /*
            |--------------------------------------------------------------------------
            | Mark order as PAID
            |--------------------------------------------------------------------------
            */

            $order->update([
                'status' => OrderStatus::PAID,
                'payment_status' => PaymentStatus::PAID,
            ]);

            event(new PaymentSuccessful($order));
        });
    }

    private function handleFailedPayment(int $orderId): void
    {
        DB::transaction(function () use ($orderId) {
            $order = Order::lockForUpdate()->find($orderId);

            if (!$order) {
                return;
            }

            if ($order->payment_status === PaymentStatus::FAILED) {
                return;
            }

            $order->update([
                'payment_status' => PaymentStatus::FAILED,
            ]);

            event(new PaymentFailed($order));
        });
    }
}
