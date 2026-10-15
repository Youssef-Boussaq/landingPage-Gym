<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HeroSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class HeroSettingController extends Controller
{
    /**
     * Display the Hero administration editor with live preview.
     */
    public function index(): Response
    {
        $setting = HeroSetting::query()->firstOrCreate(['id' => 1]);

        $published = $setting->getEffectivePublishedConfig();
        $draft = $setting->getEffectiveDraftConfig();

        $draftFrontend = HeroSetting::formatForFrontend($draft);
        $publishedFrontend = HeroSetting::formatForFrontend($published);

        // Check whether draft has unsaved differences from published
        $hasUnpublishedChanges = $setting->draft_config !== null &&
            json_encode($draft) !== json_encode($published);

        return Inertia::render('Admin/Hero/Edit', [
            'initialDraft' => $draft,
            'publishedConfig' => $published,
            'draftFrontend' => $draftFrontend,
            'publishedFrontend' => $publishedFrontend,
            'hasUnpublishedChanges' => $hasUnpublishedChanges,
            'publishedAt' => $setting->published_at?->diffForHumans() ?? ($setting->updated_at?->diffForHumans() ?? 'Jamais'),
            'coachImageUrl' => $draftFrontend['coachImage'],
            'backgroundImageUrl' => $draftFrontend['backgroundImage'],
        ]);
    }

    /**
     * Save draft or publish directly.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $this->validateHero($request);

        $action = $request->input('action', 'draft');

        $setting = HeroSetting::query()->firstOrCreate(['id' => 1]);
        $currentDraft = $setting->getEffectiveDraftConfig();

        // Handle coach image
        if ($request->hasFile('coach_image')) {
            $path = Storage::disk('public')->putFile('hero', $request->file('coach_image'));
            $currentDraft['coach_image'] = $path;
        } elseif ($request->boolean('remove_coach_image')) {
            $currentDraft['coach_image'] = null;
        }

        // Handle background image
        if ($request->hasFile('background_image')) {
            $path = Storage::disk('public')->putFile('hero', $request->file('background_image'));
            $currentDraft['background_image'] = $path;
        } elseif ($request->boolean('remove_background_image')) {
            $currentDraft['background_image'] = null;
        }

        unset($validated['coach_image'], $validated['background_image'], $validated['action'], $validated['remove_coach_image'], $validated['remove_background_image']);

        // Merge text and appearance fields into draft
        $updatedDraft = array_merge($currentDraft, $validated);

        if ($action === 'publish') {
            DB::transaction(function () use ($setting, $updatedDraft) {
                $setting->draft_config = $updatedDraft;
                $setting->published_config = $updatedDraft;
                $setting->published_at = now();

                // Synchronize top-level columns for backward compatibility
                $this->syncColumns($setting, $updatedDraft);
                $setting->save();
            });

            return redirect()
                ->route('admin.hero.edit')
                ->with('success', 'Le Hero a été enregistré et publié en direct avec succès.');
        }

        // Save as draft only
        $setting->draft_config = $updatedDraft;
        $setting->save();

        return redirect()
            ->route('admin.hero.edit')
            ->with('success', 'Brouillon du Hero enregistré avec succès. Il ne sera pas visible au public tant qu’il n’est pas publié.');
    }

    /**
     * Publish the current draft configuration.
     */
    public function publish(Request $request): RedirectResponse
    {
        $setting = HeroSetting::query()->firstOrCreate(['id' => 1]);
        $effectiveDraft = $setting->getEffectiveDraftConfig();

        DB::transaction(function () use ($setting, $effectiveDraft) {
            $setting->published_config = $effectiveDraft;
            $setting->draft_config = $effectiveDraft;
            $setting->published_at = now();

            $this->syncColumns($setting, $effectiveDraft);
            $setting->save();
        });

        return redirect()
            ->route('admin.hero.edit')
            ->with('success', 'La configuration a été publiée avec succès ! Le site public est à jour.');
    }

    /**
     * Revert the current draft back to the published configuration.
     */
    public function revert(Request $request): RedirectResponse
    {
        $setting = HeroSetting::query()->firstOrCreate(['id' => 1]);
        $published = $setting->getEffectivePublishedConfig();

        $setting->draft_config = $published;
        $setting->save();

        return redirect()
            ->route('admin.hero.edit')
            ->with('success', 'Le brouillon a été réinitialisé à la dernière version publiée.');
    }

    /**
     * Validate incoming hero configuration payload.
     */
    protected function validateHero(Request $request): array
    {
        return $request->validate([
            'badge' => ['nullable', 'string', 'max:120'],
            'title_line1' => ['required', 'string', 'max:150'],
            'title_highlight' => ['nullable', 'string', 'max:150'],
            'title_line2' => ['nullable', 'string', 'max:150'],
            'title_line3' => ['nullable', 'string', 'max:150'],
            'keywords' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'cta_text' => ['required', 'string', 'max:80'],
            'cta_href' => ['required', 'string', 'max:255'],
            'secondary_cta_text' => ['nullable', 'string', 'max:80'],
            'secondary_cta_href' => ['nullable', 'string', 'max:255'],
            'stat_value' => ['nullable', 'string', 'max:50'],
            'stat_label' => ['nullable', 'string', 'max:100'],
            'experience_badge_text' => ['nullable', 'string', 'max:100'],
            'coach_quote' => ['nullable', 'string', 'max:500'],
            'portrait_focal' => ['required', 'in:top,center,bottom'],
            'coach_image_alt' => ['nullable', 'string', 'max:255'],

            'show_badge' => ['required', 'boolean'],
            'show_title' => ['required', 'boolean'],
            'show_keywords' => ['required', 'boolean'],
            'show_description' => ['required', 'boolean'],
            'show_goal_selector' => ['nullable', 'boolean'],
            'show_cta' => ['required', 'boolean'],
            'show_secondary_cta' => ['required', 'boolean'],
            'show_stat' => ['required', 'boolean'],
            'show_coach_image' => ['required', 'boolean'],
            'show_coach_quote' => ['nullable', 'boolean'],
            'show_experience_badge' => ['required', 'boolean'],
            'show_background_image' => ['required', 'boolean'],
            'show_trust_strip' => ['nullable', 'boolean'],
            'show_slashes' => ['nullable', 'boolean'],

            'layout_variant' => ['required', 'in:editorial-split,studio-compact,centered'],
            'text_alignment' => ['required', 'in:auto,left,center,right'],
            'background_style' => ['required', 'in:subtle-glow,clean-white,soft-neutral'],

            'background_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,avif', 'max:4096'],
            'coach_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,avif', 'max:4096'],
            'action' => ['nullable', 'in:draft,publish'],
            'remove_coach_image' => ['nullable', 'boolean'],
            'remove_background_image' => ['nullable', 'boolean'],
        ]);
    }

    /**
     * Synchronize config array to individual database columns.
     */
    protected function syncColumns(HeroSetting $setting, array $config): void
    {
        $columnFields = [
            'badge', 'title_line1', 'title_highlight', 'title_line2', 'title_line3',
            'keywords', 'description', 'cta_text', 'cta_href', 'secondary_cta_text',
            'secondary_cta_href', 'stat_value', 'stat_label', 'experience_badge_text',
            'portrait_focal', 'coach_image', 'coach_image_alt', 'background_image',
            'show_badge', 'show_title', 'show_keywords', 'show_description',
            'show_cta', 'show_secondary_cta', 'show_stat', 'show_coach_image',
            'show_experience_badge', 'show_background_image', 'show_slashes',
            'layout_variant', 'text_alignment', 'background_style',
        ];

        foreach ($columnFields as $field) {
            if (array_key_exists($field, $config)) {
                $setting->{$field} = $config[$field];
            }
        }
    }
}
