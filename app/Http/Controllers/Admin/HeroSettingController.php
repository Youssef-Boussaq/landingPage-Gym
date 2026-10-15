<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HeroSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str; 
class HeroSettingController extends Controller
{
    public function index(): Response
    {
        $setting = HeroSetting::query()->firstOrCreate(['id' => 1]);

        return Inertia::render('Admin/Hero/Edit', [
            'setting' => $setting,
            'backgroundImageUrl' => $setting->background_image
    ? asset($setting->background_image)
    : asset('images/1.jpg'),

'coachImageUrl' => $setting->coach_image
    ? asset($setting->coach_image)
    : asset('images/2.png'),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'badge' => ['required', 'string', 'max:255'],

            'title_line1' => ['required', 'string', 'max:255'],
            'title_line2' => ['required', 'string', 'max:255'],
            'title_line3' => ['required', 'string', 'max:255'],

            'keywords' => ['required', 'string', 'max:255'],
            'cta_text' => ['required', 'string', 'max:100'],
            'cta_href' => ['required', 'string', 'max:255'],
            'coach_image_alt' => ['required', 'string', 'max:255'],

            'show_badge' => ['required', 'boolean'],
            'show_title' => ['required', 'boolean'],
            'show_keywords' => ['required', 'boolean'],
            'show_cta' => ['required', 'boolean'],
            'show_coach_image' => ['required', 'boolean'],
            'show_background_image' => ['required', 'boolean'],
            'show_slashes' => ['required', 'boolean'],

            'background_image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:4096',
            ],

            'coach_image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:4096',
            ],
        ]);


$setting = HeroSetting::query()->firstOrCreate(['id' => 1]);

foreach (['background_image', 'coach_image'] as $field) {
    if ($request->hasFile($field)) {
        $file = $request->file($field);

        $extension = $file->extension();
        $filename = $field . '_' . Str::uuid() . '.' . $extension;

        $file->move(public_path('images'), $filename);

        $oldPath = $setting->{$field};

        $setting->{$field} = 'images/' . $filename;

        if ($oldPath && str_starts_with($oldPath, 'images/')) {
            $oldAbsolutePath = public_path($oldPath);

            if (is_file($oldAbsolutePath)) {
                unlink($oldAbsolutePath);
            }
        }
    }
}

unset($validated['background_image'], $validated['coach_image']);

$setting->fill($validated);
$setting->save();

return redirect()
    ->route('admin.hero.edit')
    ->with('success', 'Les paramètres du Hero ont été enregistrés.');


        
}
}
