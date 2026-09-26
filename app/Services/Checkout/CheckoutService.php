<?php

namespace App\Services\Checkout;

use App\Events\OrderCreated;
use App\Services\Orders\InventoryService;
use App\Services\Stripe\StripeCheckoutService;
use App\Support\CustomerIdentity;
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

        /*
        |--------------------------------------------------------------------------
        | 1. Determine checkout source
        |--------------------------------------------------------------------------
        */

        if ($checkoutMode === 'cart') {
            $cart = session('cart', []);

            if (empty($cart)) {
                throw new \RuntimeException('Votre panier est vide.');
            }
        } elseif ($checkoutMode === 'buy_now') {
            $buyNow = session('buy_now');

            if (!$buyNow) {
                throw new \RuntimeException('Aucun achat direct en cours.');
            }

            $cart = [
                [
                    'id'       => (int) $buyNow['product_id'],
                    'quantity' => (int) $buyNow['quantity'],
                    'variant_id' => $buyNow['variant_id'] ?? null,
                ],
            ];
        } else {
            throw new \RuntimeException('Mode de commande invalide.');
        }

        /*
        |--------------------------------------------------------------------------
        | 2. Customer identity
        |--------------------------------------------------------------------------
        */

        $userId = $identity->userId();
        $guestToken = $identity->guestToken();

        if ($identity->isAuthenticated()) {
            $customerName = $request->user()->name;
            $customerEmail = $request->user()->email;
        } else {
            $customerName = $validated['customer_name'];
            $customerEmail = $validated['customer_email'] ?? null;
        }

        /*
        |--------------------------------------------------------------------------
        | 3. Create order + reserve stock atomically
        |--------------------------------------------------------------------------
        |
        | IMPORTANT:
        |
        | Order creation and stock reservation are in the SAME transaction.
        |
        | If stock is insufficient:
        | - Order is rolled back
        | - OrderItems are rolled back
        | - Attribution is rolled back
        | - InventoryMovement is rolled back
        | - reserved_quantity changes are rolled back
        |
        */

        $order = DB::transaction(function () use (
            $request,
            $validated,
            $cart,
            $userId,
            $guestToken,
            $customerName,
            $customerEmail
        ) {
            /*
            |--------------------------------------------------------------------------
            | Calculate cart using fresh DB prices / stock
            |--------------------------------------------------------------------------
            */

            $calculation = $this->cartCalculator->calculate($cart);

            /*
            |--------------------------------------------------------------------------
            | Create Order + OrderItems
            |--------------------------------------------------------------------------
            */

            $order = $this->orderCreator->create(
                validated: $validated,
                cart: $cart,
                calculation: $calculation,
                userId: $userId,
                guestToken: $guestToken,
                customerName: $customerName,
                customerEmail: $customerEmail,
            );

            /*
            |--------------------------------------------------------------------------
            | Attribution
            |--------------------------------------------------------------------------
            */

            $order->attribution()->create([
                'utm_source'   => $request->input('utm_source'),
                'utm_medium'   => $request->input('utm_medium'),
                'utm_campaign' => $request->input('utm_campaign'),
                'utm_content'  => $request->input('utm_content'),
                'fbclid'       => $request->input('fbclid'),
                'gclid'        => $request->input('gclid'),
                'referer_url'  => $request->header('referer'),
            ]);

            /*
            |--------------------------------------------------------------------------
            | CASH → Reserve stock immediately
            |--------------------------------------------------------------------------
            |
            | This MUST happen before the transaction commits.
            |
            */

            if ($validated['payment_method'] === 'cash') {
                $this->inventoryService->reserveStock($order);
            }

            return $order;
        });

        /*
        |--------------------------------------------------------------------------
        | 4. Event after successful transaction
        |--------------------------------------------------------------------------
        */

        OrderCreated::dispatch($order);

        /*
        |--------------------------------------------------------------------------
        | 5. CASH
        |--------------------------------------------------------------------------
        */

        if ($validated['payment_method'] === 'cash') {
            return [
                'type'  => 'cash',
                'order' => $order,
            ];
        }

        /*
        |--------------------------------------------------------------------------
        | 6. STRIPE
        |--------------------------------------------------------------------------
        */

        $stripeSession = $this->stripeCheckout->createSession(
            $order,
            $customerEmail
        );

        $order->update([
            'transaction_id'          => $stripeSession->id,
            'stripe_session_id'       => $stripeSession->id,
            'stripe_payment_intent_id' => $stripeSession->payment_intent,
        ]);

        return [
            'type'    => 'stripe',
            'order'   => $order,
            'session' => $stripeSession,
        ];
    }
}