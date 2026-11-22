<?php

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Enums\ProductType;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Services\Checkout\CartCalculator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('cart calculator applies 0 MAD shipping for digital products', function () {
    $digitalProduct = Product::factory()->create([
        'type' => ProductType::DIGITAL,
        'price' => 149.00,
        'sale_price' => null,
        'manage_stock' => false,
        'stock_quantity' => null,
        'is_active' => true,
    ]);

    $cart = [
        [
            'id' => $digitalProduct->id,
            'quantity' => 1,
            'price' => 149.00,
            'type' => 'digital',
        ]
    ];

    $calculator = new CartCalculator();
    $result = $calculator->calculate($cart);

    expect($result['shipping_fee'])->toBe(0)
        ->and($result['subtotal'])->toBe(149.0)
        ->and($result['total'])->toBe(149.0)
        ->and($result['all_digital'])->toBeTrue();
});

test('admin can export orders to csv with date range filters', function () {
    $admin = User::factory()->admin()->create();
    $product = Product::factory()->create(['title' => 'E-Book Fitness']);

    $orderRecent = Order::factory()->create([
        'order_number' => 'ORD-RECENT-1234',
        'customer_name' => 'Sara Alami',
        'customer_email' => 'sara@example.com',
        'customer_phone' => '0612345678',
        'status' => OrderStatus::DELIVERED->value,
        'payment_status' => PaymentStatus::PAID->value,
        'total_amount' => 350.00,
        'shipping_fee' => 0.00,
        'created_at' => now()->subDays(5),
    ]);

    OrderItem::factory()->create([
        'order_id' => $orderRecent->id,
        'product_id' => $product->id,
        'quantity' => 1,
        'unit_price' => 350.00,
    ]);

    $orderLastMonth = Order::factory()->create([
        'order_number' => 'ORD-PREV-5678',
        'customer_name' => 'Karim Idrissi',
        'customer_email' => 'karim@example.com',
        'customer_phone' => '0698765432',
        'status' => OrderStatus::DELIVERED->value,
        'payment_status' => PaymentStatus::PAID->value,
        'total_amount' => 200.00,
        'shipping_fee' => 0.00,
        'created_at' => now()->subMonthNoOverflow()->startOfMonth()->addDays(5),
    ]);

    OrderItem::factory()->create([
        'order_id' => $orderLastMonth->id,
        'product_id' => $product->id,
        'quantity' => 1,
        'unit_price' => 200.00,
    ]);

    // Test 15 days
    $res15 = $this->actingAs($admin)->get(route('admin.export', ['range' => '15_days']));
    $res15->assertOk();
    $res15->assertHeader('content-type', 'text/csv; charset=UTF-8');
    $content15 = $res15->streamedContent();
    expect($content15)->toContain('N° Commande')
        ->and($content15)->toContain('ORD-RECENT-1234')
        ->and($content15)->not->toContain('ORD-PREV-5678');

    // Test last month
    $resLastMonth = $this->actingAs($admin)->get(route('admin.export', ['range' => 'last_month']));
    $resLastMonth->assertOk();
    $contentLM = $resLastMonth->streamedContent();
    expect($contentLM)->toContain('N° Commande')
        ->and($contentLM)->toContain('ORD-PREV-5678')
        ->and($contentLM)->not->toContain('ORD-RECENT-1234');

    // Test all
    $resAll = $this->actingAs($admin)->get(route('admin.export', ['range' => 'all']));
    $resAll->assertOk();
    $contentAll = $resAll->streamedContent();
    expect($contentAll)->toContain('N° Commande')
        ->and($contentAll)->toContain('ORD-RECENT-1234')
        ->and($contentAll)->toContain('ORD-PREV-5678');
});

test('digital product creation sanitizes stock fields', function () {
    Storage::fake('public');
    $admin = User::factory()->admin()->create();
    $category = Category::factory()->create();

    $response = $this->actingAs($admin)->post(route('admin.products.store'), [
        'title' => 'Programme Transformation 12 Semaines',
        'slug' => 'programme-transformation-12-semaines-' . uniqid(),
        'description' => 'Un guide digital complet.',
        'price' => 199.00,
        'sale_price' => 149.00,
        'type' => 'digital',
        'manage_stock' => true,      // sent from client, should be forced to false
        'stock_quantity' => 50,      // sent from client, should be forced to null
        'category_ids' => [$category->id],
        'is_active' => true,
        'images' => [
            UploadedFile::fake()->create('cover.jpg', 100, 'image/jpeg'),
        ],
    ]);

    $response->assertSessionHasNoErrors();

    $created = Product::where('title', 'Programme Transformation 12 Semaines')->first();
    expect($created)->not->toBeNull()
        ->and($created->type)->toBe(ProductType::DIGITAL)
        ->and($created->manage_stock)->toBeFalse()
        ->and($created->stock_quantity)->toBeNull();
});

test('digital checkout validation requires email, ignores physical address and rejects cash on delivery', function () {
    $digitalProduct = Product::factory()->create([
        'type' => ProductType::DIGITAL,
        'price' => 149.00,
        'manage_stock' => false,
        'stock_quantity' => null,
        'is_active' => true,
    ]);

    $sessionData = [
        'buy_now' => [
            'product_id' => $digitalProduct->id,
            'quantity' => 1,
            'variant_id' => null,
        ],
    ];

    // 1. Missing email should fail
    $responseNoEmail = $this->withSession($sessionData)->post(route('checkout.store'), [
        'checkout_mode' => 'buy_now',
        'customer_first_name' => 'John',
        'customer_last_name' => 'Doe',
        'customer_email' => '',
        'customer_phone' => '0612345678',
        'payment_method' => 'stripe',
    ]);
    $responseNoEmail->assertSessionHasErrors(['customer_email']);

    // 2. COD on digital should fail
    $responseCod = $this->withSession($sessionData)->post(route('checkout.store'), [
        'checkout_mode' => 'buy_now',
        'customer_first_name' => 'John',
        'customer_last_name' => 'Doe',
        'customer_email' => 'john@example.com',
        'customer_phone' => '0612345678',
        'payment_method' => 'cash_on_delivery',
    ]);
    $responseCod->assertSessionHasErrors(['payment_method']);
});

test('admin can upload digital file and provide external link for e-products', function () {
    Storage::fake('public');
    $admin = User::factory()->admin()->create();
    $category = Category::factory()->create();

    $response = $this->actingAs($admin)->post(route('admin.products.store'), [
        'title' => 'E-Book Musculation Avancée',
        'slug' => 'ebook-musculation-avancee-' . uniqid(),
        'description' => 'Un guide digital PDF.',
        'price' => 299.00,
        'type' => 'digital',
        'category_ids' => [$category->id],
        'is_active' => true,
        'images' => [
            UploadedFile::fake()->create('cover.jpg', 100, 'image/jpeg'),
        ],
        'digital_file' => UploadedFile::fake()->create('workout-plan.pdf', 2048, 'application/pdf'),
        'digital_download_link' => 'https://drive.google.com/file/d/example/view',
    ]);

    $response->assertSessionHasNoErrors();

    $created = Product::where('title', 'E-Book Musculation Avancée')->first();
    expect($created)->not->toBeNull()
        ->and($created->type)->toBe(ProductType::DIGITAL)
        ->and($created->digital_file_name)->toBe('workout-plan.pdf')
        ->and($created->digital_download_link)->toBe('https://drive.google.com/file/d/example/view')
        ->and($created->has_digital_content)->toBeTrue();

    Storage::disk('public')->assertExists($created->digital_file_path);
});

test('buyer can download digital product after order is paid and unauthorized access is blocked', function () {
    Storage::fake('public');
    $user = User::factory()->create(['email' => 'client@example.com']);
    $otherUser = User::factory()->create(['email' => 'other@example.com']);

    $filePath = 'digital_products/workout-guide.pdf';
    Storage::disk('public')->put($filePath, 'PDF-CONTENT-BINARY-STREAM');

    $digitalProduct = Product::factory()->create([
        'type' => ProductType::DIGITAL,
        'title' => 'Guide Musculation',
        'price' => 199.00,
        'digital_file_path' => $filePath,
        'digital_file_name' => 'workout-guide.pdf',
        'digital_file_size' => 26,
    ]);

    $paidOrder = Order::factory()->create([
        'user_id' => $user->id,
        'customer_email' => $user->email,
        'status' => OrderStatus::DELIVERED->value,
        'payment_status' => PaymentStatus::PAID->value,
    ]);

    OrderItem::factory()->create([
        'order_id' => $paidOrder->id,
        'product_id' => $digitalProduct->id,
        'quantity' => 1,
        'unit_price' => 199.00,
    ]);

    // 1. Authorized buyer can download
    $res = $this->actingAs($user)->get(route('checkout.digital.download', [
        'order' => $paidOrder->id,
        'product' => $digitalProduct->id,
    ]));
    $res->assertOk();
    $res->assertHeader('content-disposition', 'attachment; filename=workout-guide.pdf');

    // 2. Another user cannot download
    $resForbidden = $this->actingAs($otherUser)->get(route('checkout.digital.download', [
        'order' => $paidOrder->id,
        'product' => $digitalProduct->id,
    ]));
    $resForbidden->assertForbidden();
});

