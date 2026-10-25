<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LandingService;
use App\Models\LandingSectionSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class LandingServiceController extends Controller
{
    private const SECTION = 'services';

    public function index(): Response
    {
        $setting   = LandingSectionSetting::forSection(self::SECTION);
        $published = $setting->getEffectivePublishedConfig();
        $draft     = $setting->getEffectiveDraftConfig();

        $services = LandingService::ordered()->get()->map->toFrontend()->values();

        return Inertia::render('Admin/Services/Index', [
            'services'              => $services,
            'sectionDraft'          => $draft,
            'sectionPublished'      => $published,
            'hasUnpublishedChanges' => $setting->draft_config !== null &&
                                       json_encode($draft) !== json_encode($published),
            'publishedAt'           => $setting->published_at?->diffForHumans()
                                       ?? ($setting->updated_at?->diffForHumans() ?? 'Jamais'),
        ]);
    }

    /** Create a new service */
    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateService($request);

        if ($request->hasFile('image')) {
            $validated['image'] = Storage::disk('public')
                ->putFile('landing/services', $request->file('image'));
        }

        $maxOrder = LandingService::max('sort_order') ?? 0;
        $validated['slug']       = Str::slug($validated['title']) . '-' . Str::random(5);
        $validated['sort_order'] = $maxOrder + 1;

        LandingService::create($validated);

        return redirect()->route('admin.services.index')
            ->with('success', 'Service créé avec succès.');
    }

    /** Update a service */
    public function update(Request $request, LandingService $service): RedirectResponse
    {
        $validated = $this->validateService($request);

        if ($request->hasFile('image')) {
            // Remove old uploaded image if stored in storage
            if ($service->image && !str_starts_with($service->image, 'images/')) {
                Storage::disk('public')->delete($service->image);
            }
            $validated['image'] = Storage::disk('public')
                ->putFile('landing/services', $request->file('image'));
        } elseif ($request->boolean('remove_image')) {
            $validated['image'] = null;
        } else {
            unset($validated['image']);
        }

        $service->update($validated);

        return redirect()->route('admin.services.index')
            ->with('success', 'Service mis à jour avec succès.');
    }

    /** Soft-toggle enabled */
    public function toggleEnabled(LandingService $service): RedirectResponse
    {
        $service->update(['is_enabled' => !$service->is_enabled]);
        return back()->with('success', 'Statut mis à jour.');
    }

    /** Reorder — accepts [{id, sort_order}] */
    public function reorder(Request $request): RedirectResponse
    {
        $request->validate([
            'order'             => ['required', 'array'],
            'order.*.id'        => ['required', 'integer', 'exists:landing_services,id'],
            'order.*.sort_order'=> ['required', 'integer', 'min:0'],
        ]);

        DB::transaction(function () use ($request) {
            foreach ($request->input('order') as $item) {
                LandingService::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
            }
        });

        return back()->with('success', 'Ordre mis à jour.');
    }

    /** Delete */
    public function destroy(LandingService $service): RedirectResponse
    {
        if ($service->image && !str_starts_with($service->image, 'images/')) {
            Storage::disk('public')->delete($service->image);
        }
        $service->delete();

        return redirect()->route('admin.services.index')
            ->with('success', 'Service supprimé.');
    }

    /** Save section-level settings as draft */
    public function updateSection(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'eyebrow'     => ['nullable', 'string', 'max:120'],
            'heading'     => ['nullable', 'string', 'max:120'],
            'description' => ['nullable', 'string', 'max:600'],
            'is_visible'  => ['nullable', 'boolean'],
            'action'      => ['nullable', 'in:draft,publish'],
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
            return redirect()->route('admin.services.index')
                ->with('success', 'Section Services publiée en direct.');
        }

        $setting->draft_config = $updatedDraft;
        $setting->save();

        return redirect()->route('admin.services.index')
            ->with('success', 'Paramètres de section enregistrés (brouillon).');
    }

    protected function validateService(Request $request): array
    {
        return $request->validate([
            'title'       => ['required', 'string', 'max:120'],
            'description' => ['nullable', 'string', 'max:400'],
            'image_alt'   => ['nullable', 'string', 'max:255'],
            'icon'        => ['nullable', 'string', 'max:60'],
            'cta_label'   => ['nullable', 'string', 'max:80'],
            'is_enabled'  => ['nullable', 'boolean'],
            'is_featured' => ['nullable', 'boolean'],
            'image'       => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,avif', 'max:4096'],
            'remove_image'=> ['nullable', 'boolean'],
        ]);
    }
}
