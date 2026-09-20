<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Calculate the quantity currently available for sale.
     */
    private function getAvailableStock(Product $product): int
    {
        return max(
            0,
            (int) $product->stock_quantity
            - (int) $product->reserved_quantity
        );
    }

    public function add(Request $request)
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'variant_id' => ['nullable', 'integer'],
        ]);

        $product = Product::findOrFail($validated['product_id']);

        if (!$product->is_active) {
            return back()->withErrors([
                'cart' => "Ce produit n'est pas disponible.",
            ]);
        }

        $primaryImage = $product->primaryImage?->path;

        $cart = session()->get('cart', []);

        $productId = $product->id;

        $currentQuantity = $cart[$productId]['quantity'] ?? 0;

        $newQuantity = $currentQuantity + $validated['quantity'];

        /*
        |--------------------------------------------------------------------------
        | STOCK CHECK
        |--------------------------------------------------------------------------
        */

        if ($product->manage_stock) {
            $availableStock = $this->getAvailableStock($product);

            if ($availableStock <= 0) {
                return back()->withErrors([
                    'quantity' => "Ce produit n'est plus disponible.",
                ]);
            }

            if ($newQuantity > $availableStock) {
                return back()->withErrors([
                    'quantity' => "Nous avons seulement {$availableStock} produit(s) disponible(s).",
                ]);
            }
        }

        /*
        |--------------------------------------------------------------------------
        | ADD TO CART
        |--------------------------------------------------------------------------
        */

        if (isset($cart[$productId])) {
            $cart[$productId]['quantity'] = $newQuantity;
        } else {
            $cart[$productId] = [
                'id' => $product->id,
                'title' => $product->title,
                'price' => $product->sale_price ?? $product->price,
                'quantity' => $validated['quantity'],
                'type' => $product->type->value,
                'variant_id' => $validated['variant_id'] ?? null,
                'image' => $primaryImage,
            ];
        }

        session()->put('cart', $cart);

        return back()->with(
            'success',
            'Produit ajouté au panier.'
        );
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'variant_id' => ['nullable', 'integer'],
        ]);

        $cart = session()->get('cart', []);

        $productId = $validated['product_id'];

        if (!isset($cart[$productId])) {
            return back()->withErrors([
                'cart' => 'Produit introuvable dans le panier.',
            ]);
        }

        $product = Product::findOrFail($productId);

        if (!$product->is_active) {
            return back()->withErrors([
                'cart' => "Ce produit n'est plus disponible.",
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | STOCK CHECK
        |--------------------------------------------------------------------------
        */

        if ($product->manage_stock) {
            $availableStock = $this->getAvailableStock($product);

            if ($availableStock <= 0) {
                return back()->withErrors([
                    'quantity' => "Ce produit n'est plus disponible.",
                ]);
            }

            if ($validated['quantity'] > $availableStock) {
                return back()->withErrors([
                    'quantity' => "Nous avons seulement {$availableStock} produit(s) disponible(s).",
                ]);
            }
        }

        $cart[$productId]['quantity'] = $validated['quantity'];

        session()->put('cart', $cart);

        return back()->with(
            'success',
            'Quantité mise à jour.'
        );
    }

   public function index()
{
    $cart = session()->get('cart', []);
    $changed = false;

    foreach ($cart as $productId => &$item) {
        $product = Product::find($productId);

        if (!$product || !$product->is_active) {
            $item['stock_available'] = false;
            $item['available_stock'] = 0;
            continue;
        }

        if (!$product->manage_stock) {
            $item['stock_available'] = true;
            $item['available_stock'] = null;
            continue;
        }

        $availableStock = $this->getAvailableStock($product);

        $item['available_stock'] = $availableStock;

        if ($availableStock <= 0) {
            $item['stock_available'] = false;
            continue;
        }

        $item['stock_available'] = true;

        if ($item['quantity'] > $availableStock) {
            $item['quantity'] = $availableStock;
            $changed = true;
        }
    }

    unset($item);

    if ($changed) {
        session()->put('cart', $cart);
    }

    return Inertia::render('Store/Cart/Index', [
        'cart' => $cart,
    ]);
}

    public function remove(Request $request)
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer'],
            'variant_id' => ['nullable', 'integer'],
        ]);

        $cart = session()->get('cart', []);

        $productId = (int) $validated['product_id'];

        if (!array_key_exists($productId, $cart)) {
            return back()->withErrors([
                'cart' => 'Produit introuvable dans le panier.',
            ]);
        }

        unset($cart[$productId]);

        session()->put('cart', $cart);

        return back()->with(
            'success',
            'Produit supprimé du panier.'
        );
    }
}