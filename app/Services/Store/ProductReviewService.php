<?php

namespace App\Services\Store;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductReview;
use App\Models\User;
use App\Notifications\ProductReviewSubmittedNotification;
use Illuminate\Support\Facades\Log;

class ProductReviewService
{
    /**
     * Determine if a review submission corresponds to a verified purchase
     * of the given product by the user or guest email.
     *
     * @return array{is_verified: bool, order_id: ?int}
     */
    public function verifyPurchase(Product $product, ?User $user, ?string $email): array
    {
        $deliveredStatus = OrderStatus::DELIVERED;

        // 1. Check authenticated user's delivered orders
        if ($user) {
            $matchingOrder = Order::query()
                ->where('user_id', $user->id)
                ->where('status', $deliveredStatus)
                ->whereHas('items', function ($q) use ($product) {
                    $q->where('product_id', $product->id);
                })
                ->latest()
                ->first();

            if ($matchingOrder) {
                return [
                    'is_verified' => true,
                    'order_id'    => $matchingOrder->id,
                ];
            }
        }

        // 2. Check guest / customer by email
        if (!empty($email)) {
            $matchingOrder = Order::query()
                ->where('customer_email', $email)
                ->where('status', $deliveredStatus)
                ->whereHas('items', function ($q) use ($product) {
                    $q->where('product_id', $product->id);
                })
                ->latest()
                ->first();

            if ($matchingOrder) {
                return [
                    'is_verified' => true,
                    'order_id'    => $matchingOrder->id,
                ];
            }
        }

        return [
            'is_verified' => false,
            'order_id'    => null,
        ];
    }

    /**
     * Create a new review with verified status and notify admins.
     */
    public function createReview(Product $product, array $validated, ?User $user): ProductReview
    {
        $verification = $this->verifyPurchase(
            $product,
            $user,
            $validated['reviewer_email'] ?? null
        );

        $review = ProductReview::create([
            'product_id'           => $product->id,
            'user_id'              => $user?->id,
            'order_id'             => $verification['order_id'],
            'reviewer_name'        => trim($validated['reviewer_name']),
            'reviewer_email'       => !empty($validated['reviewer_email']) ? trim($validated['reviewer_email']) : null,
            'rating'               => !empty($validated['rating']) ? (int) $validated['rating'] : null,
            'title'                => !empty($validated['title']) ? trim($validated['title']) : null,
            'comment'              => trim($validated['comment']),
            'is_verified_purchase' => $verification['is_verified'],
            'status'               => 'pending', // Always pending initially for moderation
        ]);

        $this->notifyAdmins($review);

        return $review;
    }

    /**
     * Notify store admins of the new review awaiting moderation.
     */
    protected function notifyAdmins(ProductReview $review): void
    {
        try {
            $notification = new ProductReviewSubmittedNotification($review);
            User::query()
                ->where('role', 'admin')
                ->get()
                ->each(function (User $admin) use ($notification) {
                    $admin->notify(clone $notification);
                });
        } catch (\Throwable $e) {
            // Do not break the user flow if notification delivery fails, but log it
            Log::warning('Failed to notify admins of new review', [
                'review_id' => $review->id,
                'error'     => $e->getMessage(),
            ]);
        }
    }
}
