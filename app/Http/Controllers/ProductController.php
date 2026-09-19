<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\StorePromotion;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $categorySlug = $request->query('category');

        /*
        |--------------------------------------------------------------------------
        | Categories
        |--------------------------------------------------------------------------
        |
        | Parent Category
        |     ├── Media
        |     └── Children
        |             └── Products
        |
        */

        $categories = Category::query()
            ->whereNull('parent_id')
            ->with([
                /*
                |--------------------------------------------------------------------------
                | Category Media
                |--------------------------------------------------------------------------
                |
                | Example:
                |
                | Supplements
                |     └── video.mp4
                |
                | Gym Equipment
                |     └── cover.webp
                |
                | Gym Accessories
                |     ├── cover.webp
                |     └── accessories.webp
                |
                */

                'media',

                /*
                |--------------------------------------------------------------------------
                | Children + Products
                |--------------------------------------------------------------------------
                */

                'children.products' => function ($query) {
                    $query
                        ->where('is_active', true)
                        ->with([
                            'images',
                            'categories',
                        ])
                        ->orderBy('title');
                },
            ])
            ->orderBy('name')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Products
        |--------------------------------------------------------------------------
        |
        | /store
        |     → all active products
        |
        | /store?category=protein
        |     → products of Protein
        |
        | /store?category=supplements
        |     → products of all children of Supplements
        |
        */

        $productsQuery = Product::query()
            ->where('is_active', true)
            ->with([
                'categories',
                'images',
            ]);

        if ($categorySlug) {

            $category = Category::query()
                ->with('children')
                ->where('slug', $categorySlug)
                ->firstOrFail();

            /*
            |--------------------------------------------------------------------------
            | Parent Category
            |--------------------------------------------------------------------------
            */

            if ($category->parent_id === null) {

                // Example:
                // supplements

                $childIds = $category->children->pluck('id');

                $productsQuery->whereHas(
                    'categories',
                    function ($query) use ($childIds) {
                        $query->whereIn(
                            'categories.id',
                            $childIds
                        );
                    }
                );

            } else {

                /*
                |--------------------------------------------------------------------------
                | Child Category
                |--------------------------------------------------------------------------
                */

                // Example:
                // protein

                $productsQuery->whereHas(
                    'categories',
                    function ($query) use ($category) {
                        $query->where(
                            'categories.id',
                            $category->id
                        );
                    }
                );
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Main Products
        |--------------------------------------------------------------------------
        */

        $products = $productsQuery
            ->orderBy('title')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Offers
        |--------------------------------------------------------------------------
        */

        $offers = Product::query()
            ->where('is_active', true)
            ->whereNotNull('sale_price')
            ->whereColumn('sale_price', '<', 'price')
            ->with([
                'categories',
                'images',
            ])
            ->orderBy('sale_price')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Best Sellers
        |--------------------------------------------------------------------------
        */

        $bestSellers = Product::query()
            ->where('is_active', true)
            ->with([
                'categories',
                'images',
            ])
            ->withSum('orderItems', 'quantity')
            ->orderByDesc('order_items_sum_quantity')
            ->take(10)
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Trending Products
        |--------------------------------------------------------------------------
        */

        $trendingProducts = Product::query()
            ->where('is_active', true)
            ->with([
                'categories',
                'images',
            ])
            ->latest()
            ->take(10)
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Store Promotion
        |--------------------------------------------------------------------------
        */

        $storePromotion = StorePromotion::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->first();

        /*
        |--------------------------------------------------------------------------
        | Inertia
        |--------------------------------------------------------------------------
        */

        return Inertia::render('Store/Index', [
            'categories' => $categories,
            'products' => $products,
            'selectedCategory' => $categorySlug,

            'trendingProducts' => $trendingProducts,
            'bestSellers' => $bestSellers,
            'offers' => $offers,
            'storePromotion' => $storePromotion,
        ]);
    }


    public function show($id): Response
    {
        $product = Product::with([
            'categories',
            'images',
        ])->findOrFail($id);

        return Inertia::render('Store/Products/Show', [
            'product' => $product,
        ]);
    }
}