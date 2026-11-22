<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductReview;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductReview>
 */
class ProductReviewFactory extends Factory
{
    protected $model = ProductReview::class;

    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'user_id' => null,
            'order_id' => null,
            'reviewer_name' => fake()->name(),
            'reviewer_email' => fake()->safeEmail(),
            'rating' => fake()->optional(0.7)->numberBetween(1, 5),
            'title' => fake()->optional(0.5)->sentence(4),
            'comment' => fake()->paragraph(),
            'is_verified_purchase' => false,
            'status' => 'pending',
            'admin_reply' => null,
            'admin_replied_at' => null,
        ];
    }

    public function approved(): static
    {
        return $this->state(fn () => [
            'status' => 'approved',
        ]);
    }

    public function pending(): static
    {
        return $this->state(fn () => [
            'status' => 'pending',
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn () => [
            'status' => 'rejected',
        ]);
    }

    public function verified(): static
    {
        return $this->state(fn () => [
            'is_verified_purchase' => true,
        ]);
    }

    public function withRating(int $rating = 5): static
    {
        return $this->state(fn () => [
            'rating' => $rating,
        ]);
    }

    public function unrated(): static
    {
        return $this->state(fn () => [
            'rating' => null,
        ]);
    }
}

