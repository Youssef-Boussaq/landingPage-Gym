<?php

namespace App\Services\Checkout;

use App\Models\Product;

class CartCalculator
{
    public function calculate(array $cart): array
    {
        $productIds = collect($cart)
            ->pluck('id')
            ->unique()
            ->values();

        $products = Product::whereIn('id', $productIds)
            ->lockForUpdate()
            ->get()
            ->keyBy('id');

        $subtotal = 0;

        foreach ($cart as $item) {
            $product = $products->get($item['id']);

            if (!$product) {
                throw new \RuntimeException(
                    'Un produit de votre panier n\'existe plus.'
                );
            }

            $quantity = (int) $item['quantity'];

            if ($quantity < 1) {
                throw new \RuntimeException(
                    'Quantité invalide.'
                );
            }

            if (!$product->is_active) {
                throw new \RuntimeException(
                    "Le produit {$product->title} n'est plus disponible."
                );
            }

            if (
                $product->manage_stock &&
                $product->available_stock < $quantity
            ) {
                throw new \RuntimeException(
                    "Stock insuffisant pour « {$product->title} »."
                    . " Quantité demandée : {$quantity}."
                    . " Stock disponible : {$product->available_stock}."
                );
            }

            $unitPrice = $product->sale_price ?? $product->price;

            $subtotal += (float) $unitPrice * $quantity;
        }

        $shippingFee = $subtotal > 250 ? 0 : 35;

        return [
            'products' => $products,
            'subtotal' => $subtotal,
            'shipping_fee' => $shippingFee,
            'total' => $subtotal + $shippingFee,
        ];
    }
}
