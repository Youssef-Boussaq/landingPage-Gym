<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LandingTransformation;
use App\Models\LandingSectionSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class LandingTransformationController extends Controller
{
    private const SECTION = 'transformations';

    // ── Index ──────────────────────────────────────────────────────────
    public function index(): Response
    {
        $setting   = LandingSectionSetting::forSection(self::SECTION);
        $published = $setting->getEffectivePublishedConfig();
        $draft     = $setting->getEffectiveDraftConfig();

        $transformations = LandingTransformation::ordered()
            ->get()
            ->map->toFrontend()
            ->values();

        return Inertia::render('Admin/Transformations/Index', [
            'transformations'       => $transformations,
            'sectionDraft'          => $draft,
            'sectionPublished'      => $published,
            'hasUnpublishedChanges' => $setting->draft_config !== null &&
                                       json_encode($draft) !== json_encode($published),
            'publishedAt'           => $setting->published_at?->diffForHumans()
                                       ?? ($setting->updated_at?->diffForHumans() ?? 'Jamais'),
        ]);
    }

    // ── Store ──────────────────────────────────────────────────────────
    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateTransformation($request);

        // Handle before image
        if ($request->hasFile('before_image')) {
            $validated['before_image'] = Storage::disk('public')
                ->putFile('landing/transformations', $request->file('before_image'));
        }

        // Handle after image
        if ($request->hasFile('after_image')) {
            $validated['after_image'] = Storage::disk('public')
                ->putFile('landing/transformations', $request->file('after_image'));
        }

        $maxOrder = LandingTransformation::max('sort_order') ?? 0;
        $validated['slug']       = Str::slug($validated['title']) . '-' . Str::random(5);
        $validated['sort_order'] = $maxOrder + 1;

        LandingTransformation::create($validated);

        return redirect()->route('admin.transformations.index')
            ->with('success', 'Transformation créée avec succès.');
    }

    // ── Update ─────────────────────────────────────────────────────────
    public function update(Request $request, LandingTransformation $transformation): RedirectResponse
    {
        $validated = $this->validateTransformation($request);

        // Before image
        if ($request->hasFile('before_image')) {
            $this->deleteStorageFile($transformation->before_image);
            $validated['before_image'] = Storage::disk('public')
                ->putFile('landing/transformations', $request->file('before_image'));
        } elseif ($request->boolean('remove_before_image')) {
            $this->deleteStorageFile($transformation->before_image);
            $validated['before_image'] = null;
        } else {
            unset($validated['before_image']);
        }

        // After image
        if ($request->hasFile('after_image')) {
            $this->deleteStorageFile($transformation->after_image);
            $validated['after_image'] = Storage::disk('public')
                ->putFile('landing/transformations', $request->file('after_image'));
        } elseif ($request->boolean('remove_after_image')) {
            $this->deleteStorageFile($transformation->after_image);
            $validated['after_image'] = null;
        } else {
            unset($validated['after_image']);
        }

        $transformation->update($validated);

        return redirect()->route('admin.transformations.index')
            ->with('success', 'Transformation mise à jour.');
    }

    // ── Toggle enabled ─────────────────────────────────────────────────
    public function toggleEnabled(LandingTransformation $transformation): RedirectResponse
    {
        $transformation->update(['is_enabled' => !$transformation->is_enabled]);
        return back()->with('success', 'Statut mis à jour.');
    }

    // ── Reorder [{id, sort_order}] ─────────────────────────────────────
    public function reorder(Request $request): RedirectResponse
    {
        $request->validate([
            'order'              => ['required', 'array'],
            'order.*.id'         => ['required', 'integer', 'exists:landing_transformations,id'],
            'order.*.sort_order' => ['required', 'integer', 'min:0'],
        ]);

        DB::transaction(function () use ($request) {
            foreach ($request->input('order') as $item) {
                LandingTransformation::where('id', $item['id'])
                    ->update(['sort_order' => $item['sort_order']]);
            }
        });

        return back()->with('success', 'Ordre mis à jour.');
    }

    // ── Destroy ────────────────────────────────────────────────────────
    public function destroy(LandingTransformation $transformation): RedirectResponse
    {
        $this->deleteStorageFile($transformation->before_image);
        $this->deleteStorageFile($transformation->after_image);
        $transformation->delete();

        return redirect()->route('admin.transformations.index')
            ->with('success', 'Transformation supprimée.');
    }

    // ── Section settings (eyebrow / heading / visibility) ─────────────
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
            return redirect()->route('admin.transformations.index')
                ->with('success', 'Section Transformations publiée en direct.');
        }

        $setting->draft_config = $updatedDraft;
        $setting->save();

        return redirect()->route('admin.transformations.index')
            ->with('success', 'Paramètres enregistrés (brouillon).');
    }

    // ── Validation ─────────────────────────────────────────────────────
    protected function validateTransformation(Request $request): array
    {
        return $request->validate([
            'title'              => ['required', 'string', 'max:120'],
            'program'            => ['nullable', 'string', 'max:120'],
            'before_image_alt'   => ['nullable', 'string', 'max:255'],
            'after_image_alt'    => ['nullable', 'string', 'max:255'],
            'result_badge'       => ['nullable', 'string', 'max:60'],
            'is_enabled'         => ['nullable', 'boolean'],
            'before_image'       => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,avif', 'max:5120'],
            'after_image'        => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,avif', 'max:5120'],
            'remove_before_image'=> ['nullable', 'boolean'],
            'remove_after_image' => ['nullable', 'boolean'],
        ]);
    }

    // ── Helpers ────────────────────────────────────────────────────────
    private function deleteStorageFile(?string $path): void
    {
        if ($path && !str_starts_with($path, 'images/')) {
            Storage::disk('public')->delete($path);
        }
    }
}

