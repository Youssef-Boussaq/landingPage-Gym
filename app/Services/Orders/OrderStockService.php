<?php

namespace App\Services\Orders;

use App\Models\Order;
use App\Models\Product;

class StockResult
{
    public function __construct(
        public readonly bool $success,
        public readonly ?int $productId = null,
        public readonly ?string $reason = null,
    ) {}
}

class OrderStockService
{
    public function decreaseForOrder(Order $order): StockResult
    {
        foreach ($order->items as $item) {
            $product = Product::whereKey($item->product_id)
                ->lockForUpdate()
                ->first();

            if (!$product) {
                return new StockResult(
                    success: false,
                    productId: $item->product_id,
                    reason: 'Product no longer exists'
                );
            }

            if (!$product->manage_stock) {
                continue;
            }

            if ($product->available_stock < $item->quantity) {
                return new StockResult(
                    success: false,
                    productId: $product->id,
                    reason: 'Insufficient stock'
                );
            }

            $product->decrement('stock_quantity', $item->quantity);
        }

        return new StockResult(success: true);
    }
}
