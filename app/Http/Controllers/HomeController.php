<?php

namespace App\Http\Controllers;

use App\Models\HeroSetting;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $setting = HeroSetting::query()->firstOrCreate(['id' => 1]);
        $publishedConfig = $setting->getEffectivePublishedConfig();
        $heroConfig = HeroSetting::formatForFrontend($publishedConfig);

        return Inertia::render('Welcome', [
            'canLogin' => \Illuminate\Support\Facades\Route::has('login'),
            'canRegister' => \Illuminate\Support\Facades\Route::has('register'),
            'laravelVersion' => app()->version(),
            'phpVersion' => PHP_VERSION,
            'heroConfig' => $heroConfig,
        ]);
    }
}
