<?php

use App\Models\HeroSetting;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected away from hero admin editor', function () {
    $this->get(route('admin.hero.edit'))
        ->assertRedirect(route('login'));
});

test('customers cannot access hero admin editor', function () {
    $customer = User::factory()->create(['role' => 'customer']);

    $this->actingAs($customer)
        ->get(route('admin.hero.edit'))
        ->assertForbidden();
});

test('admins can view hero admin editor with inertia props', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get(route('admin.hero.edit'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Hero/Edit')
            ->has('initialDraft')
            ->has('publishedConfig')
            ->has('draftFrontend')
            ->has('publishedFrontend')
        );
});

test('admins can save hero draft without changing the live public page', function () {
    $admin = User::factory()->admin()->create();

    $payload = [
        'badge' => 'TEST DRAFT BADGE',
        'title_line1' => 'TITRE BROUILLON SECRET',
        'title_highlight' => 'SURBRILLANCE',
        'title_line2' => 'LIGNE DEUX',
        'cta_text' => 'ACTION BROUILLON',
        'cta_href' => '#contact',
        'portrait_focal' => 'center',
        'layout_variant' => 'editorial-split',
        'text_alignment' => 'auto',
        'background_style' => 'subtle-glow',
        'show_badge' => true,
        'show_title' => true,
        'show_keywords' => true,
        'show_description' => true,
        'show_cta' => true,
        'show_secondary_cta' => true,
        'show_stat' => true,
        'show_coach_image' => true,
        'show_experience_badge' => true,
        'show_background_image' => true,
        'action' => 'draft',
    ];

    $this->actingAs($admin)
        ->put(route('admin.hero.update'), $payload)
        ->assertRedirect(route('admin.hero.edit'))
        ->assertSessionHas('success');

    // Public homepage must NOT see the draft title
    $response = $this->get(route('home'))->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Welcome')
        ->whereNot('heroConfig.titleLine1', 'TITRE BROUILLON SECRET')
    );

    // Database draft_config should contain the draft value
    $setting = HeroSetting::first();
    expect($setting->draft_config['title_line1'])->toBe('TITRE BROUILLON SECRET');
});

test('publishing promotes the draft to live public homepage', function () {
    $admin = User::factory()->admin()->create();

    $setting = HeroSetting::query()->firstOrCreate(['id' => 1]);
    $setting->draft_config = array_merge($setting->getEffectivePublishedConfig(), [
        'title_line1' => 'TITRE OFFICIELLEMENT PUBLIÉ',
    ]);
    $setting->save();

    // Trigger publish
    $this->actingAs($admin)
        ->post(route('admin.hero.publish'))
        ->assertRedirect(route('admin.hero.edit'))
        ->assertSessionHas('success');

    // Public homepage must now receive the published title
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Welcome')
            ->where('heroConfig.titleLine1', 'TITRE OFFICIELLEMENT PUBLIÉ')
        );
});

test('reverting resets the draft back to published version', function () {
    $admin = User::factory()->admin()->create();

    $setting = HeroSetting::query()->firstOrCreate(['id' => 1]);
    $setting->published_config = array_merge(HeroSetting::defaults(), [
        'title_line1' => 'VERSION PUBLIEE ORIGINALE',
    ]);
    $setting->draft_config = array_merge(HeroSetting::defaults(), [
        'title_line1' => 'BROUILLON A JETER',
    ]);
    $setting->save();

    $this->actingAs($admin)
        ->post(route('admin.hero.revert'))
        ->assertRedirect(route('admin.hero.edit'))
        ->assertSessionHas('success');

    $setting->refresh();
    expect($setting->draft_config['title_line1'])->toBe('VERSION PUBLIEE ORIGINALE');
});

test('validation rejects invalid layout and background styles', function () {
    $admin = User::factory()->admin()->create();

    $payload = [
        'title_line1' => 'Titre',
        'cta_text' => 'Action',
        'cta_href' => '#contact',
        'layout_variant' => 'invalid-variant',
        'background_style' => 'hack-gradient',
        'portrait_focal' => 'invalid-focal',
        'show_badge' => true,
        'show_title' => true,
        'show_keywords' => true,
        'show_description' => true,
        'show_cta' => true,
        'show_secondary_cta' => true,
        'show_stat' => true,
        'show_coach_image' => true,
        'show_experience_badge' => true,
        'show_background_image' => true,
        'text_alignment' => 'auto',
    ];

    $this->actingAs($admin)
        ->put(route('admin.hero.update'), $payload)
        ->assertSessionHasErrors(['layout_variant', 'background_style', 'portrait_focal']);
});

test('admins can upload coach images to the public storage disk', function () {
    Storage::fake('public');
    $admin = User::factory()->admin()->create();

    $fakeImage = UploadedFile::fake()->image('coach-profile.webp', 600, 800);

    $payload = [
        'title_line1' => 'Nouveau Coach',
        'cta_text' => 'Go',
        'cta_href' => '#contact',
        'coach_image' => $fakeImage,
        'portrait_focal' => 'center',
        'layout_variant' => 'editorial-split',
        'text_alignment' => 'auto',
        'background_style' => 'subtle-glow',
        'show_badge' => true,
        'show_title' => true,
        'show_keywords' => true,
        'show_description' => true,
        'show_cta' => true,
        'show_secondary_cta' => true,
        'show_stat' => true,
        'show_coach_image' => true,
        'show_experience_badge' => true,
        'show_background_image' => true,
        'action' => 'draft',
    ];

    $this->actingAs($admin)
        ->put(route('admin.hero.update'), $payload)
        ->assertRedirect(route('admin.hero.edit'));

    $setting = HeroSetting::first();
    $savedPath = $setting->draft_config['coach_image'];

    expect($savedPath)->toStartWith('hero/');
    Storage::disk('public')->assertExists($savedPath);
});

test('admins can configure coach quote and toggle goal selector', function () {
    $admin = User::factory()->admin()->create();

    $payload = [
        'title_line1' => 'CONSTRUIS TON CORPS',
        'cta_text' => 'DÉMARRER',
        'cta_href' => '#contact',
        'coach_quote' => '« Ensemble, on va au bout de tes objectifs. »',
        'portrait_focal' => 'center',
        'layout_variant' => 'editorial-split',
        'text_alignment' => 'auto',
        'background_style' => 'subtle-glow',
        'show_badge' => true,
        'show_title' => true,
        'show_keywords' => true,
        'show_description' => true,
        'show_goal_selector' => true,
        'show_coach_quote' => true,
        'show_trust_strip' => true,
        'show_cta' => true,
        'show_secondary_cta' => true,
        'show_stat' => true,
        'show_coach_image' => true,
        'show_experience_badge' => true,
        'show_background_image' => true,
        'action' => 'publish',
    ];

    $this->actingAs($admin)
        ->put(route('admin.hero.update'), $payload)
        ->assertRedirect(route('admin.hero.edit'));

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Welcome')
            ->where('heroConfig.coachQuote', '« Ensemble, on va au bout de tes objectifs. »')
            ->where('heroConfig.showGoalSelector', true)
            ->where('heroConfig.showCoachQuote', true)
            ->where('heroConfig.showTrustStrip', true)
        );
});
