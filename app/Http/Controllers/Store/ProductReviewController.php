<?php

namespace App\Http\Controllers\Store;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductReviewRequest;
use App\Models\Product;
use App\Services\Store\ProductReviewService;
use Illuminate\Http\RedirectResponse;

class ProductReviewController extends Controller
{
    public function store(
        StoreProductReviewRequest $request,
        Product $product,
        ProductReviewService $reviewService
    ): RedirectResponse {
        $reviewService->createReview(
            $product,
            $request->validated(),
            $request->user()
        );

        return back()->with(
            'success',
            'Merci pour votre retour ! Votre avis a bien été envoyé et sera visible dès validation par notre équipe.'
        );
    }
}

