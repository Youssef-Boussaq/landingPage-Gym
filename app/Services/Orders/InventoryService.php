<?php

namespace App\Services\Orders;

use App\Models\InventoryMovement;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class InventoryService
{
    /**
     * Reserve stock for an order.
     *
     * Physical stock is NOT decreased here.
     * Only reserved_quantity is increased.
     */
    public function reserveStock(Order $order): void
    {
        DB::transaction(function () use ($order) {
            foreach ($order->items as $item) {
                $product = Product::query()
                    ->whereKey($item->product_id)
                    ->lockForUpdate()
                    ->first();

                if (!$product || !$product->manage_stock) {
                    continue;
                }

                $quantity = (int) $item->quantity;

                if ($quantity <= 0) {
                    continue;
                }

                if ($product->available_stock < $quantity) {
                    throw new RuntimeException(
                        "Stock insuffisant pour le produit : {$product->title}"
                    );
                }

                $movement = InventoryMovement::firstOrCreate(
                    [
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'type' => 'reserve',
                    ],
                    [
                        'quantity' => $quantity,
                    ]
                );

                if ($movement->wasRecentlyCreated) {
                    $product->increment('reserved_quantity', $quantity);
                }
            }
        });
    }

    /**
     * Release a previous reservation.
     *
     * Physical stock is NOT changed.
     * Only reserved_quantity is decreased.
     */
    public function releaseReservation(Order $order): void
    {
        DB::transaction(function () use ($order) {
            foreach ($order->items as $item) {
                $product = Product::query()
                    ->whereKey($item->product_id)
                    ->lockForUpdate()
                    ->first();

                if (!$product || !$product->manage_stock) {
                    continue;
                }

                $quantity = (int) $item->quantity;

                if ($quantity <= 0) {
                    continue;
                }

                $movement = InventoryMovement::firstOrCreate(
                    [
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'type' => 'release',
                    ],
                    [
                        'quantity' => $quantity,
                    ]
                );

                if (!$movement->wasRecentlyCreated) {
                    continue;
                }

                if ($product->reserved_quantity < $quantity) {
                    throw new RuntimeException(
                        "Réservation insuffisante pour libérer le produit : {$product->title}"
                    );
                }

                $product->decrement('reserved_quantity', $quantity);
            }
        });
    }

    /**
     * Ship the reserved stock.
     *
     * Physical stock decreases.
     * reserved_quantity also decreases.
     */
    public function shipStock(Order $order): void
    {
        DB::transaction(function () use ($order) {
            foreach ($order->items as $item) {
                $product = Product::query()
                    ->whereKey($item->product_id)
                    ->lockForUpdate()
                    ->first();

                if (!$product || !$product->manage_stock) {
                    continue;
                }

                $quantity = (int) $item->quantity;

                if ($quantity <= 0) {
                    continue;
                }

                $movement = InventoryMovement::firstOrCreate(
                    [
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'type' => 'ship',
                    ],
                    [
                        'quantity' => $quantity,
                    ]
                );

                if (!$movement->wasRecentlyCreated) {
                    continue;
                }

                if ($product->reserved_quantity < $quantity) {
                    throw new RuntimeException(
                        "Réservation insuffisante pour expédier le produit : {$product->title}"
                    );
                }

                if ($product->stock_quantity < $quantity) {
                    throw new RuntimeException(
                        "Stock physique insuffisant pour expédier le produit : {$product->title}"
                    );
                }

                $product->decrement('reserved_quantity', $quantity);
                $product->decrement('stock_quantity', $quantity);
            }
        });
    }

    /**
     * Return stock after a returned order.
     *
     * Physical stock increases.
     */
    public function returnStock(Order $order): void
    {
        DB::transaction(function () use ($order) {
            foreach ($order->items as $item) {
                $product = Product::query()
                    ->whereKey($item->product_id)
                    ->lockForUpdate()
                    ->first();

                if (!$product || !$product->manage_stock) {
                    continue;
                }

                $quantity = (int) $item->quantity;

                if ($quantity <= 0) {
                    continue;
                }

                $movement = InventoryMovement::firstOrCreate(
                    [
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'type' => 'return',
                    ],
                    [
                        'quantity' => $quantity,
                    ]
                );

                if (!$movement->wasRecentlyCreated) {
                    continue;
                }

                $product->increment('stock_quantity', $quantity);
            }
        });
    }
}

