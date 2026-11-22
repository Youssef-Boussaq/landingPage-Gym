<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Http\Requests\CheckoutRequest;
use App\Models\Order;
use App\Services\Checkout\CheckoutService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\Product;


class CheckoutController extends Controller
{
    public function __construct(
        private CheckoutService $checkoutService
    ) {}


public function index(Request $request)
{
    $mode = $request->input('mode', 'cart');

    /*
    |--------------------------------------------------------------------------
    | BUY NOW — lit depuis session('buy_now') uniquement
    |--------------------------------------------------------------------------
    */

    if ($mode === 'buy_now') {

        $buyNow = session('buy_now');

        if (!$buyNow) {
            return redirect()
                ->route('store.index')
                ->with('error', 'Aucun achat direct en cours.');
        }

        $product = Product::with('primaryImage')
            ->findOrFail($buyNow['product_id']);

        if (!$product->is_active) {
            session()->forget('buy_now');
            return redirect()
                ->route('store.index')
                ->with('error', "Ce produit n'est plus disponible.");
        }

        $quantity = (int) $buyNow['quantity'];

        if ($product->manage_stock) {

            $availableStock = max(
                0,
                (int) $product->stock_quantity -
                (int) $product->reserved_quantity
            );

            if ($availableStock <= 0) {
                session()->forget('buy_now');
                return redirect()
                    ->route('store.products.show', $product->id)
                    ->with('error', "Ce produit n'est plus disponible.");
            }

            if ($quantity > $availableStock) {
                session()->forget('buy_now');
                return redirect()
                    ->route('store.products.show', $product->id)
                    ->with(
                        'error',
                        "Nous avons seulement {$availableStock} produit(s) disponible(s)."
                    );
            }
        }

        // Données UI uniquement — ne modifie PAS session('cart')
        return Inertia::render('Store/Checkout/Index', [
            'cart' => [[
                'key'        => $product->id,
                'product_id' => $product->id,
                'name'       => $product->title,
                'price'      => $product->sale_price ?? $product->price,
                'quantity'   => $quantity,
                'type'       => $product->type->value,
                'variant_id' => $buyNow['variant_id'] ?? null,
                'image'      => $product->primaryImage?->path,
            ]],

            'isAuthenticated' => auth()->check(),
            'user'            => auth()->user(),
            'checkoutMode'    => 'buy_now',
            'isDigital'       => $product->type === \App\Enums\ProductType::DIGITAL,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | NORMAL CART
    |--------------------------------------------------------------------------
    */

    $cart = session('cart', []);

    if (empty($cart)) {
        return redirect()
            ->route('store.cart.index')
            ->with('error', 'Votre panier est vide.');
    }

    $cartItems = collect($cart)
        ->map(fn ($item) => [
            'key'        => $item['id'],
            'product_id' => $item['id'],
            'name'       => $item['title'],
            'price'      => $item['price'],
            'quantity'   => (int) $item['quantity'],
            'type'       => $item['type'],
            'variant_id' => $item['variant_id'] ?? null,
            'image'      => $item['image'] ?? null,
        ])
        ->values();

    $isDigital = $cartItems->isNotEmpty() && $cartItems->every(fn ($item) => ($item['type'] ?? '') === 'digital');

    return Inertia::render('Store/Checkout/Index', [
        'cart'            => $cartItems,
        'isAuthenticated' => auth()->check(),
        'user'            => auth()->user(),
        'checkoutMode'    => 'cart',
        'isDigital'       => $isDigital,
    ]);
}





    public function store(CheckoutRequest $request)
    {
        $validated = $request->validated();
        $checkoutMode = $validated['checkout_mode'];

        Log::info('[CHECKOUT] store() called', [
            'checkout_mode' => $checkoutMode,
            'cart_before'   => session('cart'),
            'buy_now_before'=> session('buy_now'),
        ]);

        try {
            $result = $this->checkoutService->process(
                $request,
                $validated
            );
        } catch (\Throwable $e) {
            Log::error('[CHECKOUT] Error processing order: ' . $e->getMessage(), [
                'exception' => $e,
                'checkout_mode' => $checkoutMode,
            ]);

            return back()->withErrors([
                'error' => $e->getMessage() ?: 'Une erreur est survenue lors de la validation de votre commande. Veuillez réessayer.',
            ])->withInput();
        }

        // ── Nettoyage de la bonne session selon le mode ──────────────────────
        // On mémorise le mode dans la session pour que success() puisse
        // savoir quelle session nettoyer (utile pour Stripe où success()
        // est appelé après redirect externe).
        session()->put('last_checkout_mode', $checkoutMode);

        if ($checkoutMode === 'buy_now') {
            Log::info('[CHECKOUT] buy_now: forgetting buy_now session, cart untouched', [
                'cart' => session('cart'),
            ]);
            session()->forget('buy_now');
            // session('cart') N'EST PAS SUPPRIMÉ
        } else {
            Log::info('[CHECKOUT] cart: forgetting cart session', [
                'cart' => session('cart'),
            ]);
            session()->forget('cart');
        }

        if ($result['type'] === 'cash') {
            return redirect()
                ->route('checkout.success', $result['order']);
        }

        return Inertia::location($result['session']->url);
    }

   public function success(Request $request, Order $order)
{
    /*
    |--------------------------------------------------------------------------
    | Authorization
    |--------------------------------------------------------------------------
    */

    if (auth()->check()) {
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }
    } else {
        $sessionId = $request->query('session_id');
        $hasValidStripeSession = $sessionId && (
            $order->stripe_session_id === $sessionId ||
            $order->transaction_id === $sessionId
        );

        if (
            !$hasValidStripeSession &&
            (!$order->guest_token || $request->cookie('guest_token') !== $order->guest_token)
        ) {
            abort(403);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Stripe payment
    |--------------------------------------------------------------------------
    */

    $isStripe = $order->payment_method === 'stripe';

    /*
    |--------------------------------------------------------------------------
    | Verify Stripe session directly if payment webhook hasn't arrived yet
    |--------------------------------------------------------------------------
    */

    if ($isStripe && $order->status !== OrderStatus::PAID) {
        $sessionId = $request->query('session_id') ?? $order->stripe_session_id ?? $order->transaction_id;

        if ($sessionId) {
            try {
                \Stripe\Stripe::setApiKey(config('services.stripe.secret'));
                $stripeSession = \Stripe\Checkout\Session::retrieve($sessionId);

                if ($stripeSession && $stripeSession->payment_status === 'paid') {
                    app(\App\Services\Orders\OrderPaymentService::class)->markPaid(
                        $order->id,
                        $stripeSession->id,
                        $stripeSession->payment_intent
                    );
                    $order->refresh();
                }
            } catch (\Throwable $e) {
                Log::warning('[CHECKOUT] Could not synchronously verify Stripe session', [
                    'order_id' => $order->id,
                    'session_id' => $sessionId,
                    'error' => $e->getMessage(),
                ]);
            }
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Stripe still waiting for payment confirmation
    |--------------------------------------------------------------------------
    */

    if ($isStripe && $order->status !== OrderStatus::PAID) {
        return Inertia::render('Store/Checkout/Success', [
            'order'          => $order->load(['items.product.primaryImage']),
            'paymentPending' => true,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Payment confirmed — nettoyage de la bonne session
    |--------------------------------------------------------------------------
    | last_checkout_mode est mis en session dans store() juste après
    | la création de l'Order. Pour Cash il arrive immédiatement.
    | Pour Stripe il persiste jusqu'au retour depuis la page Stripe.
    */

    $lastCheckoutMode = session()->pull('last_checkout_mode', 'cart');

    Log::info('[CHECKOUT] success() session cleanup', [
        'order_id'          => $order->id,
        'last_checkout_mode'=> $lastCheckoutMode,
        'cart_before'       => session('cart'),
    ]);

    if ($lastCheckoutMode === 'buy_now') {
        // Buy Now : le Cart de l'utilisateur reste intact
        Log::info('[CHECKOUT] buy_now success: cart preserved', [
            'cart' => session('cart'),
        ]);
    } else {
        // Cart checkout : on vide le panier normalement
        session()->forget('cart');
    }

    return Inertia::render('Store/Checkout/Success', [
        'order'          => $order->load(['items.product.primaryImage']),
        'paymentPending' => false,
    ]);
}

    public function clearCartAfterSuccess(Order $order)
    {
        /*
        |--------------------------------------------------------------------------
        | Authorization
        |--------------------------------------------------------------------------
        */

        if (auth()->check()) {
            if ($order->user_id !== auth()->id()) {
                abort(403);
            }
        } else {
            if (
                !$order->guest_token ||
                request()->cookie('guest_token') !== $order->guest_token
            ) {
                abort(403);
            }
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


    public function status(Request $request, Order $order)
{
    /*
    |--------------------------------------------------------------------------
    | Authorization
    |--------------------------------------------------------------------------
    */

    if (auth()->check()) {
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }
    } else {
        $sessionId = $request->query('session_id');
        $hasValidStripeSession = $sessionId && (
            $order->stripe_session_id === $sessionId ||
            $order->transaction_id === $sessionId
        );

        if (
            !$hasValidStripeSession &&
            (!$order->guest_token || $request->cookie('guest_token') !== $order->guest_token)
        ) {
            abort(403);
        }
    }

    if ($order->payment_method === 'stripe' && $order->status !== OrderStatus::PAID) {
        $sessionId = $request->query('session_id') ?? $order->stripe_session_id ?? $order->transaction_id;
        if ($sessionId) {
            try {
                \Stripe\Stripe::setApiKey(config('services.stripe.secret'));
                $stripeSession = \Stripe\Checkout\Session::retrieve($sessionId);
                if ($stripeSession && $stripeSession->payment_status === 'paid') {
                    app(\App\Services\Orders\OrderPaymentService::class)->markPaid(
                        $order->id,
                        $stripeSession->id,
                        $stripeSession->payment_intent
                    );
                    $order->refresh();
                }
            } catch (\Throwable $e) {
                // Ignore polling errors
            }
        }
    }

    return response()->json([
        'paid' => $order->status === OrderStatus::PAID,
        'status' => $order->status->value,
        'payment_status' => $order->payment_status->value,
    ]);
}


public function buyNow(Request $request)
{
    $validated = $request->validate([
        'product_id' => ['required', 'integer', 'exists:products,id'],
        'quantity'   => ['required', 'integer', 'min:1'],
        'variant_id' => ['nullable', 'integer'],
    ]);

    try {
        $product = Product::findOrFail($validated['product_id']);

        if (!$product->is_active) {
            return back()->withErrors([
                'product' => "Ce produit n'est plus disponible.",
            ]);
        }

        $quantity = (int) $validated['quantity'];

        if ($product->manage_stock) {
            $availableStock = max(
                0,
                (int) $product->stock_quantity -
                (int) $product->reserved_quantity
            );

            if ($availableStock <= 0) {
                return back()->withErrors([
                    'quantity' => "Ce produit n'est plus disponible.",
                ]);
            }

            if ($quantity > $availableStock) {
                return back()->withErrors([
                    'quantity' => "Nous avons seulement {$availableStock} produit(s) disponible(s).",
                ]);
            }
        }

        // Stockage dans session dédiée — ne touche PAS session('cart')
        session()->put('buy_now', [
            'product_id' => $product->id,
            'quantity'   => $quantity,
            'variant_id' => $validated['variant_id'] ?? null,
        ]);

        // Redirect sans query params (product_id/quantity ne passent pas dans l'URL)
        return redirect()->route('checkout.index', [
            'mode' => 'buy_now',
        ]);
    } catch (\Throwable $e) {
        Log::error('[BUY NOW] Error in buyNow: ' . $e->getMessage(), [
            'exception' => $e,
            'payload' => $validated,
        ]);

        return back()->withErrors([
            'error' => "Impossible d'initier la commande immédiate. Veuillez réessayer.",
        ]);
    }
}

    public function downloadDigitalProduct(Request $request, Order $order, Product $product)
    {
        if (auth()->check()) {
            if ($order->user_id !== auth()->id() && auth()->user()->role !== 'admin') {
                abort(403, 'Accès non autorisé.');
            }
        } else {
            $guestToken = $order->guest_token;
            if (!$guestToken || $request->cookie('guest_token') !== $guestToken) {
                $sessionId = $request->query('session_id');
                if (!$sessionId || ($order->stripe_session_id !== $sessionId && $order->transaction_id !== $sessionId)) {
                    abort(403, 'Accès non autorisé.');
                }
            }
        }

        if ($order->status !== OrderStatus::PAID && $order->payment_status !== \App\Enums\PaymentStatus::PAID) {
            abort(403, 'Cette commande n\'est pas encore confirmée ou payée.');
        }

        $orderItem = $order->items()->where('product_id', $product->id)->first();
        if (!$orderItem) {
            abort(404, 'Produit introuvable dans cette commande.');
        }

        if (!empty($product->digital_download_link)) {
            return redirect()->away($product->digital_download_link);
        }

        if (!empty($product->digital_file_path) && Storage::disk('public')->exists($product->digital_file_path)) {
            $fullPath = Storage::disk('public')->path($product->digital_file_path);
            $fileName = $product->digital_file_name ?: basename($product->digital_file_path);
            return response()->download($fullPath, $fileName);
        }

        return back()->withErrors(['error' => 'Le fichier de ce produit numérique n\'est pas disponible pour le moment.']);
    }

}