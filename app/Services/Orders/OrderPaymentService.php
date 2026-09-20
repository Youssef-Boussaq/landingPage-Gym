<?php

namespace App\Services\Orders;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Events\PaymentFailed;
use App\Events\PaymentSuccessful;
use App\Models\Order;
use App\Services\Stripe\StripeRefundService;
use Illuminate\Support\Facades\DB;

class OrderPaymentService
{
    public function __construct(
        private OrderStockService $stockService,
        private StripeRefundService $refundService,
    ) {}

    public function markPaid(
        int $orderId,
        string $stripeSessionId,
        ?string $paymentIntentId = null
    ): void {
        $result = DB::transaction(function () use (
            $orderId,
            $stripeSessionId,
            $paymentIntentId
        ) {
            $order = Order::with('items')
                ->lockForUpdate()
                ->find($orderId);

            if (!$order) {
                return ['status' => 'missing'];
            }

            // Update Stripe IDs if needed
            $updates = [];
            
            // Allow fallback to transaction_id for legacy orders
            if ($order->stripe_session_id) {
                if ($order->stripe_session_id !== $stripeSessionId) {
                    return ['status' => 'invalid_session'];
                }
            } elseif ($order->transaction_id) {
                if ($order->transaction_id !== $stripeSessionId) {
                    return ['status' => 'invalid_session'];
                }
            }

            if ($paymentIntentId && $order->stripe_payment_intent_id !== $paymentIntentId) {
                $updates['stripe_payment_intent_id'] = $paymentIntentId;
            }

            /*
             * Idempotency
             */
            if ($order->payment_status === PaymentStatus::PAID) {
                if (!empty($updates)) {
                    $order->update($updates);
                }
                return ['status' => 'already_paid'];
            }

            /*
             * Stock Decrement
             */
            $stockResult = $this->stockService->decreaseForOrder($order);

            if (!$stockResult->success) {
                return ['status' => 'stock_failed'];
            }

            /*
             * Mark Paid
             */
            $updates['status'] = OrderStatus::PAID;
            $updates['payment_status'] = PaymentStatus::PAID;
            
            $order->update($updates);

            event(new PaymentSuccessful($order));

            return ['status' => 'paid'];
        });

        /*
         * Refund OUTSIDE DB transaction
         */
        if (isset($result['status']) && $result['status'] === 'stock_failed') {
            $this->refundService->refundOrder($orderId);
            $this->markFailed($orderId);
        }
    }

    public function markFailed(int $orderId): void
    {
        DB::transaction(function () use ($orderId) {
            $order = Order::lockForUpdate()->find($orderId);

            if (!$order) {
                return;
            }

            /*
             * Never overwrite PAID
             */
            if ($order->payment_status === PaymentStatus::PAID) {
                return;
            }

            if ($order->payment_status === PaymentStatus::FAILED) {
                return;
            }

            $order->update([
                'payment_status' => PaymentStatus::FAILED,
                'status' => OrderStatus::CANCELLED,
            ]);

            event(new PaymentFailed($order));
        });
    }
}
