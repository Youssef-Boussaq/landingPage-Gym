<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Events\OrderCreated;
use App\Models\Order;
use App\Models\Product;
use App\Support\CustomerIdentity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Stripe\Checkout\Session as StripeSession;
use Stripe\Stripe;

class CheckoutController extends Controller
{
    public function index()
    {
        $cart = session('cart', []);

        if (empty($cart)) {
            return redirect()
                ->route('cart.index')
                ->with('error', 'Votre panier est vide.');
        }

        $cartItems = collect($cart)
            ->map(function ($item) {
                return [
                    'key' => $item['id'],
                    'product_id' => $item['id'],
                    'name' => $item['title'],
                    'price' => $item['price'],
                    'quantity' => (int) $item['quantity'],
                    'type' => $item['type'],
                    'variant_id' => $item['variant_id'] ?? null,
                    'image' => $item['image'] ?? null,
                ];
            })
            ->values();

        return Inertia::render('Store/Checkout/Index', [
            'cart' => $cartItems,
            'isAuthenticated' => auth()->check(),
            'user' => auth()->user(),
        ]);
    }

    public function store(Request $request)
    {
        /*
        |--------------------------------------------------------------------------
        | Customer Identity
        |--------------------------------------------------------------------------
        */

        $identity = CustomerIdentity::resolve($request);

        $isAuthenticated = $identity->isAuthenticated();

        /*
        |--------------------------------------------------------------------------
        | Identity values
        |--------------------------------------------------------------------------
        */

        $userId = $identity->userId();
        $guestToken = $identity->guestToken();

        /*
        |--------------------------------------------------------------------------
        | 1. Validation
        |--------------------------------------------------------------------------
        */

        if ($isAuthenticated) {
            $validated = $request->validate([
                'customer_phone' => [
                    'required',
                    'string',
                    'max:30',
                ],

                'shipping_address' => [
                    'required',
                    'string',
                    'max:500',
                ],

                'city' => [
                    'required',
                    'string',
                    'max:100',
                ],

                'postal_code' => [
                    'nullable',
                    'string',
                    'max:20',
                ],

                'payment_method' => [
                    'required',
                    'in:stripe,cash',
                ],
            ]);
        } else {
            $validated = $request->validate([
                'customer_name' => [
                    'required',
                    'string',
                    'max:255',
                ],

                'customer_email' => [
                    'required',
                    'email',
                    'max:255',
                ],

                'customer_phone' => [
                    'required',
                    'string',
                    'max:30',
                ],

                'shipping_address' => [
                    'required',
                    'string',
                    'max:500',
                ],

                'city' => [
                    'required',
                    'string',
                    'max:100',
                ],

                'postal_code' => [
                    'nullable',
                    'string',
                    'max:20',
                ],

                'payment_method' => [
                    'required',
                    'in:stripe,cash',
                ],
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | 2. Get cart from session
        |--------------------------------------------------------------------------
        */

        $cart = session('cart', []);

        if (empty($cart)) {
            return back()->with(
                'error',
                'Votre panier est vide.'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | 3. Customer information
        |--------------------------------------------------------------------------
        */

        if ($identity->isAuthenticated()) {
            $customerName = $request->user()->name;
            $customerEmail = $request->user()->email;
        } else {
            $customerName = $validated['customer_name'];
            $customerEmail = $validated['customer_email'];
        }

        /*
        |--------------------------------------------------------------------------
        | 4. Create Order
        |--------------------------------------------------------------------------
        */

        $order = DB::transaction(function () use (
            $request,
            $validated,
            $cart,
            $customerName,
            $customerEmail,
            $userId,
            $guestToken
        ) {

            /*
            |--------------------------------------------------------------------------
            | Get product IDs from cart
            |--------------------------------------------------------------------------
            */

            $productIds = collect($cart)
                ->pluck('id')
                ->unique()
                ->values();

            /*
            |--------------------------------------------------------------------------
            | Lock products
            |--------------------------------------------------------------------------
            */

            $products = Product::whereIn('id', $productIds)
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            /*
            |--------------------------------------------------------------------------
            | Calculate total from DATABASE
            |--------------------------------------------------------------------------
            */

            $subtotal = 0;

            foreach ($cart as $item) {
                $product = $products->get($item['id']);

                if (!$product) {
                    throw new \RuntimeException(
                        'Un produit de votre panier n\'existe plus.'
                    );
                }

                $quantity = (int) $item['quantity'];

                if ($quantity < 1) {
                    throw new \RuntimeException(
                        'Quantité invalide.'
                    );
                }

                if (!$product->is_active) {
                    throw new \RuntimeException(
                        "Le produit {$product->title} n'est plus disponible."
                    );
                }

                if ($product->stock_quantity < $quantity) {
                    throw new \RuntimeException(
                        "Stock insuffisant pour {$product->title}."
                    );
                }

                /*
                |--------------------------------------------------------------------------
                | Never trust price from session
                |--------------------------------------------------------------------------
                */

                $unitPrice = $product->sale_price ?? $product->price;

                $subtotal += (float) $unitPrice * $quantity;
            }

            $shippingFee = $subtotal > 250 ? 0 : 35;
            $totalAmount = $subtotal + $shippingFee;

            /*
            |--------------------------------------------------------------------------
            | Order number
            |--------------------------------------------------------------------------
            */

            $orderNumber =
                'ORD-' .
                now()->format('Y') .
                '-' .
                strtoupper(Str::random(8));

            /*
            |--------------------------------------------------------------------------
            | Create Order
            |--------------------------------------------------------------------------
            */

            $order = Order::create([
                'user_id' => $userId,

                'guest_token' => $guestToken,

                'order_number' => $orderNumber,

                'status' => OrderStatus::PENDING,

                'payment_status' => PaymentStatus::PENDING,

                'total_amount' => $totalAmount,

                'shipping_fee' => $shippingFee,

                'payment_method' => $validated['payment_method'],

                'transaction_id' => null,

                'customer_name' => $customerName,

                'customer_email' => $customerEmail,

                'customer_phone' => $validated['customer_phone'],

                'shipping_address' => $validated['shipping_address'],

                'city' => $validated['city'],

                'postal_code' => $validated['postal_code'] ?? null,
            ]);

            /*
            |--------------------------------------------------------------------------
            | Order Items
            |--------------------------------------------------------------------------
            */

            foreach ($cart as $item) {
                $product = $products->get($item['id']);

                $quantity = (int) $item['quantity'];

                $unitPrice =
                    $product->sale_price ??
                    $product->price;

                $order->items()->create([
                    'product_id' => $product->id,

                    'quantity' => $quantity,

                    'unit_price' => $unitPrice,
                ]);

                /*
                |--------------------------------------------------------------------------
                | Decrease stock
                |--------------------------------------------------------------------------
                |
                | Stock is intentionally not decreased here.
                | Payment confirmation should handle stock reduction.
                |
                */
            }

            /*
            |--------------------------------------------------------------------------
            | Attribution
            |--------------------------------------------------------------------------
            */

            $order->attribution()->create([
                'utm_source' =>
                    $request->input('utm_source'),

                'utm_medium' =>
                    $request->input('utm_medium'),

                'utm_campaign' =>
                    $request->input('utm_campaign'),

                'utm_content' =>
                    $request->input('utm_content'),

                'fbclid' =>
                    $request->input('fbclid'),

                'gclid' =>
                    $request->input('gclid'),

                'referer_url' =>
                    $request->header('referer'),
            ]);

            return $order;
        });

        /*
        |--------------------------------------------------------------------------
        | 5. Order Created Event
        |--------------------------------------------------------------------------
        |
        | The transaction has already been committed here.
        |
        */

        OrderCreated::dispatch($order);

        /*
        |--------------------------------------------------------------------------
        | 6. CASH
        |--------------------------------------------------------------------------
        */

        if ($validated['payment_method'] === 'cash') {

            session()->forget('cart');

            return redirect()
                ->route('checkout.success', $order);
        }

        /*
        |--------------------------------------------------------------------------
        | 7. STRIPE
        |--------------------------------------------------------------------------
        */

        Stripe::setApiKey(
            config('services.stripe.secret')
        );

        $lineItems = $order->items()
            ->with('product')
            ->get()
            ->map(function ($item) {

                return [
                    'price_data' => [
                        'currency' => 'mad',

                        'product_data' => [
                            'name' =>
                                $item->product->title,
                        ],

                        /*
                        |--------------------------------------------------------------------------
                        | Stripe uses smallest currency unit
                        |--------------------------------------------------------------------------
                        |
                        | 100 MAD => 10000
                        |
                        */

                        'unit_amount' =>
                            (int) round(
                                $item->unit_price * 100
                            ),
                    ],

                    'quantity' =>
                        $item->quantity,
                ];
            })
            ->values()
            ->toArray();

        if ($order->shipping_fee > 0) {
            $lineItems[] = [
                'price_data' => [
                    'currency' => 'mad',
                    'product_data' => [
                        'name' => 'Frais de livraison',
                    ],
                    'unit_amount' => (int) round($order->shipping_fee * 100),
                ],
                'quantity' => 1,
            ];
        }

        /*
        |--------------------------------------------------------------------------
        | Create Stripe Checkout Session
        |--------------------------------------------------------------------------
        */

        $stripeSession = StripeSession::create([
            'mode' => 'payment',

            'line_items' => $lineItems,

            'customer_email' => $customerEmail,

            'success_url' =>
                route(
                    'checkout.success',
                    $order
                ) .
                '?session_id={CHECKOUT_SESSION_ID}',

            'cancel_url' =>
                route(
                    'checkout.cancel',
                    $order
                ),

            'metadata' => [
                'order_id' =>
                    $order->id,

                'order_number' =>
                    $order->order_number,
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Save Stripe Session ID
        |--------------------------------------------------------------------------
        */

        $order->update([
            'transaction_id' =>
                $stripeSession->id,
        ]);

        /*
        |--------------------------------------------------------------------------
        | Redirect user to Stripe
        |--------------------------------------------------------------------------
        */

        return Inertia::location(
            $stripeSession->url
        );
    }

    public function success(Request $request, Order $order)
    {
        /*
        |--------------------------------------------------------------------------
        | Authorization
        |--------------------------------------------------------------------------
        */

        if (
            auth()->check() &&
            $order->user_id !== auth()->id()
        ) {
            abort(403);
        }

        /*
        |--------------------------------------------------------------------------
        | Stripe payment verification
        |--------------------------------------------------------------------------
        */

        if (
            $order->payment_method === 'stripe' &&
            $order->status !== OrderStatus::PAID
        ) {
            return redirect()
                ->route('checkout.index')
                ->with(
                    'error',
                    'Le paiement n\'est pas encore confirmé.'
                );
        }

        /*
        |--------------------------------------------------------------------------
        | Clear cart only after confirmed payment
        |--------------------------------------------------------------------------
        */

        session()->forget('cart');

        return Inertia::render(
            'Store/Checkout/Success',
            [
                'order' => $order->load([
                    'items.product.primaryImage',
                ]),
            ]
        );
    }

    public function clearCartAfterSuccess(Order $order)
    {
        /*
        |--------------------------------------------------------------------------
        | Authorization
        |--------------------------------------------------------------------------
        */

        if (
            auth()->check() &&
            $order->user_id !== auth()->id()
        ) {
            abort(403);
        }

        /*
        |--------------------------------------------------------------------------
        | Verify payment
        |--------------------------------------------------------------------------
        */

        if ($order->status !== OrderStatus::PAID) {
            return response()->json([
                'message' => 'Order is not paid.',
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | Clear cart
        |--------------------------------------------------------------------------
        */

        session()->forget('cart');

        return response()->json([
            'success' => true,
        ]);
    }
}