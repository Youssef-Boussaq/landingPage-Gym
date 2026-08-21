<?php

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('guests are redirected away from the admin dashboard', function () {
    $this->get('/admin')->assertRedirect(route('login'));
});

test('customers cannot access the admin dashboard', function () {
    $user = User::factory()->create(['role' => 'customer']);

    $this->actingAs($user)
        ->get('/admin')
        ->assertForbidden();
});

test('admins can access the admin dashboard', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get('/admin')
        ->assertOk();
});

test('admins can view any order while customers cannot view others', function () {
    $admin = User::factory()->admin()->create();
    $customer = User::factory()->create();

    $guestOrder = Order::factory()->create([
        'user_id' => null,
        'guest_token' => 'guest-token-a',
    ]);

    $clientOrder = Order::factory()->create([
        'user_id' => $customer->id,
        'guest_token' => null,
    ]);

    $this->actingAs($admin)
        ->get(route('admin.orders.show', $guestOrder))
        ->assertOk();

    $this->actingAs($admin)
        ->get(route('orders.show', $guestOrder))
        ->assertOk();

    $this->actingAs($customer)
        ->get(route('orders.show', $clientOrder))
        ->assertOk();

    $this->actingAs($customer)
        ->get(route('orders.show', $guestOrder))
        ->assertForbidden();
});

test('a guest can view only their own order', function () {
    $guestOrder = Order::factory()->create([
        'user_id' => null,
        'guest_token' => 'guest-token-a',
    ]);

    $otherGuestOrder = Order::factory()->create([
        'user_id' => null,
        'guest_token' => 'guest-token-b',
    ]);

    $this->withCookie('guest_token', 'guest-token-a')
        ->get(route('orders.show', $guestOrder))
        ->assertOk();

    $this->withCookie('guest_token', 'guest-token-a')
        ->get(route('orders.show', $otherGuestOrder))
        ->assertForbidden();
});

test('admin can transition order status from pending to confirmed', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->create([
        'status' => OrderStatus::PENDING,
        'payment_status' => PaymentStatus::PENDING,
    ]);

    $this->actingAs($admin)
        ->patch(route('admin.orders.status', $order), [
            'status' => OrderStatus::CONFIRMED->value,
        ])
        ->assertRedirect();

    expect($order->fresh()->status)->toBe(OrderStatus::CONFIRMED);
    expect($order->fresh()->payment_status)->toBe(PaymentStatus::PENDING);
});

test('admin cannot skip order status steps', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->create([
        'status' => OrderStatus::PENDING,
    ]);

    $this->actingAs($admin)
        ->patch(route('admin.orders.status', $order), [
            'status' => OrderStatus::SHIPPED->value,
        ])
        ->assertSessionHasErrors('status');
});

test('admin can create a product that appears in the store', function () {
    Storage::fake('public');

    $admin = User::factory()->admin()->create();
    $category = \App\Models\Category::factory()->create();

    $this->actingAs($admin)
        ->post(route('admin.products.store'), [
            'title' => 'Test Whey',
            'slug' => 'test-whey',
            'type' => 'physical',
            'price' => 199,
            'sale_price' => 149,
            'stock_quantity' => 20,
            'manage_stock' => true,
            'is_active' => true,
            'category_ids' => [$category->id],
            'images' => [UploadedFile::fake()->image('cover.jpg')],
            'primary_index' => 0,
        ])
        ->assertRedirect();

    $product = Product::query()->where('slug', 'test-whey')->first();

    expect($product)->not->toBeNull();
    expect($product->is_active)->toBeTrue();
});
