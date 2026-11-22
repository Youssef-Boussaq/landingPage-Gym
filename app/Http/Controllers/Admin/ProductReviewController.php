<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductReview;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductReviewController extends Controller
{
    public function index(Request $request): Response
    {
        $search    = $request->query('search');
        $status    = $request->query('status', 'all');
        $rating    = $request->query('rating', 'all');
        $verified  = $request->query('verified', 'all');
        $productId = $request->query('product_id');

        $query = ProductReview::query()
            ->with([
                'product' => function ($q) {
                    $q->select('id', 'title', 'slug', 'price', 'sale_price')
                        ->with('primaryImage');
                },
                'user:id,name,email',
            ])
            ->latest('id');

        // Search filter
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('reviewer_name', 'like', "%{$search}%")
                    ->orWhere('reviewer_email', 'like', "%{$search}%")
                    ->orWhere('title', 'like', "%{$search}%")
                    ->orWhere('comment', 'like', "%{$search}%")
                    ->orWhereHas('product', function ($pq) use ($search) {
                        $pq->where('title', 'like', "%{$search}%");
                    });
            });
        }

        // Status filter
        if ($status !== 'all' && in_array($status, ['pending', 'approved', 'rejected'], true)) {
            $query->where('status', $status);
        }

        // Rating filter
        if ($rating === 'unrated') {
            $query->whereNull('rating');
        } elseif ($rating === 'rated') {
            $query->whereNotNull('rating');
        } elseif (is_numeric($rating) && (int) $rating >= 1 && (int) $rating <= 5) {
            $query->where('rating', (int) $rating);
        }

        // Verified purchase filter
        if ($verified === 'verified') {
            $query->where('is_verified_purchase', true);
        } elseif ($verified === 'unverified') {
            $query->where('is_verified_purchase', false);
        }

        // Product filter
        if ($productId) {
            $query->where('product_id', $productId);
        }

        $reviews = $query->paginate(15)->withQueryString();

        // Calculate summary metrics for the header
        $stats = [
            'total'          => ProductReview::count(),
            'pending'        => ProductReview::where('status', 'pending')->count(),
            'approved'       => ProductReview::where('status', 'approved')->count(),
            'rejected'       => ProductReview::where('status', 'rejected')->count(),
            'with_rating'    => ProductReview::whereNotNull('rating')->count(),
            'unrated'        => ProductReview::whereNull('rating')->count(),
            'average_rating' => ProductReview::where('status', 'approved')
                ->whereNotNull('rating')
                ->avg('rating'),
        ];

        if ($stats['average_rating'] !== null) {
            $stats['average_rating'] = round((float) $stats['average_rating'], 1);
        }

        $products = Product::query()
            ->select('id', 'title')
            ->orderBy('title')
            ->get();

        return Inertia::render('Admin/ProductReviews/Index', [
            'reviews'  => $reviews,
            'stats'    => $stats,
            'products' => $products,
            'filters'  => [
                'search'     => $search ?? '',
                'status'     => $status,
                'rating'     => $rating,
                'verified'   => $verified,
                'product_id' => $productId ?? '',
            ],
        ]);
    }

    public function updateStatus(Request $request, ProductReview $review): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:pending,approved,rejected'],
        ]);

        $review->update([
            'status' => $validated['status'],
        ]);

        return back()->with('success', "Le statut de l'avis a été mis à jour avec succès.");
    }

    public function reply(Request $request, ProductReview $review): RedirectResponse
    {
        $validated = $request->validate([
            'admin_reply' => ['nullable', 'string', 'max:2000'],
        ]);

        $replyContent = trim($validated['admin_reply'] ?? '');

        $review->update([
            'admin_reply'      => !empty($replyContent) ? $replyContent : null,
            'admin_replied_at' => !empty($replyContent) ? now() : null,
        ]);

        return back()->with('success', 'La réponse officielle a été enregistrée.');
    }

    public function destroy(ProductReview $review): RedirectResponse
    {
        $review->delete();

        return back()->with('success', 'L\'avis a été supprimé.');
    }
}

