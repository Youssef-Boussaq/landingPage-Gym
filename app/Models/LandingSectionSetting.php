<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandingSectionSetting extends Model
{
    protected $fillable = [
        'section',
        'draft_config',
        'published_config',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'draft_config'     => 'array',
            'published_config' => 'array',
            'published_at'     => 'datetime',
        ];
    }

    // ─────────────────────────────────────────────
    // Section-specific defaults
    // ─────────────────────────────────────────────

    public static function defaultsFor(string $section): array
    {
        return match ($section) {
            'about' => [
                'eyebrow'                  => 'About the coach',
                'heading'                  => 'Built through',
                'heading_highlight'        => 'discipline.',
                'description'              => 'A coaching philosophy built around discipline, experience and measurable results.',
                'coach_label'              => 'The Coach',
                'coach_heading'            => "Discipline.\nExperience.\nResults.",
                'coach_description'        => 'A passion for fitness built through discipline, consistency, and the constant pursuit of becoming stronger — both physically and mentally.',
                'coach_statement'          => 'Strength is built daily',
                'coach_image'              => 'images/3.png',
                'coach_image_alt'          => 'Fit Youness coach',
                'coach_number'             => '01',
                'cert_eyebrow'             => 'Professional certification',
                'cert_heading'             => 'IFBB',
                'cert_heading_highlight'   => 'Certified.',
                'cert_description'         => 'Knowledge behind the training. Professional certification in fitness and nutrition, combining proven training principles with a personalized approach to help every client progress with confidence.',
                'cert_statement'           => 'Knowledge • Training • Nutrition',
                'cert_image'               => 'images/4.png',
                'cert_image_alt'           => 'IFBB certified coach',
                'cert_number'              => '02',
                'bottom_statement'         => "Train with purpose.\nProgress with confidence.",
                'bottom_highlight'         => 'Progress with confidence.',
                'cta_label'                => 'Start your journey',
                'cta_href'                 => '#contact',
                'is_visible'               => true,
            ],
            'services' => [
                'eyebrow'      => 'Premium Coaching',
                'heading'      => 'Specialized Services',
                'description'  => 'Tailored fitness programs designed to push your limits, transform your physique, and elevate your performance.',
                'is_visible'   => true,
            ],
            'programs' => [
                'eyebrow'         => 'Start Today',
                'heading'         => 'Coaching Programs',
                'whatsapp_phone'  => '06 17 93 37 97',
                'popular_label'   => 'Best Value',
                'is_visible'      => true,
            ],
            'reviews' => [
                'eyebrow'     => 'Success Stories',
                'heading'     => 'What Clients Say',
                'is_visible'  => true,
            ],
            default => [],
        };
    }

    // ─────────────────────────────────────────────
    // Config resolution (same pattern as HeroSetting)
    // ─────────────────────────────────────────────

    public function getEffectivePublishedConfig(): array
    {
        $base = self::defaultsFor($this->section);

        if (is_array($this->published_config) && !empty($this->published_config)) {
            return array_merge($base, $this->published_config);
        }

        return $base;
    }

    public function getEffectiveDraftConfig(): array
    {
        $published = $this->getEffectivePublishedConfig();

        if (is_array($this->draft_config) && !empty($this->draft_config)) {
            return array_merge($published, $this->draft_config);
        }

        return $published;
    }

    // ─────────────────────────────────────────────
    // Image URL resolution (reuse Hero logic)
    // ─────────────────────────────────────────────

    public static function resolveImageUrl(?string $path, ?string $fallback = null): ?string
    {
        if (empty($path)) {
            return $fallback ? asset($fallback) : null;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        if (str_starts_with($path, 'storage/')) {
            return asset($path);
        }

        if (str_starts_with($path, 'images/')) {
            return asset($path);
        }

        // Uploaded to landing/ disk folder
        return asset('storage/' . ltrim($path, '/'));
    }

    // ─────────────────────────────────────────────
    // Convenience factory — firstOrCreate by section
    // ─────────────────────────────────────────────

    public static function forSection(string $section): self
    {
        return static::firstOrCreate(
            ['section' => $section],
            ['draft_config' => null, 'published_config' => null]
        );
    }
}
