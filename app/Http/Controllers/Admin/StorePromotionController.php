<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePromotionRequest;
use App\Http\Requests\Admin\UpdateStorePromotionRequest;
use App\Models\StorePromotion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class StorePromotionController extends Controller
{
    public function index(): Response
    {
        $promotions = StorePromotion::query()
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->get();

        return Inertia::render('Admin/StorePromotions/Index', [
            'promotions' => $promotions,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/StorePromotions/Create');
    }


    public function store(StorePromotionRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request
                ->file('image')
                ->store('store-promotions', 'public');
        }

        StorePromotion::create($data);

        return redirect()
            ->route('admin.store-promotions.index')
            ->with('success', 'Promotion créée avec succès.');
    }

    public function edit(StorePromotion $storePromotion): Response
    {
        return Inertia::render('Admin/StorePromotions/Edit', [
            'promotion' => $storePromotion,
        ]);
    }

    public function update(
        UpdateStorePromotionRequest $request,
        StorePromotion $storePromotion
    ): RedirectResponse {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($storePromotion->image) {
                Storage::disk('public')->delete($storePromotion->image);
            }

            $data['image'] = $request
                ->file('image')
                ->store('store-promotions', 'public');
        }

        $storePromotion->update($data);

        return redirect()
            ->route('admin.store-promotions.index')
            ->with('success', 'Promotion mise à jour avec succès.');
    }

    public function destroy(StorePromotion $storePromotion): RedirectResponse
    {
        if ($storePromotion->image) {
            Storage::disk('public')->delete($storePromotion->image);
        }

        $storePromotion->delete();

        return redirect()
            ->route('admin.store-promotions.index')
            ->with('success', 'Promotion supprimée avec succès.');
    }
}