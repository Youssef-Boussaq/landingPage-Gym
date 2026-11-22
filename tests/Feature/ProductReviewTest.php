<?php

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductReview;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
});

test('submitting a feedback message without a rating succeeds and is saved as pending', function () {
    $product = Product::factory()->create(['is_active' => true]);

    $response = $this->post(route('store.products.reviews.store', $product->id), [
        'reviewer_name'  => 'John Doe',
        'reviewer_email' => 'john@example.com',
        'rating'         => null,
        'title'          => 'Mon expérience',
        'comment'        => 'Ce produit est excellent pour mes entraînements quotidiens !',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $review = ProductReview::where('product_id', $product->id)->first();
    expect($review)->not->toBeNull();
    expect($review->reviewer_name)->toBe('John Doe');
    expect($review->rating)->toBeNull();
    expect($review->comment)->toBe('Ce produit est excellent pour mes entraînements quotidiens !');
    expect($review->status)->toBe('pending');
});

test('submitting a message with a rating between 1 and 5 succeeds', function () {
    $product = Product::factory()->create(['is_active' => true]);

    $response = $this->post(route('store.products.reviews.store', $product->id), [
        'reviewer_name'  => 'Sarah Connor',
        'reviewer_email' => 'sarah@example.com',
        'rating'         => 5,
        'title'          => 'Parfait',
        'comment'        => 'Goût exceptionnel et très digeste. Je recommande vivement.',
    ]);

    $response->assertRedirect();

    $review = ProductReview::where('product_id', $product->id)->first();
    expect($review)->not->toBeNull();
    expect($review->rating)->toBe(5);
    expect($review->status)->toBe('pending');
});

test('invalid rating values fail validation', function ($invalidRating) {
    $product = Product::factory()->create(['is_active' => true]);

    $response = $this->post(route('store.products.reviews.store', $product->id), [
        'reviewer_name'  => 'Test User',
        'reviewer_email' => 'test@example.com',
        'rating'         => $invalidRating,
        'comment'        => 'Message valide pour le test de validation.',
    ]);

    $response->assertSessionHasErrors('rating');
})->with([
    0,
    6,
    -1,
    'five_stars',
]);

test('empty or too short comment fails validation', function ($invalidComment) {
    $product = Product::factory()->create(['is_active' => true]);

    $response = $this->post(route('store.products.reviews.store', $product->id), [
        'reviewer_name' => 'Test User',
        'comment'       => $invalidComment,
    ]);

    $response->assertSessionHasErrors('comment');
})->with([
    '',
    null,
    'hi',
]);

test('authenticated user review submission associates user_id', function () {
    $user = User::factory()->create(['role' => 'customer']);
    $product = Product::factory()->create(['is_active' => true]);

    $response = $this->actingAs($user)->post(route('store.products.reviews.store', $product->id), [
        'reviewer_name'  => $user->name,
        'reviewer_email' => $user->email,
        'rating'         => 4,
        'comment'        => 'Très bon produit acheté le mois dernier.',
    ]);

    $response->assertRedirect();

    $review = ProductReview::where('product_id', $product->id)->first();
    expect($review->user_id)->toBe($user->id);
});

test('verified purchase is detected when authenticated user has a delivered order for the product', function () {
    $user = User::factory()->create(['role' => 'customer']);
    $product = Product::factory()->create(['is_active' => true]);

    // Create a DELIVERED order for this user containing the product
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status'  => OrderStatus::DELIVERED,
    ]);
    OrderItem::create([
        'order_id'   => $order->id,
        'product_id' => $product->id,
        'quantity'   => 1,
        'unit_price' => 200,
    ]);

    $this->actingAs($user)->post(route('store.products.reviews.store', $product->id), [
        'reviewer_name'  => $user->name,
        'reviewer_email' => $user->email,
        'comment'        => 'Mon retour après réception de ma commande.',
    ])->assertRedirect();

    $review = ProductReview::where('product_id', $product->id)->first();
    expect($review->is_verified_purchase)->toBeTrue();
    expect($review->order_id)->toBe($order->id);
});

test('verified purchase is detected for guest customers via email match with a delivered order', function () {
    $product = Product::factory()->create(['is_active' => true]);

    $guestEmail = 'guest.fitness@example.com';

    $order = Order::factory()->create([
        'user_id'        => null,
        'customer_email' => $guestEmail,
        'status'         => OrderStatus::DELIVERED,
    ]);
    OrderItem::create([
        'order_id'   => $order->id,
        'product_id' => $product->id,
        'quantity'   => 2,
        'unit_price' => 150,
    ]);

    $this->post(route('store.products.reviews.store', $product->id), [
        'reviewer_name'  => 'Guest Buyer',
        'reviewer_email' => $guestEmail,
        'comment'        => 'Super qualité en tant qu invité.',
    ])->assertRedirect();

    $review = ProductReview::where('product_id', $product->id)->first();
    expect($review->is_verified_purchase)->toBeTrue();
    expect($review->order_id)->toBe($order->id);
});

test('orders not in delivered status do not grant verified purchase badge', function () {
    $user = User::factory()->create(['role' => 'customer']);
    $product = Product::factory()->create(['is_active' => true]);

    // Order is only pending or shipped, not yet delivered
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status'  => OrderStatus::PENDING,
    ]);
    OrderItem::create([
        'order_id'   => $order->id,
        'product_id' => $product->id,
        'quantity'   => 1,
        'unit_price' => 200,
    ]);

    $this->actingAs($user)->post(route('store.products.reviews.store', $product->id), [
        'reviewer_name'  => $user->name,
        'reviewer_email' => $user->email,
        'comment'        => 'Commande pas encore livrée.',
    ])->assertRedirect();

    $review = ProductReview::where('product_id', $product->id)->first();
    expect($review->is_verified_purchase)->toBeFalse();
});

test('client cannot forge status or verified purchase parameters', function () {
    $product = Product::factory()->create(['is_active' => true]);

    $this->post(route('store.products.reviews.store', $product->id), [
        'reviewer_name'        => 'Hacker',
        'reviewer_email'       => 'hacker@example.com',
        'comment'              => 'Tentative de contournement.',
        'status'               => 'approved',
        'is_verified_purchase' => true,
        'order_id'             => 9999,
    ])->assertRedirect();

    $review = ProductReview::where('product_id', $product->id)->first();
    expect($review->status)->toBe('pending');
    expect($review->is_verified_purchase)->toBeFalse();
    expect($review->order_id)->toBeNull();
});

test('public product page only displays approved reviews', function () {
    $product = Product::factory()->create(['is_active' => true]);

    ProductReview::factory()->create([
        'product_id' => $product->id,
        'comment'    => 'Avis approuvé visible',
        'status'     => 'approved',
        'rating'     => 5,
    ]);

    ProductReview::factory()->create([
        'product_id' => $product->id,
        'comment'    => 'Avis en attente masqué',
        'status'     => 'pending',
    ]);

    ProductReview::factory()->create([
        'product_id' => $product->id,
        'comment'    => 'Avis rejeté masqué',
        'status'     => 'rejected',
    ]);

    $response = $this->get(route('store.products.show', $product->id));
    $response->assertOk();

    $response->assertInertia(fn (Assert $page) => $page
        ->component('Store/Products/Show')
        ->has('product.reviews', 1)
        ->where('product.reviews.0.content', 'Avis approuvé visible')
        ->where('product.reviews_count', 1)
    );
});

test('reviews without ratings do not distort the average rating calculation', function () {
    $product = Product::factory()->create(['is_active' => true]);

    // Two rated reviews (5 and 3 => average 4.0)
    ProductReview::factory()->create([
        'product_id' => $product->id,
        'status'     => 'approved',
        'rating'     => 5,
        'comment'    => 'Super 5 étoiles',
    ]);
    ProductReview::factory()->create([
        'product_id' => $product->id,
        'status'     => 'approved',
        'rating'     => 3,
        'comment'    => 'Moyen 3 étoiles',
    ]);

    // Two unrated customer feedback messages
    ProductReview::factory()->create([
        'product_id' => $product->id,
        'status'     => 'approved',
        'rating'     => null,
        'comment'    => 'Message sans note 1',
    ]);
    ProductReview::factory()->create([
        'product_id' => $product->id,
        'status'     => 'approved',
        'rating'     => null,
        'comment'    => 'Message sans note 2',
    ]);

    $stats = $product->review_stats;

    // Total count should be 4
    expect($stats['total_reviews'])->toBe(4);
    // Rated count should be 2
    expect($stats['ratings_count'])->toBe(2);
    // Unrated count should be 2
    expect($stats['unrated_count'])->toBe(2);
    // Average should be EXACTLY 4.0 (5 + 3) / 2, not (5 + 3 + 0 + 0) / 4 = 2.0!
    expect($stats['average_rating'])->toBe(4.0);
    expect($stats['has_ratings'])->toBeTrue();

    // Rating distribution: exactly one 5-star and one 3-star (50% each of rated reviews)
    expect($stats['distribution'][5])->toBe(1);
    expect($stats['distribution'][3])->toBe(1);
    expect($stats['distribution'][1])->toBe(0);
    expect($stats['distribution_percentages'][5])->toBe(50);
});

test('when all approved reviews are unrated messages, average rating is null and not 0.0', function () {
    $product = Product::factory()->create(['is_active' => true]);

    ProductReview::factory()->create([
        'product_id' => $product->id,
        'status'     => 'approved',
        'rating'     => null,
        'comment'    => 'Juste un message sans note.',
    ]);

    $stats = $product->review_stats;

    expect($stats['total_reviews'])->toBe(1);
    expect($stats['ratings_count'])->toBe(0);
    expect($stats['unrated_count'])->toBe(1);
    expect($stats['average_rating'])->toBeNull();
    expect($stats['has_ratings'])->toBeFalse();
});

test('unauthorized users cannot access admin review moderation', function () {
    $customer = User::factory()->create(['role' => 'customer']);

    $this->get(route('admin.product-reviews.index'))->assertRedirect(route('login'));

    $this->actingAs($customer)
        ->get(route('admin.product-reviews.index'))
        ->assertForbidden();
});

test('admin can view reviews and update review status', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $review = ProductReview::factory()->create(['status' => 'pending']);

    $this->actingAs($admin)
        ->get(route('admin.product-reviews.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Admin/ProductReviews/Index')
            ->has('reviews.data')
            ->has('stats')
        );

    // Approve the review
    $this->actingAs($admin)
        ->patch(route('admin.product-reviews.status', $review->id), [
            'status' => 'approved',
        ])
        ->assertRedirect();

    expect($review->fresh()->status)->toBe('approved');

    // Reject the review
    $this->actingAs($admin)
        ->patch(route('admin.product-reviews.status', $review->id), [
            'status' => 'rejected',
        ])
        ->assertRedirect();

    expect($review->fresh()->status)->toBe('rejected');
});

test('admin can add, edit, and clear an official reply to a customer review', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $review = ProductReview::factory()->create(['status' => 'approved']);

    // Add reply
    $this->actingAs($admin)
        ->post(route('admin.product-reviews.reply', $review->id), [
            'admin_reply' => 'Merci pour votre retour ! Toute l équipe vous encourage.',
        ])
        ->assertRedirect();

    $review->refresh();
    expect($review->admin_reply)->toBe('Merci pour votre retour ! Toute l équipe vous encourage.');
    expect($review->admin_replied_at)->not->toBeNull();

    // Clear reply
    $this->actingAs($admin)
        ->post(route('admin.product-reviews.reply', $review->id), [
            'admin_reply' => '',
        ])
        ->assertRedirect();

    $review->refresh();
    expect($review->admin_reply)->toBeNull();
    expect($review->admin_replied_at)->toBeNull();
});

test('admin can delete a review', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $review = ProductReview::factory()->create();

    $this->actingAs($admin)
        ->delete(route('admin.product-reviews.destroy', $review->id))
        ->assertRedirect();

    expect(ProductReview::find($review->id))->toBeNull();
});
