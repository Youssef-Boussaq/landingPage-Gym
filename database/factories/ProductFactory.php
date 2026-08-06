<?php

namespace Database\Factories;

use App\Enums\ProductType;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->words(3, true),
            'slug' => fake()->unique()->slug(),
            'type' => fake()->randomElement([ProductType::PHYSICAL->value, ProductType::DIGITAL->value]),
            'price' => fake()->randomFloat(2, 5, 500),
            'sale_price' => fake()->optional(0.4)->randomFloat(2, 1, 400),
            'stock_quantity' => fake()->optional(0.3)->numberBetween(0, 200),
            'manage_stock' => fake()->boolean(70),
            'is_active' => fake()->boolean(90),
        ];
    }
}
