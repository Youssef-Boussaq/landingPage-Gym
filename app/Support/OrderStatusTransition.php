<?php

namespace App\Support;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Services\Orders\InventoryService;
use Illuminate\Support\Facades\DB;

class OrderStatusTransition
{
    /**
     * @return array<int, OrderStatus>
     */
    public static function allowedFrom(OrderStatus $from): array
    {
        return match ($from) {
            OrderStatus::PENDING => [
                OrderStatus::CONFIRMED,
                OrderStatus::CANCELLED,
            ],
            OrderStatus::PAID => [
                OrderStatus::CONFIRMED,
                OrderStatus::CANCELLED,
            ],
            OrderStatus::CONFIRMED => [
                OrderStatus::PROCESSING,
                OrderStatus::CANCELLED,
            ],
            OrderStatus::PROCESSING => [
                OrderStatus::SHIPPED,
            ],
            OrderStatus::SHIPPED => [
                OrderStatus::OUT_FOR_DELIVERY,
            ],
            OrderStatus::OUT_FOR_DELIVERY => [
                OrderStatus::DELIVERED,
                OrderStatus::RETURNED,
            ],
            OrderStatus::DELIVERED, OrderStatus::RETURNED, OrderStatus::CANCELLED => [],
        };
    }

    public static function canTransition(OrderStatus $from, OrderStatus $to): bool
    {
        return collect(self::allowedFrom($from))
            ->contains(fn (OrderStatus $status) => $status === $to);
    }

    public static function change(Order $order, OrderStatus $newStatus): void
    {
        if (!self::canTransition($order->status, $newStatus)) {
            throw new \RuntimeException("Transition invalide depuis {$order->status->value} vers {$newStatus->value}");
        }

        DB::transaction(function () use ($order, $newStatus) {
            $inventoryService = app(InventoryService::class);
            $updates = ['status' => $newStatus];

            if ($newStatus === OrderStatus::CANCELLED) {
                $updates['cancelled_at'] = now();
                if ($order->payment_method === 'cash') {
                    $inventoryService->releaseReservation($order);
                } elseif ($order->payment_status === PaymentStatus::PAID) {
                    // For paid stripe orders, cancellation means we must refund and restore physical stock
                    $inventoryService->returnStock($order);
                }
            } elseif ($newStatus === OrderStatus::SHIPPED) {
                $updates['shipped_at'] = now();
                if ($order->payment_method === 'cash') {
                    $inventoryService->shipStock($order);
                }
            } elseif ($newStatus === OrderStatus::DELIVERED) {
                $updates['delivered_at'] = now();
                if ($order->payment_method === 'cash') {
                    $updates['payment_status'] = PaymentStatus::PAID;
                }
            } elseif ($newStatus === OrderStatus::RETURNED) {
                $updates['returned_at'] = now();
                // Both Cash and Stripe restore physical stock upon return
                $inventoryService->returnStock($order);
            }

            $order->update($updates);
        });
    }
}
