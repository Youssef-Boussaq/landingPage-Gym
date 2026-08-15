<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Enums\OrderStatus;
use App\Models\Order;

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

            if ($order->status === OrderStatus::PAID) {
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
            ]);
        });
    }
}
