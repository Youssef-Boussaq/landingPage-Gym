<?php

namespace App\Services\Stripe;

use App\Models\Order;
use Illuminate\Support\Facades\Log;
use Stripe\Refund;
use Stripe\Stripe;

class StripeRefundService
{
    public function refundOrder(int $orderId): void
    {
        $order = Order::find($orderId);

        if (!$order) {
            return;
        }

        try {
            Stripe::setApiKey(config('services.stripe.secret'));

            $paymentIntentId = $order->stripe_payment_intent_id;

            if (!$paymentIntentId) {
                Log::error('Cannot refund order without payment intent', [
                    'order_id' => $orderId,
                    'stripe_session_id' => $order->stripe_session_id,
                ]);
                return;
            }

            Refund::create(
                [
                    'payment_intent' => $paymentIntentId,
                ],
                [
                    'idempotency_key' => 'order-refund-' . $order->id,
                ]
            );
            
            Log::info('Stripe payment refunded due to stock issue', [
                'order_id' => $orderId,
            ]);

        } catch (\Throwable $e) {
            Log::critical('Stripe refund failed', [
                'order_id' => $orderId,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
