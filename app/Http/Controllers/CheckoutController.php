<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Inertia\Inertia;

use App\Models\Order;
use App\Models\Product;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;


class CheckoutController extends Controller
{
     public function index(Request $request)
    {
    
        // 1. Get cart from session
        $cart = session('cart', []);

        // 2. Checkout cannot continue with empty cart
        if (empty($cart)) {
            return redirect()
                ->route('cart.index')
                ->with('error', 'Votre panier est vide.');
        }

        // 3. Check authentication
        $isAuthenticated = auth()->check();

        // 4. Get authenticated user
        $user = $isAuthenticated
            ? $request->user()
            : null;

        // 5. Send data to React
        return Inertia::render('Store/Checkout/Index', [
            'cart' => $cart,
            'isAuthenticated' => $isAuthenticated,
            'user' => $user,
        ]);
    }
}
