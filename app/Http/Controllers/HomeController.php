<?php

namespace App\Http\Controllers;

use App\Models\HeroSetting;
use App\Models\LandingSectionSetting;
use App\Models\LandingService;
use App\Models\LandingProgram;
use App\Models\LandingReview;
use App\Models\LandingTransformation;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        // Hero
        $heroSetting    = HeroSetting::query()->firstOrCreate(['id' => 1]);
        $publishedHero  = $heroSetting->getEffectivePublishedConfig();
        $heroConfig     = HeroSetting::formatForFrontend($publishedHero);

        // About
        $aboutSetting = LandingSectionSetting::forSection('about');
        $aboutConfig  = $aboutSetting->getEffectivePublishedConfig();

        // Resolve image URLs for About
        $aboutConfig['coach_image_url'] = LandingSectionSetting::resolveImageUrl(
            $aboutConfig['coach_image'] ?? null, 'images/3.png'
        );
        $aboutConfig['cert_image_url'] = LandingSectionSetting::resolveImageUrl(
            $aboutConfig['cert_image'] ?? null, 'images/4.png'
        );

        // Services
        $servicesSetting = LandingSectionSetting::forSection('services');
        $servicesConfig  = $servicesSetting->getEffectivePublishedConfig();
        $services        = LandingService::enabled()->ordered()->get()->map->toFrontend()->values();

        // Programs
        $programsSetting = LandingSectionSetting::forSection('programs');
        $programsConfig  = $programsSetting->getEffectivePublishedConfig();
        $programs        = LandingProgram::enabled()->ordered()->get()->map->toFrontend()->values();

        // Reviews
        $reviewsSetting = LandingSectionSetting::forSection('reviews');
        $reviewsConfig  = $reviewsSetting->getEffectivePublishedConfig();
        $reviews        = LandingReview::enabled()->ordered()->get()->map->toFrontend()->values();

        // Transformations
        $transformationsSetting = LandingSectionSetting::forSection('transformations');
        $transformationsConfig  = $transformationsSetting->getEffectivePublishedConfig();
        $transformations        = LandingTransformation::enabled()->ordered()->get()->map->toFrontend()->values();

        return Inertia::render('Welcome', [
            'canLogin'               => \Illuminate\Support\Facades\Route::has('login'),
            'canRegister'            => \Illuminate\Support\Facades\Route::has('register'),
            'laravelVersion'         => app()->version(),
            'phpVersion'             => PHP_VERSION,
            'heroConfig'             => $heroConfig,
            'aboutConfig'            => $aboutConfig,
            'services'               => $services,
            'servicesConfig'         => $servicesConfig,
            'programs'               => $programs,
            'programsConfig'         => $programsConfig,
            'reviews'                => $reviews,
            'reviewsConfig'          => $reviewsConfig,
            'transformations'        => $transformations,
            'transformationsConfig'  => $transformationsConfig,
        ]);
    }
}
