<?php

namespace App\Support;

use App\Enums\OrderStatus;

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
                OrderStatus::SHIPPED,
                OrderStatus::CANCELLED,
            ],
            OrderStatus::SHIPPED => [
                OrderStatus::DELIVERED,
            ],
            OrderStatus::DELIVERED, OrderStatus::CANCELLED => [],
        };
    }

    public static function canTransition(OrderStatus $from, OrderStatus $to): bool
    {
        return collect(self::allowedFrom($from))
            ->contains(fn (OrderStatus $status) => $status === $to);
    }
}
