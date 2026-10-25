<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LandingProgram;
use App\Models\LandingSectionSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class LandingProgramController extends Controller
{
    private const SECTION = 'programs';

    public function index(): Response
    {
        $setting   = LandingSectionSetting::forSection(self::SECTION);
        $published = $setting->getEffectivePublishedConfig();
        $draft     = $setting->getEffectiveDraftConfig();

        $programs = LandingProgram::ordered()->get()->map->toFrontend()->values();

        return Inertia::render('Admin/Programs/Index', [
            'programs'              => $programs,
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
        $validated = $this->validateProgram($request);

        $maxOrder = LandingProgram::max('sort_order') ?? 0;
        $validated['slug']       = Str::slug($validated['title']) . '-' . Str::random(5);
        $validated['sort_order'] = $maxOrder + 1;

        LandingProgram::create($validated);

        return redirect()->route('admin.programs.index')
            ->with('success', 'Programme créé avec succès.');
    }

    public function update(Request $request, LandingProgram $program): RedirectResponse
    {
        $validated = $this->validateProgram($request);
        $program->update($validated);

        return redirect()->route('admin.programs.index')
            ->with('success', 'Programme mis à jour.');
    }

    public function toggleEnabled(LandingProgram $program): RedirectResponse
    {
        $program->update(['is_enabled' => !$program->is_enabled]);
        return back()->with('success', 'Statut mis à jour.');
    }

    public function reorder(Request $request): RedirectResponse
    {
        $request->validate([
            'order'              => ['required', 'array'],
            'order.*.id'         => ['required', 'integer', 'exists:landing_programs,id'],
            'order.*.sort_order' => ['required', 'integer', 'min:0'],
        ]);

        DB::transaction(function () use ($request) {
            foreach ($request->input('order') as $item) {
                LandingProgram::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
            }
        });

        return back()->with('success', 'Ordre mis à jour.');
    }

    public function destroy(LandingProgram $program): RedirectResponse
    {
        $program->delete();
        return redirect()->route('admin.programs.index')
            ->with('success', 'Programme supprimé.');
    }

    public function updateSection(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'eyebrow'        => ['nullable', 'string', 'max:120'],
            'heading'        => ['nullable', 'string', 'max:120'],
            'whatsapp_phone' => ['nullable', 'string', 'max:30'],
            'popular_label'  => ['nullable', 'string', 'max:60'],
            'is_visible'     => ['nullable', 'boolean'],
            'action'         => ['nullable', 'in:draft,publish'],
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
            return redirect()->route('admin.programs.index')
                ->with('success', 'Section Programmes publiée en direct.');
        }

        $setting->draft_config = $updatedDraft;
        $setting->save();

        return redirect()->route('admin.programs.index')
            ->with('success', 'Paramètres enregistrés (brouillon).');
    }

    protected function validateProgram(Request $request): array
    {
        return $request->validate([
            'title'             => ['required', 'string', 'max:120'],
            'description'       => ['nullable', 'string', 'max:400'],
            'price'             => ['required', 'string', 'max:30'],
            'currency'          => ['nullable', 'string', 'max:10'],
            'period'            => ['nullable', 'string', 'max:40'],
            'benefits'          => ['nullable', 'array'],
            'benefits.*'        => ['string', 'max:200'],
            'is_popular'        => ['nullable', 'boolean'],
            'is_enabled'        => ['nullable', 'boolean'],
            'cta_label'         => ['nullable', 'string', 'max:80'],
            'whatsapp_message'  => ['nullable', 'string', 'max:500'],
        ]);
    }
}
