<?php

namespace Database\Factories;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => null,
            'guest_token' => (string) Str::uuid(),
            'order_number' => 'ORD-'.now()->format('Y').'-'.strtoupper(Str::random(8)),
            'status' => OrderStatus::PENDING,
            'payment_status' => PaymentStatus::PENDING,
            'total_amount' => fake()->randomFloat(2, 50, 2000),
            'payment_method' => 'cash',
            'transaction_id' => null,
            'customer_name' => fake()->name(),
            'customer_email' => fake()->safeEmail(),
            'customer_phone' => fake()->phoneNumber(),
            'shipping_address' => fake()->streetAddress(),
            'city' => fake()->city(),
            'postal_code' => fake()->postcode(),
        ];
    }
}
