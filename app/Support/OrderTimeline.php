<?php

namespace App\Support;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;

class OrderTimeline
{
    /**
     * Build a timeline from known order/payment state.
     * Only events that actually happened are included.
     * Timestamps are included only when a real value exists.
     *
     * @return array<int, array{key: string, label: string, at: string|null}>
     */
    public static function for(Order $order): array
    {
        $events = [
            [
                'key' => 'order_created',
                'label' => 'Commande créée',
                'at' => $order->created_at?->toIso8601String(),
            ],
        ];

        if ($order->payment_status === PaymentStatus::PAID) {
            $events[] = [
                'key' => 'payment_successful',
                'label' => 'Paiement réussi',
                'at' => null,
            ];
        }

        if ($order->payment_status === PaymentStatus::FAILED) {
            $events[] = [
                'key' => 'payment_failed',
                'label' => 'Échec du paiement',
                'at' => null,
            ];
        }

        $status = $order->status;

        if ($status === OrderStatus::CANCELLED) {
            $events[] = [
                'key' => 'order_cancelled',
                'label' => 'Commande annulée',
                'at' => $order->updated_at?->toIso8601String(),
            ];

            return $events;
        }

        if (in_array($status, [
            OrderStatus::CONFIRMED,
            OrderStatus::SHIPPED,
            OrderStatus::DELIVERED,
        ], true)) {
            $events[] = [
                'key' => 'order_confirmed',
                'label' => 'Commande confirmée',
                'at' => null,
            ];
        }

        if (in_array($status, [
            OrderStatus::SHIPPED,
            OrderStatus::DELIVERED,
        ], true)) {
            $events[] = [
                'key' => 'order_shipped',
                'label' => 'Commande expédiée',
                'at' => null,
            ];
        }

        if ($status === OrderStatus::DELIVERED) {
            $events[] = [
                'key' => 'order_delivered',
                'label' => 'Commande livrée',
                'at' => null,
            ];
        }

        return $events;
    }
}
