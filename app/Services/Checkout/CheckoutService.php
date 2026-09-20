<?php

namespace App\Services\Checkout;

use App\Events\OrderCreated;
use App\Models\Order;
use App\Support\CustomerIdentity;
use App\Services\Stripe\StripeCheckoutService;
use App\Services\Orders\InventoryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CheckoutService
{
    public function __construct(
        private CartCalculator $cartCalculator,
        private OrderCreator $orderCreator,
        private StripeCheckoutService $stripeCheckout,
        private InventoryService $inventoryService,
    ) {}

    public function process(Request $request, array $validated): array
    {
        $identity = CustomerIdentity::resolve($request);

        $checkoutMode = $validated['checkout_mode'];

        // ── CART ─────────────────────────────────────────────────────────────
        if ($checkoutMode === 'cart') {
            $cart = session('cart', []);

            if (empty($cart)) {
                throw new \RuntimeException('Votre panier est vide.');
            }
        }

        // ── BUY NOW ───────────────────────────────────────────────────────────
        // Lit uniquement session('buy_now'). Ne touche JAMAIS session('cart').
        elseif ($checkoutMode === 'buy_now') {
            $buyNow = session('buy_now');

            if (!$buyNow) {
                throw new \RuntimeException('Aucun achat direct en cours.');
            }

            // Même structure qu'attend CartCalculator : ['id', 'quantity']
            // Le prix et le stock viennent de la DB via CartCalculator.
            $cart = [[
                'id'       => (int) $buyNow['product_id'],
                'quantity' => (int) $buyNow['quantity'],
            ]];
        }

        else {
            throw new \RuntimeException('Mode de commande invalide.');
        }

        $userId = $identity->userId();
        $guestToken = $identity->guestToken();

        if ($identity->isAuthenticated()) {
            $customerName = $request->user()->name;
            $customerEmail = $request->user()->email;
        } else {
            $customerName = $validated['customer_name'];
            $customerEmail = $validated['customer_email'];
        }

        $order = DB::transaction(function () use (
            $request,
            $validated,
            $cart,
            $userId,
            $guestToken,
            $customerName,
            $customerEmail
        ) {
            $calculation = $this->cartCalculator->calculate($cart);

            $order = $this->orderCreator->create(
                validated: $validated,
                cart: $cart,
                calculation: $calculation,
                userId: $userId,
                guestToken: $guestToken,
                customerName: $customerName,
                customerEmail: $customerEmail,
            );

            $order->attribution()->create([
                'utm_source' => $request->input('utm_source'),
                'utm_medium' => $request->input('utm_medium'),
                'utm_campaign' => $request->input('utm_campaign'),
                'utm_content' => $request->input('utm_content'),
                'fbclid' => $request->input('fbclid'),
                'gclid' => $request->input('gclid'),
                'referer_url' => $request->header('referer'),
            ]);

            return $order;
        });

        OrderCreated::dispatch($order);

        if ($validated['payment_method'] === 'cash') {
            $this->inventoryService->reserveStock($order);

            return [
                'type' => 'cash',
                'order' => $order,
            ];
        }

        $stripeSession = $this->stripeCheckout->createSession(
            $order,
            $customerEmail
        );

        $order->update([
            'transaction_id' => $stripeSession->id,
            'stripe_session_id' => $stripeSession->id,
            'stripe_payment_intent_id' => $stripeSession->payment_intent,
        ]);

        return [
            'type' => 'stripe',
            'order' => $order,
            'session' => $stripeSession,
        ];
    }
}
