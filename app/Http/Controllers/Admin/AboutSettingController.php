<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LandingSectionSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AboutSettingController extends Controller
{
    private const SECTION = 'about';

    public function index(): Response
    {
        $setting = LandingSectionSetting::forSection(self::SECTION);

        $published = $setting->getEffectivePublishedConfig();
        $draft     = $setting->getEffectiveDraftConfig();

        $hasUnpublishedChanges = $setting->draft_config !== null &&
            json_encode($draft) !== json_encode($published);

        return Inertia::render('Admin/About/Edit', [
            'initialDraft'          => $draft,
            'publishedConfig'       => $published,
            'hasUnpublishedChanges' => $hasUnpublishedChanges,
            'publishedAt'           => $setting->published_at?->diffForHumans()
                                       ?? ($setting->updated_at?->diffForHumans() ?? 'Jamais'),
            'coachImageUrl'         => LandingSectionSetting::resolveImageUrl($draft['coach_image'] ?? null, 'images/3.png'),
            'certImageUrl'          => LandingSectionSetting::resolveImageUrl($draft['cert_image'] ?? null, 'images/4.png'),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $this->validateAbout($request);
        $action    = $request->input('action', 'draft');

        $setting     = LandingSectionSetting::forSection(self::SECTION);
        $currentDraft = $setting->getEffectiveDraftConfig();

        // Coach image upload
        if ($request->hasFile('coach_image')) {
            $path = Storage::disk('public')->putFile('landing/about', $request->file('coach_image'));
            $currentDraft['coach_image'] = $path;
        } elseif ($request->boolean('remove_coach_image')) {
            $currentDraft['coach_image'] = null;
        }

        // Certificate image upload
        if ($request->hasFile('cert_image')) {
            $path = Storage::disk('public')->putFile('landing/about', $request->file('cert_image'));
            $currentDraft['cert_image'] = $path;
        } elseif ($request->boolean('remove_cert_image')) {
            $currentDraft['cert_image'] = null;
        }

        // Strip file/action fields from text payload
        unset(
            $validated['coach_image'],
            $validated['cert_image'],
            $validated['action'],
            $validated['remove_coach_image'],
            $validated['remove_cert_image']
        );

        $updatedDraft = array_merge($currentDraft, $validated);

        if ($action === 'publish') {
            DB::transaction(function () use ($setting, $updatedDraft) {
                $setting->draft_config     = $updatedDraft;
                $setting->published_config = $updatedDraft;
                $setting->published_at     = now();
                $setting->save();
            });

            return redirect()
                ->route('admin.about.edit')
                ->with('success', 'La section About a été publiée avec succès.');
        }

        $setting->draft_config = $updatedDraft;
        $setting->save();

        return redirect()
            ->route('admin.about.edit')
            ->with('success', 'Brouillon enregistré. Il ne sera pas visible tant qu\'il n\'est pas publié.');
    }

    public function publish(): RedirectResponse
    {
        $setting      = LandingSectionSetting::forSection(self::SECTION);
        $effectiveDraft = $setting->getEffectiveDraftConfig();

        DB::transaction(function () use ($setting, $effectiveDraft) {
            $setting->published_config = $effectiveDraft;
            $setting->draft_config     = $effectiveDraft;
            $setting->published_at     = now();
            $setting->save();
        });

        return redirect()
            ->route('admin.about.edit')
            ->with('success', 'La section About est maintenant publiée en direct.');
    }

    public function revert(): RedirectResponse
    {
        $setting   = LandingSectionSetting::forSection(self::SECTION);
        $published = $setting->getEffectivePublishedConfig();

        $setting->draft_config = $published;
        $setting->save();

        return redirect()
            ->route('admin.about.edit')
            ->with('success', 'Le brouillon a été réinitialisé à la dernière version publiée.');
    }

    protected function validateAbout(Request $request): array
    {
        return $request->validate([
            // Texts
            'eyebrow'                => ['nullable', 'string', 'max:120'],
            'heading'                => ['nullable', 'string', 'max:120'],
            'heading_highlight'      => ['nullable', 'string', 'max:120'],
            'description'            => ['nullable', 'string', 'max:600'],
            'coach_label'            => ['nullable', 'string', 'max:80'],
            'coach_heading'          => ['nullable', 'string', 'max:300'],
            'coach_description'      => ['nullable', 'string', 'max:600'],
            'coach_statement'        => ['nullable', 'string', 'max:120'],
            'coach_number'           => ['nullable', 'string', 'max:10'],
            'coach_image_alt'        => ['nullable', 'string', 'max:255'],
            // Cert
            'cert_eyebrow'           => ['nullable', 'string', 'max:120'],
            'cert_heading'           => ['nullable', 'string', 'max:120'],
            'cert_heading_highlight' => ['nullable', 'string', 'max:120'],
            'cert_description'       => ['nullable', 'string', 'max:600'],
            'cert_statement'         => ['nullable', 'string', 'max:120'],
            'cert_image_alt'         => ['nullable', 'string', 'max:255'],
            'cert_number'            => ['nullable', 'string', 'max:10'],
            // Bottom
            'bottom_statement'       => ['nullable', 'string', 'max:200'],
            'bottom_highlight'       => ['nullable', 'string', 'max:120'],
            'cta_label'              => ['nullable', 'string', 'max:80'],
            'cta_href'               => ['nullable', 'string', 'max:255'],
            // Visibility
            'is_visible'             => ['nullable', 'boolean'],
            // Images
            'coach_image'            => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,avif', 'max:4096'],
            'cert_image'             => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,avif', 'max:4096'],
            'remove_coach_image'     => ['nullable', 'boolean'],
            'remove_cert_image'      => ['nullable', 'boolean'],
            'action'                 => ['nullable', 'in:draft,publish'],
        ]);
    }
}
