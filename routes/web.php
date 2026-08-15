<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\StripeWebhookController;


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




require __DIR__.'/auth.php';
