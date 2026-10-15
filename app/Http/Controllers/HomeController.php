<?php

namespace App\Http\Controllers;

use App\Models\HeroSetting;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $setting = HeroSetting::query()->firstOrCreate(['id' => 1]);

        $heroConfig = [
            'badge' => $setting->badge,
            'titleLine1' => $setting->title_line1,
            'titleLine2' => $setting->title_line2,
            'titleLine3' => $setting->title_line3,
            'keywords' => $setting->keywords,
            'ctaText' => $setting->cta_text,
            'ctaHref' => $setting->cta_href,

            'backgroundImage' => $setting->background_image
    ? asset($setting->background_image)
    : asset('images/1.jpg'),

'coachImage' => $setting->coach_image
    ? asset($setting->coach_image)
    : asset('images/2.png'),
            'coachImageAlt' => $setting->coach_image_alt,

            'showBadge' => $setting->show_badge,
            'showTitle' => $setting->show_title,
            'showKeywords' => $setting->show_keywords,
            'showCta' => $setting->show_cta,
            'showCoachImage' => $setting->show_coach_image,
            'showBackgroundImage' => $setting->show_background_image,
            'showSlashes' => $setting->show_slashes,
        ];

        return Inertia::render('Welcome', [
            'canLogin' => \Illuminate\Support\Facades\Route::has('login'),
            'canRegister' => \Illuminate\Support\Facades\Route::has('register'),
            'laravelVersion' => app()->version(),
            'phpVersion' => PHP_VERSION,
            'heroConfig' => $heroConfig,
        ]);
    }
}
