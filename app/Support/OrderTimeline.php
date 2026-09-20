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
                // Using delivered_at if cash, or updated_at, but we'll leave it null for simplicity if no explicit timestamp exists
                'at' => $order->payment_method === 'cash' ? $order->delivered_at?->toIso8601String() : null,
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
                'at' => $order->cancelled_at?->toIso8601String() ?? $order->updated_at?->toIso8601String(),
            ];

            return $events;
        }

        if (in_array($status, [
            OrderStatus::CONFIRMED, OrderStatus::PROCESSING, OrderStatus::SHIPPED,
            OrderStatus::OUT_FOR_DELIVERY, OrderStatus::DELIVERED, OrderStatus::RETURNED,
        ], true)) {
            $events[] = [
                'key' => 'order_confirmed',
                'label' => 'Commande confirmée',
                'at' => null,
            ];
        }

        if (in_array($status, [
            OrderStatus::PROCESSING, OrderStatus::SHIPPED,
            OrderStatus::OUT_FOR_DELIVERY, OrderStatus::DELIVERED, OrderStatus::RETURNED,
        ], true)) {
            $events[] = [
                'key' => 'order_processing',
                'label' => 'Commande en préparation',
                'at' => null,
            ];
        }

        if (in_array($status, [
            OrderStatus::SHIPPED, OrderStatus::OUT_FOR_DELIVERY,
            OrderStatus::DELIVERED, OrderStatus::RETURNED,
        ], true)) {
            $events[] = [
                'key' => 'order_shipped',
                'label' => 'Commande expédiée',
                'at' => $order->shipped_at?->toIso8601String(),
            ];
        }

        if (in_array($status, [
            OrderStatus::OUT_FOR_DELIVERY, OrderStatus::DELIVERED, OrderStatus::RETURNED,
        ], true)) {
            $events[] = [
                'key' => 'order_out_for_delivery',
                'label' => 'En cours de livraison',
                'at' => null,
            ];
        }

        if ($status === OrderStatus::DELIVERED) {
            $events[] = [
                'key' => 'order_delivered',
                'label' => 'Commande livrée',
                'at' => $order->delivered_at?->toIso8601String(),
            ];
        }

        if ($status === OrderStatus::RETURNED) {
            $events[] = [
                'key' => 'order_returned',
                'label' => 'Commande retournée',
                'at' => $order->returned_at?->toIso8601String(),
            ];
        }

        return $events;
    }
}
