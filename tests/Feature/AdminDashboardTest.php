<?php

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Carbon\CarbonImmutable;
use Inertia\Testing\AssertableInertia as Assert;
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

test('dashboard analytics apply date and payment filters and exclude cancelled orders from revenue', function () {
    $admin = User::factory()->admin()->create();
    $this->travelTo(CarbonImmutable::parse('2026-11-18 12:00:00', config('app.timezone')));

    $order = function (string $date, string $status, string $paymentStatus, float $amount): Order {
        $order = Order::factory()->create([
            'status' => $status,
            'payment_status' => $paymentStatus,
            'total_amount' => $amount,
        ]);
        $order->forceFill(['created_at' => CarbonImmutable::parse($date, config('app.timezone'))])->saveQuietly();

        return $order;
    };

    $order('2026-11-15 10:00:00', OrderStatus::DELIVERED->value, PaymentStatus::PAID->value, 200);
    $order('2026-11-16 10:00:00', OrderStatus::CANCELLED->value, PaymentStatus::PAID->value, 90);
    $order('2026-11-17 10:00:00', OrderStatus::PENDING->value, PaymentStatus::PENDING->value, 300);
    $order('2026-11-10 10:00:00', OrderStatus::DELIVERED->value, PaymentStatus::PAID->value, 100);

    $this->actingAs($admin)
        ->get(route('admin.dashboard', [
            'period' => 'custom',
            'start_date' => '2026-11-12',
            'end_date' => '2026-11-18',
            'payment_status' => PaymentStatus::PAID->value,
        ]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Dashboard')
            ->where('filters.start_date', '2026-11-12')
            ->where('filters.end_date', '2026-11-18')
            ->where('stats.total_orders', 2)
            ->where('stats.total_revenue', 200)
            ->where('stats.paid_orders', 1)
            ->where('stats.average_order_value', 200)
            ->where('comparisons.total_revenue', fn ($val) => (float) $val === 100.0)
            ->where('revenueOverview', fn ($rows) => count($rows) === 7 && collect($rows)->sum('orders') === 2)
            ->where('recentOrders', fn ($orders) => count($orders) === 2)
        );
});

test('dashboard rejects invalid custom date ranges and status filters', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get(route('admin.dashboard', [
            'period' => 'custom',
            'start_date' => '2026-11-20',
            'end_date' => '2026-11-10',
        ]))
        ->assertSessionHasErrors('end_date');

    $this->actingAs($admin)
        ->get(route('admin.dashboard', ['status' => 'made-up-status']))
        ->assertSessionHasErrors('status');
});

test('dashboard quick presets resolve to the expected calendar dates', function () {
    $admin = User::factory()->admin()->create();
    $this->travelTo(CarbonImmutable::parse('2026-11-18 12:00:00', config('app.timezone')));

    $ranges = [
        'today' => ['2026-11-18', '2026-11-18'],
        'yesterday' => ['2026-11-17', '2026-11-17'],
        'last_7_days' => ['2026-11-12', '2026-11-18'],
        'last_30_days' => ['2026-10-20', '2026-11-18'],
        'last_90_days' => ['2026-08-21', '2026-11-18'],
        'this_month' => ['2026-11-01', '2026-11-18'],
        'last_month' => ['2026-10-01', '2026-10-31'],
    ];

    foreach ($ranges as $period => [$startDate, $endDate]) {
        $this->actingAs($admin)
            ->get(route('admin.dashboard', ['period' => $period]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('filters.period', $period)
                ->where('filters.start_date', $startDate)
                ->where('filters.end_date', $endDate)
            );
    }
});

test('dashboard category analytics count and rank only paid items in the selected category', function () {
    $admin = User::factory()->admin()->create();
    $category = Category::factory()->create();
    $selectedProduct = Product::factory()->create(['title' => 'Selected product']);
    $otherProduct = Product::factory()->create(['title' => 'Other product']);
    $selectedProduct->categories()->attach($category);
    $order = Order::factory()->create([
        'status' => OrderStatus::DELIVERED,
        'payment_status' => PaymentStatus::PAID,
        'total_amount' => 300,
    ]);
    $order->forceFill(['created_at' => now()->startOfDay()->addHours(10)])->saveQuietly();
    OrderItem::query()->create(['order_id' => $order->id, 'product_id' => $selectedProduct->id, 'quantity' => 2, 'unit_price' => 100]);
    OrderItem::query()->create(['order_id' => $order->id, 'product_id' => $otherProduct->id, 'quantity' => 1, 'unit_price' => 50]);

    $this->actingAs($admin)
        ->get(route('admin.dashboard', [
            'period' => 'today',
            'category_id' => $category->id,
            'status' => OrderStatus::DELIVERED->value,
            'payment_status' => PaymentStatus::PAID->value,
        ]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('stats.total_orders', 1)
            ->where('stats.total_revenue', 200)
            ->where('stats.products_sold', 2)
            ->where('topProducts', fn ($products) => count($products) === 1 && (is_array($products) ? $products[0]['id'] : $products->first()['id']) === $selectedProduct->id)
        );
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
