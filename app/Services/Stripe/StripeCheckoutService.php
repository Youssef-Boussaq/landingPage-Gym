<?php

namespace App\Services\Stripe;

use App\Models\Order;
use Stripe\Checkout\Session;
use Stripe\Stripe;

class StripeCheckoutService
{
    public function createSession(Order $order, ?string $customerEmail = null): Session
    {
        Stripe::setApiKey(config('services.stripe.secret'));

        $lineItems = $order->items()
            ->with('product')
            ->get()
            ->map(function ($item) {
                return [
                    'price_data' => [
                        'currency' => 'mad',
                        'product_data' => [
                            'name' => $item->product->title,
                        ],
                        'unit_amount' => (int) round($item->unit_price * 100),
                    ],
                    'quantity' => $item->quantity,
                ];
            })
            ->values()
            ->toArray();

        if ($order->shipping_fee > 0) {
            $lineItems[] = [
                'price_data' => [
                    'currency' => 'mad',
                    'product_data' => [
                        'name' => 'Frais de livraison',
                    ],
                    'unit_amount' => (int) round($order->shipping_fee * 100),
                ],
                'quantity' => 1,
            ];
        }

        $sessionPayload = [
            'mode' => 'payment',
            'line_items' => $lineItems,
            'success_url' => route('checkout.success', $order) . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('checkout.cancel', $order),
            'metadata' => [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
            ],
            'payment_intent_data' => [
                'metadata' => [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                ],
            ],
        ];

        if (!empty($customerEmail)) {
            $sessionPayload['customer_email'] = $customerEmail;
        }

        return Session::create($sessionPayload);
    }
}
