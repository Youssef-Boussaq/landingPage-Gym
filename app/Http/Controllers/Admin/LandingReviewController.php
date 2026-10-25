<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LandingReview;
use App\Models\LandingSectionSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class LandingReviewController extends Controller
{
    private const SECTION = 'reviews';

    public function index(): Response
    {
        $setting   = LandingSectionSetting::forSection(self::SECTION);
        $published = $setting->getEffectivePublishedConfig();
        $draft     = $setting->getEffectiveDraftConfig();

        $reviews = LandingReview::ordered()->get()->map->toFrontend()->values();

        return Inertia::render('Admin/Reviews/Index', [
            'reviews'               => $reviews,
            'sectionDraft'          => $draft,
            'sectionPublished'      => $published,
            'hasUnpublishedChanges' => $setting->draft_config !== null &&
                                       json_encode($draft) !== json_encode($published),
            'publishedAt'           => $setting->published_at?->diffForHumans()
                                       ?? ($setting->updated_at?->diffForHumans() ?? 'Jamais'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateReview($request);

        if ($request->hasFile('avatar')) {
            $validated['avatar'] = Storage::disk('public')
                ->putFile('landing/reviews', $request->file('avatar'));
        }

        $maxOrder = LandingReview::max('sort_order') ?? 0;
        $validated['sort_order'] = $maxOrder + 1;

        LandingReview::create($validated);

        return redirect()->route('admin.reviews.index')
            ->with('success', 'Avis ajouté avec succès.');
    }

    public function update(Request $request, LandingReview $review): RedirectResponse
    {
        $validated = $this->validateReview($request);

        if ($request->hasFile('avatar')) {
            if ($review->avatar && !str_starts_with($review->avatar, 'images/')) {
                Storage::disk('public')->delete($review->avatar);
            }
            $validated['avatar'] = Storage::disk('public')
                ->putFile('landing/reviews', $request->file('avatar'));
        } elseif ($request->boolean('remove_avatar')) {
            $validated['avatar'] = null;
        } else {
            unset($validated['avatar']);
        }

        $review->update($validated);

        return redirect()->route('admin.reviews.index')
            ->with('success', 'Avis mis à jour.');
    }

    public function toggleEnabled(LandingReview $review): RedirectResponse
    {
        $review->update(['is_enabled' => !$review->is_enabled]);
        return back()->with('success', 'Statut mis à jour.');
    }

    public function reorder(Request $request): RedirectResponse
    {
        $request->validate([
            'order'              => ['required', 'array'],
            'order.*.id'         => ['required', 'integer', 'exists:landing_reviews,id'],
            'order.*.sort_order' => ['required', 'integer', 'min:0'],
        ]);

        DB::transaction(function () use ($request) {
            foreach ($request->input('order') as $item) {
                LandingReview::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
            }
        });

        return back()->with('success', 'Ordre mis à jour.');
    }

    public function destroy(LandingReview $review): RedirectResponse
    {
        if ($review->avatar && !str_starts_with($review->avatar, 'images/')) {
            Storage::disk('public')->delete($review->avatar);
        }
        $review->delete();

        return redirect()->route('admin.reviews.index')
            ->with('success', 'Avis supprimé.');
    }

    public function updateSection(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'eyebrow'    => ['nullable', 'string', 'max:120'],
            'heading'    => ['nullable', 'string', 'max:120'],
            'is_visible' => ['nullable', 'boolean'],
            'action'     => ['nullable', 'in:draft,publish'],
        ]);

        $action  = $request->input('action', 'draft');
        $setting = LandingSectionSetting::forSection(self::SECTION);
        $current = $setting->getEffectiveDraftConfig();
        unset($validated['action']);

        $updatedDraft = array_merge($current, $validated);

        if ($action === 'publish') {
            DB::transaction(function () use ($setting, $updatedDraft) {
                $setting->draft_config     = $updatedDraft;
                $setting->published_config = $updatedDraft;
                $setting->published_at     = now();
                $setting->save();
            });
            return redirect()->route('admin.reviews.index')
                ->with('success', 'Section Avis publiée en direct.');
        }

        $setting->draft_config = $updatedDraft;
        $setting->save();

        return redirect()->route('admin.reviews.index')
            ->with('success', 'Paramètres enregistrés (brouillon).');
    }

    protected function validateReview(Request $request): array
    {
        return $request->validate([
            'name'          => ['required', 'string', 'max:120'],
            'role'          => ['nullable', 'string', 'max:120'],
            'text'          => ['required', 'string', 'max:2000'],
            'rating'        => ['required', 'integer', 'min:1', 'max:5'],
            'is_enabled'    => ['nullable', 'boolean'],
            'avatar'        => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,avif', 'max:2048'],
            'remove_avatar' => ['nullable', 'boolean'],
        ]);
    }
}
