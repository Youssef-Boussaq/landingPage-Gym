<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function index(): Response
    {
        $appearance = [
            'primary' => Setting::where(
                'key',
                'appearance.primary'
            )->value('value'),

            'primary_hover' => Setting::where(
                'key',
                'appearance.primary_hover'
            )->value('value'),

            'primary_dark' => Setting::where(
                'key',
                'appearance.primary_dark'
            )->value('value'),

            'primary_light' => Setting::where(
                'key',
                'appearance.primary_light'
            )->value('value'),
        ];

        return Inertia::render('Admin/Settings/Index', [
            'appearance' => $appearance,
        ]);
    }

    public function updateAppearance(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'primary' => [
                'required',
                'string',
                'regex:/^#[0-9A-Fa-f]{6}$/',
            ],

            'primary_hover' => [
                'required',
                'string',
                'regex:/^#[0-9A-Fa-f]{6}$/',
            ],

            'primary_dark' => [
                'required',
                'string',
                'regex:/^#[0-9A-Fa-f]{6}$/',
            ],

            'primary_light' => [
                'required',
                'string',
                'regex:/^#[0-9A-Fa-f]{6}$/',
            ],
        ]);

        $settings = [
            'appearance.primary' => $validated['primary'],
            'appearance.primary_hover' => $validated['primary_hover'],
            'appearance.primary_dark' => $validated['primary_dark'],
            'appearance.primary_light' => $validated['primary_light'],
        ];

        foreach ($settings as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                [
                    'value' => $value,
                    'type' => 'color',
                ]
            );
        }

        return back()->with(
            'success',
            'Les couleurs ont été mises à jour.'
        );
    }
}