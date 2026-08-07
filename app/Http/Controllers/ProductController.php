<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $categorySlug = $request->query('category');

        $categories = Category::withCount('products')
            ->orderBy('name')
            ->get();

        $productsQuery = Product::with(['categories', 'images'])
            ->where('is_active', true)
            ->when($categorySlug, function ($query, $slug) {
                $query->whereHas('categories', function ($query) use ($slug) {
                    $query->where('slug', $slug);
                });
            });

        $products = $productsQuery->orderBy('title')->get();
        

        return Inertia::render('Store/Index', [
            'categories' => $categories,
            'selectedCategory' => $categorySlug,
            'products' => $products,
        ]);
    }

    public function show($id): Response
    {
        $product = Product::with(['categories', 'images'])
            ->findOrFail($id);

        return Inertia::render('Store/Products/Show', [
            'product' => $product,
        ]);
    }
}
