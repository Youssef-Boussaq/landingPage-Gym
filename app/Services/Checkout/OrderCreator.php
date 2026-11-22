<?php

namespace App\Services\Checkout;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use Illuminate\Support\Str;

class OrderCreator
{
    public function create(
        array $validated,
        array $cart,
        array $calculation,
        ?int $userId,
        ?string $guestToken,
        string $customerName,
        string $customerEmail,
    ): Order {
        $order = Order::create([
            'user_id' => $userId,
            'guest_token' => $guestToken,
            'order_number' => 'ORD-' . now()->format('Y') . '-' . strtoupper(Str::random(8)),
            'status' => OrderStatus::PENDING,
            'payment_status' => PaymentStatus::PENDING,
            'total_amount' => $calculation['total'],
            'shipping_fee' => $calculation['shipping_fee'],
            'payment_method' => $validated['payment_method'],
            'transaction_id' => null,
            'customer_name' => $customerName,
            'customer_email' => $customerEmail,
            'customer_phone' => $validated['customer_phone'] ?? 'N/A',
            'shipping_address' => $validated['shipping_address'] ?? 'Commande numérique (Livraison par email)',
            'city' => $validated['city'] ?? 'En ligne',
            'postal_code' => $validated['postal_code'] ?? null,
        ]);

        foreach ($cart as $item) {
            $product = $calculation['products']->get($item['id']);
            $unitPrice = $product->sale_price ?? $product->price;

            $order->items()->create([
                'product_id' => $product->id,
                'quantity' => (int) $item['quantity'],
                'unit_price' => $unitPrice,
            ]);
        }

        return $order;
    }
}
