<?php

namespace App\Support;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\AmeexCity;
use App\Models\Order;
use App\Services\Ameex\AmeexShipmentService;
use App\Services\Orders\InventoryService;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class OrderStatusTransition
{
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

            /*
             * Important:
             *
             * PROCESSING -> SHIPPED is NOT an admin status transition.
             *
             * It is performed internally by shipToAmeex()
             * after AMEEX accepts the parcel and stock is shipped.
             */
            OrderStatus::PROCESSING => [],

            /*
             * These statuses are controlled by AMEEX webhook.
             */
            OrderStatus::SHIPPED => [],

            OrderStatus::OUT_FOR_DELIVERY => [],

            OrderStatus::DELIVERED => [],

            OrderStatus::RETURNED => [],

            OrderStatus::CANCELLED => [],
        };
    }

    public static function canTransition(
        OrderStatus $from,
        OrderStatus $to
    ): bool {
        return collect(self::allowedFrom($from))
            ->contains(
                fn (OrderStatus $status) => $status === $to
            );
    }

    /**
     * Admin status transition.
     *
     * This method is ONLY for normal admin-controlled transitions.
     *
     * Shipping to AMEEX is handled separately by shipToAmeex().
     */
    public static function change(
        Order $order,
        OrderStatus $newStatus
    ): void {
        if (!self::canTransition($order->status, $newStatus)) {
            throw new RuntimeException(
                "Transition invalide depuis {$order->status->value} vers {$newStatus->value}"
            );
        }

        DB::transaction(function () use (
            $order,
            $newStatus
        ): void {
            $order->refresh();

            if (!self::canTransition($order->status, $newStatus)) {
                throw new RuntimeException(
                    "Transition invalide depuis {$order->status->value} vers {$newStatus->value}"
                );
            }

            $inventoryService = app(InventoryService::class);

            $updates = [
                'status' => $newStatus,
            ];

            if ($newStatus === OrderStatus::CANCELLED) {
                $updates['cancelled_at'] = now();

                if ($order->payment_method === 'cash') {
                    $inventoryService->releaseReservation($order);
                } elseif (
                    $order->payment_status === PaymentStatus::PAID
                ) {
                    $inventoryService->returnStock($order);
                }
            }

            elseif ($newStatus === OrderStatus::DELIVERED) {
                $updates['delivered_at'] = now();

                if ($order->payment_method === 'cash') {
                    $updates['payment_status'] = PaymentStatus::PAID;
                }
            }

            elseif ($newStatus === OrderStatus::RETURNED) {
                $updates['returned_at'] = now();

                $inventoryService->returnStock($order);
            }

            $order->update($updates);
        });
    }

    /**
     * Send a PROCESSING order to AMEEX.
     *
     * Flow:
     *
     * PROCESSING
     *     ↓
     * find AMEEX city from orders.city
     *     ↓
     * create AMEEX parcel
     *     ↓
     * save parcel_code
     *     ↓
     * shipStock()
     *     ↓
     * SHIPPED
     */
    public static function shipToAmeex(Order $order): void
    {
        if ($order->status !== OrderStatus::PROCESSING) {
            throw new RuntimeException(
                "La commande doit être en préparation avant l'expédition AMEEX."
            );
        }

        if ($order->ameexShipment) {
            self::finalizeShipment($order);

            return;
        }

        /*
         * The city was already normalized during order creation.
         */
        $cityName = trim((string) $order->city);

        if ($cityName === '') {
            throw new RuntimeException(
                'La ville de la commande est obligatoire pour AMEEX.'
            );
        }

        /*
         * No manual city selection.
         *
         * orders.city must already use the normalized format.
         */
        $ameexCity = AmeexCity::query()
            ->where('active', true)
            ->where('name', $cityName)
            ->first();

        if (!$ameexCity) {
            throw new RuntimeException(
                "La ville « {$cityName} » n'existe pas dans les villes AMEEX actives."
            );
        }

        /*
         * IMPORTANT:
         * AMEEX HTTP call happens OUTSIDE the DB transaction.
         */
        $shipmentService = app(
            AmeexShipmentService::class
        );

        $shipmentService->create(
            $order,
            $ameexCity
        );

        /*
         * AMEEX parcel exists locally now.
         *
         * Only after that do we physically move the stock
         * and mark the order as shipped.
         */
        self::finalizeShipment($order);
    }

    /**
     * Final local shipping operation.
     *
     * This is intentionally separate from the AMEEX HTTP call.
     */
    private static function finalizeShipment(Order $order): void
    {
        DB::transaction(function () use ($order): void {
            $order->refresh();

            if ($order->status !== OrderStatus::PROCESSING) {
                throw new RuntimeException(
                    "La commande n'est plus en préparation."
                );
            }

            if (!$order->ameexShipment) {
                throw new RuntimeException(
                    'Aucun colis AMEEX associé à cette commande.'
                );
            }

            $inventoryService = app(
                InventoryService::class
            );

            /*
             * Physical stock:
             *
             * stock_quantity -= quantity
             * reserved_quantity -= quantity
             */
            $inventoryService->shipStock($order);

            $order->update([
                'status' => OrderStatus::SHIPPED,
                'shipped_at' => now(),
            ]);
        });
    }
}

