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

        $withReviewStats = function ($query) {
            $query->withCount([
                'approvedReviews as reviews_count',
                'approvedRatings as ratings_count',
            ])->withAvg('approvedRatings as average_rating', 'rating');
        };

        $productsQuery = Product::query()
            ->where('is_active', true)
            ->with([
                'categories',
                'images',
            ]);
        $withReviewStats($productsQuery);

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

        $offersQuery = Product::query()
            ->where('is_active', true)
            ->whereNotNull('sale_price')
            ->whereColumn('sale_price', '<', 'price')
            ->with([
                'categories',
                'images',
            ])
            ->orderBy('sale_price');
        $withReviewStats($offersQuery);
        $offers = $offersQuery->get();

        /*
        |--------------------------------------------------------------------------
        | Best Sellers
        |--------------------------------------------------------------------------
        */

        $bestSellersQuery = Product::query()
            ->where('is_active', true)
            ->with([
                'categories',
                'images',
            ])
            ->withSum('orderItems', 'quantity')
            ->orderByDesc('order_items_sum_quantity')
            ->take(10);
        $withReviewStats($bestSellersQuery);
        $bestSellers = $bestSellersQuery->get();

        /*
        |--------------------------------------------------------------------------
        | Trending Products
        |--------------------------------------------------------------------------
        */

        $trendingProductsQuery = Product::query()
            ->where('is_active', true)
            ->with([
                'categories',
                'images',
            ])
            ->latest()
            ->take(10);
        $withReviewStats($trendingProductsQuery);
        $trendingProducts = $trendingProductsQuery->get();

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
            'approvedReviews' => function ($q) {
                $q->latest('created_at');
            },
        ])->findOrFail($id);

        $reviewStats = $product->review_stats;

        $reviews = $product->approvedReviews->map(function ($review) {
            return [
                'id'                   => $review->id,
                'author'               => $review->reviewer_name,
                'rating'               => $review->rating,
                'title'                => $review->title,
                'content'              => $review->comment,
                'date'                 => $review->created_at?->diffForHumans() ?? '',
                'created_at'           => $review->created_at?->toIso8601String(),
                'is_verified_purchase' => (bool) $review->is_verified_purchase,
                'admin_reply'          => $review->admin_reply,
                'admin_replied_at'     => $review->admin_replied_at?->diffForHumans(),
            ];
        })->values();

        $productData = $product->toArray();
        $productData['reviews'] = $reviews;
        $productData['review_stats'] = $reviewStats;
        $productData['average_rating'] = $reviewStats['average_rating'];
        $productData['reviews_count'] = $reviewStats['total_reviews'];
        $productData['ratings_count'] = $reviewStats['ratings_count'];

        return Inertia::render('Store/Products/Show', [
            'product' => $productData,
        ]);
    }
}