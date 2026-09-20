<?php

namespace App\Services\Orders;

use App\Models\InventoryMovement;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class InventoryService
{
    /**
     * Reserve stock for an order (e.g. CASH).
     */
    public function reserveStock(Order $order): void
    {
        DB::transaction(function () use ($order) {
            foreach ($order->items as $item) {
                $product = Product::whereKey($item->product_id)->lockForUpdate()->first();

                if (!$product || !$product->manage_stock) {
                    continue;
                }

                if ($product->available_stock < $item->quantity) {
                    throw new \RuntimeException("Stock insuffisant pour le produit: {$product->title}");
                }

                // Create movement (idempotent due to DB unique constraint idx_unique_movement)
                $movement = InventoryMovement::firstOrCreate([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'type' => 'reserve',
                ], [
                    'quantity' => $item->quantity,
                ]);

                if ($movement->wasRecentlyCreated) {
                    $product->increment('reserved_quantity', $item->quantity);
                }
            }
        });
    }

    /**
     * Release previously reserved stock (e.g. order cancelled before shipment).
     */
    public function releaseReservation(Order $order): void
    {
        DB::transaction(function () use ($order) {
            foreach ($order->items as $item) {
                $product = Product::whereKey($item->product_id)->lockForUpdate()->first();

                if (!$product || !$product->manage_stock) {
                    continue;
                }

                $movement = InventoryMovement::firstOrCreate([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'type' => 'release',
                ], [
                    'quantity' => $item->quantity,
                ]);

                if ($movement->wasRecentlyCreated) {
                    // Reduce reserved_quantity, but do not let it drop below 0
                    $newReserved = max(0, $product->reserved_quantity - $item->quantity);
                    $product->update(['reserved_quantity' => $newReserved]);
                }
            }
        });
    }

    /**
     * Mark stock as shipped (deduct physical stock and release reservation).
     */
    public function shipStock(Order $order): void
    {
        DB::transaction(function () use ($order) {
            foreach ($order->items as $item) {
                $product = Product::whereKey($item->product_id)->lockForUpdate()->first();

                if (!$product || !$product->manage_stock) {
                    continue;
                }

                $movement = InventoryMovement::firstOrCreate([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'type' => 'ship',
                ], [
                    'quantity' => $item->quantity,
                ]);

                if ($movement->wasRecentlyCreated) {
                    $newReserved = max(0, $product->reserved_quantity - $item->quantity);
                    $newStock = max(0, $product->stock_quantity - $item->quantity);

                    $product->update([
                        'reserved_quantity' => $newReserved,
                        'stock_quantity' => $newStock,
                    ]);
                }
            }
        });
    }

    /**
     * Restore stock when returned (add back to physical stock).
     */
    public function returnStock(Order $order): void
    {
        DB::transaction(function () use ($order) {
            foreach ($order->items as $item) {
                $product = Product::whereKey($item->product_id)->lockForUpdate()->first();

                if (!$product || !$product->manage_stock) {
                    continue;
                }

                $movement = InventoryMovement::firstOrCreate([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'type' => 'return',
                ], [
                    'quantity' => $item->quantity,
                ]);

                if ($movement->wasRecentlyCreated) {
                    $product->increment('stock_quantity', $item->quantity);
                }
            }
        });
    }
}
