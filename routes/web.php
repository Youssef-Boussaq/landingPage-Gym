<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\StripeWebhookController;
use App\Http\Controllers\NotificationController;

use App\Http\Controllers\OrderController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/store', [App\Http\Controllers\ProductController::class, 'index'])
    ->name('store.index');

Route::get('/store/cart', [CartController::class, 'index'])
    ->name('store.cart.index');

Route::get('/store/products/{id}', [App\Http\Controllers\ProductController::class, 'show'])
    ->name('store.products.show');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
});
Route::post('/cart/add', [CartController::class, 'add'])
    ->name('cart.add');
Route::patch('/cart/update', [CartController::class, 'update'])
    ->name('cart.update');
Route::delete('/cart/remove', [CartController::class, 'remove'])
    ->name('cart.remove');


Route::get('/checkout', [CheckoutController::class, 'index'])
    ->name('checkout.index');
Route::post('/checkout', [CheckoutController::class, 'store'])
    ->name('checkout.store');
Route::get('/checkout/success/{order}', [CheckoutController::class, 'success'])
    ->name('checkout.success');

Route::get('/checkout/cancel/{order}', [CheckoutController::class, 'cancel'])
    ->name('checkout.cancel');



    

Route::post(
    '/stripe/webhook',
    [StripeWebhookController::class, 'handle']
)->name('stripe.webhook');

    

Route::get('/orders/{order}', [OrderController::class, 'show'])
    ->name('orders.show');



Route::post(
    '/notifications/{notification}/read',
    [NotificationController::class, 'markAsRead']
)->name('notifications.read');

Route::post(
    '/notifications/read-all',
    [NotificationController::class, 'markAllAsRead']
)->name('notifications.read-all');
    

Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\DashboardController::class, 'index'])
            ->name('dashboard');

        Route::get('/orders', [App\Http\Controllers\Admin\OrderController::class, 'index'])
            ->name('orders.index');
        Route::get('/orders/{order}', [App\Http\Controllers\Admin\OrderController::class, 'show'])
            ->name('orders.show');
        Route::patch('/orders/{order}/status', [App\Http\Controllers\Admin\OrderController::class, 'updateStatus'])
            ->name('orders.status');

        Route::get('/products', [App\Http\Controllers\Admin\ProductController::class, 'index'])
            ->name('products.index');
        Route::get('/products/create', [App\Http\Controllers\Admin\ProductController::class, 'create'])
            ->name('products.create');
        Route::post('/products', [App\Http\Controllers\Admin\ProductController::class, 'store'])
            ->name('products.store');
        Route::get('/products/{product}', [App\Http\Controllers\Admin\ProductController::class, 'show'])
            ->name('products.show');
        Route::get('/products/{product}/edit', [App\Http\Controllers\Admin\ProductController::class, 'edit'])
            ->name('products.edit');
        Route::put('/products/{product}', [App\Http\Controllers\Admin\ProductController::class, 'update'])
            ->name('products.update');
        Route::delete('/products/{product}', [App\Http\Controllers\Admin\ProductController::class, 'destroy'])
            ->name('products.destroy');
        Route::post('/products/{id}/restore', [App\Http\Controllers\Admin\ProductController::class, 'restore'])
            ->name('products.restore');
        Route::patch('/products/{product}/deactivate', [App\Http\Controllers\Admin\ProductController::class, 'deactivate'])
            ->name('products.deactivate');

        Route::get('/categories', [App\Http\Controllers\Admin\CategoryController::class, 'index'])
            ->name('categories.index');
        Route::get('/categories/create', [App\Http\Controllers\Admin\CategoryController::class, 'create'])
            ->name('categories.create');
        Route::post('/categories', [App\Http\Controllers\Admin\CategoryController::class, 'store'])
            ->name('categories.store');
        Route::get('/categories/{category}', [App\Http\Controllers\Admin\CategoryController::class, 'show'])
            ->name('categories.show');
        Route::get('/categories/{category}/edit', [App\Http\Controllers\Admin\CategoryController::class, 'edit'])
            ->name('categories.edit');
        Route::put('/categories/{category}', [App\Http\Controllers\Admin\CategoryController::class, 'update'])
            ->name('categories.update');
        Route::delete('/categories/{category}', [App\Http\Controllers\Admin\CategoryController::class, 'destroy'])
            ->name('categories.destroy');
        Route::post('/categories/quick-store', [App\Http\Controllers\Admin\CategoryController::class, 'quickStore'])
    ->name('categories.quick-store');

        Route::get('/customers', [App\Http\Controllers\Admin\CustomerController::class, 'index'])
            ->name('customers.index');
        Route::get('/customers/{user}', [App\Http\Controllers\Admin\CustomerController::class, 'show'])
            ->name('customers.show');

        Route::get('/notifications', [App\Http\Controllers\Admin\NotificationController::class, 'index'])
            ->name('notifications.index');
        Route::post('/notifications/{notification}/read', [App\Http\Controllers\Admin\NotificationController::class, 'markAsRead'])
            ->name('notifications.read');

        Route::get('/settings', [App\Http\Controllers\Admin\SettingsController::class, 'index'])
            ->name('settings');
    });

require __DIR__.'/auth.php';
