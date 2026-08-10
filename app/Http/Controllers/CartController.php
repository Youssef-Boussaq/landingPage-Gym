<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    public function add(Request $request)
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'variant_id' => ['nullable', 'integer'],
        ]);

        $product = Product::findOrFail($validated['product_id']);

        $primaryImage = $product->primaryImage?->path;

        

        if (!$product->is_active) {
            return back()->withErrors([
                'cart' => "Ce produit n'est pas disponible.",
            ]);
        }

        $cart = session()->get('cart', []);

        $productId = $product->id;

        $currentQuantity = $cart[$productId]['quantity'] ?? 0;

        $newQuantity = $currentQuantity + $validated['quantity'];

        if (
            $product->manage_stock &&
            $product->stock_quantity < $newQuantity
        ) {
            return back()->withErrors([
                'quantity' => 'Stock insuffisant.',
            ]);
        }

        if (isset($cart[$productId])) {
            $cart[$productId]['quantity'] += $validated['quantity'];
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
        
        

        return back()->with('success', 'Produit ajouté au panier.');
    }

    public function index()
    {
        return Inertia::render('Store/Cart/Index');
    }
}