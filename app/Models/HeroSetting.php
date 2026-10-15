<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeroSetting extends Model
{
    protected $fillable = [
        'badge',
        'title_line1',
        'title_highlight',
        'title_line2',
        'title_line3',
        'keywords',
        'description',
        'cta_text',
        'cta_href',
        'secondary_cta_text',
        'secondary_cta_href',
        'stat_value',
        'stat_label',
        'experience_badge_text',
        'portrait_focal',
        'background_image',
        'coach_image',
        'coach_image_alt',
        'show_badge',
        'show_title',
        'show_keywords',
        'show_description',
        'show_cta',
        'show_secondary_cta',
        'show_stat',
        'show_coach_image',
        'show_experience_badge',
        'show_background_image',
        'show_slashes',
        'layout_variant',
        'text_alignment',
        'background_style',
        'draft_config',
        'published_config',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'show_badge' => 'boolean',
            'show_title' => 'boolean',
            'show_keywords' => 'boolean',
            'show_description' => 'boolean',
            'show_cta' => 'boolean',
            'show_secondary_cta' => 'boolean',
            'show_stat' => 'boolean',
            'show_coach_image' => 'boolean',
            'show_experience_badge' => 'boolean',
            'show_background_image' => 'boolean',
            'show_slashes' => 'boolean',
            'draft_config' => 'array',
            'published_config' => 'array',
            'published_at' => 'datetime',
        ];
    }

    /**
     * Standard default configuration values.
     */
    public static function defaults(): array
    {
        return [
            'badge' => 'FIT YOUNESS',
            'title_line1' => 'TRANSFORME.',
            'title_highlight' => 'DÉPASSE-TOI.',
            'title_line2' => 'RÉUSSIS.',
            'title_line3' => '',
            'keywords' => 'Coaching Sur-Mesure • Nutrition • Suivi 24/7',
            'description' => 'Programmes d’entraînement personnalisés, nutrition sportive ciblée et accompagnement quotidien pour dépasser vos limites et bâtir un physique athlétique durable.',
            'cta_text' => 'DÉMARRER LE COACHING',
            'cta_href' => '#contact',
            'secondary_cta_text' => 'VOIR LES PROGRAMMES',
            'secondary_cta_href' => '#programs',
            'stat_value' => '500+',
            'stat_label' => 'Transformations Réussies',
            'experience_badge_text' => '10+ ANS D’EXPÉRIENCE',
            'coach_quote' => '« Chaque transformation commence par une première décision. Je suis là pour t’accompagner pas à pas. »',
            'portrait_focal' => 'center',
            'background_image' => null,
            'coach_image' => 'images/2.webp',
            'coach_image_alt' => 'Coach Fit Youness',
            'show_badge' => true,
            'show_title' => true,
            'show_keywords' => true,
            'show_description' => true,
            'show_goal_selector' => true,
            'show_cta' => true,
            'show_secondary_cta' => true,
            'show_stat' => true,
            'show_coach_image' => true,
            'show_coach_quote' => true,
            'show_experience_badge' => true,
            'show_background_image' => true,
            'show_trust_strip' => true,
            'show_slashes' => false,
            'layout_variant' => 'editorial-split',
            'text_alignment' => 'auto',
            'background_style' => 'subtle-glow',
        ];
    }

    /**
     * Build normalized configuration from database column values.
     */
    public function buildConfigFromColumns(): array
    {
        $defaults = self::defaults();

        return [
            'badge' => $this->badge ?? $defaults['badge'],
            'title_line1' => $this->title_line1 ?? $defaults['title_line1'],
            'title_highlight' => $this->title_highlight ?? ($this->title_line2 ?? $defaults['title_highlight']),
            'title_line2' => $this->title_line2 ?? $defaults['title_line2'],
            'title_line3' => $this->title_line3 ?? '',
            'keywords' => $this->keywords ?? $defaults['keywords'],
            'description' => $this->description ?? $defaults['description'],
            'cta_text' => $this->cta_text ?? $defaults['cta_text'],
            'cta_href' => $this->cta_href ?? $defaults['cta_href'],
            'secondary_cta_text' => $this->secondary_cta_text ?? $defaults['secondary_cta_text'],
            'secondary_cta_href' => $this->secondary_cta_href ?? $defaults['secondary_cta_href'],
            'stat_value' => $this->stat_value ?? $defaults['stat_value'],
            'stat_label' => $this->stat_label ?? $defaults['stat_label'],
            'experience_badge_text' => $this->experience_badge_text ?? $defaults['experience_badge_text'],
            'portrait_focal' => $this->portrait_focal ?? $defaults['portrait_focal'],
            'background_image' => $this->background_image,
            'coach_image' => $this->coach_image ?? $defaults['coach_image'],
            'coach_image_alt' => $this->coach_image_alt ?? $defaults['coach_image_alt'],
            'show_badge' => $this->show_badge ?? $defaults['show_badge'],
            'show_title' => $this->show_title ?? $defaults['show_title'],
            'show_keywords' => $this->show_keywords ?? $defaults['show_keywords'],
            'show_description' => $this->show_description ?? $defaults['show_description'],
            'show_cta' => $this->show_cta ?? $defaults['show_cta'],
            'show_secondary_cta' => $this->show_secondary_cta ?? $defaults['show_secondary_cta'],
            'show_stat' => $this->show_stat ?? $defaults['show_stat'],
            'show_coach_image' => $this->show_coach_image ?? $defaults['show_coach_image'],
            'show_experience_badge' => $this->show_experience_badge ?? $defaults['show_experience_badge'],
            'show_background_image' => $this->show_background_image ?? $defaults['show_background_image'],
            'show_slashes' => $this->show_slashes ?? false,
            'layout_variant' => $this->layout_variant ?? $defaults['layout_variant'],
            'text_alignment' => $this->text_alignment ?? $defaults['text_alignment'],
            'background_style' => $this->background_style ?? $defaults['background_style'],
        ];
    }

    /**
     * Get the effective published configuration.
     * Falls back to published_config, then columns, then defaults.
     */
    public function getEffectivePublishedConfig(): array
    {
        $base = self::defaults();
        $fromColumns = $this->buildConfigFromColumns();

        if (is_array($this->published_config) && !empty($this->published_config)) {
            return array_merge($base, $fromColumns, $this->published_config);
        }

        return array_merge($base, $fromColumns);
    }

    /**
     * Get the effective draft configuration.
     * Falls back to draft_config, then published config.
     */
    public function getEffectiveDraftConfig(): array
    {
        $published = $this->getEffectivePublishedConfig();

        if (is_array($this->draft_config) && !empty($this->draft_config)) {
            return array_merge($published, $this->draft_config);
        }

        return $published;
    }

    /**
     * Resolve public image asset URL from string path.
     */
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

        if (str_starts_with($path, 'hero/')) {
            return asset('storage/' . $path);
        }

        if (str_starts_with($path, 'images/')) {
            return asset($path);
        }

        return asset('storage/' . ltrim($path, '/'));
    }

    /**
     * Format a configuration array for frontend consumption (camelCase props with resolved URLs).
     */
    public static function formatForFrontend(array $config): array
    {
        return [
            'badge' => $config['badge'] ?? '',
            'titleLine1' => $config['title_line1'] ?? '',
            'titleHighlight' => $config['title_highlight'] ?? ($config['title_line2'] ?? ''),
            'titleLine2' => $config['title_line2'] ?? '',
            'titleLine3' => $config['title_line3'] ?? '',
            'keywords' => $config['keywords'] ?? '',
            'description' => $config['description'] ?? '',
            'ctaText' => $config['cta_text'] ?? '',
            'ctaHref' => $config['cta_href'] ?? '#contact',
            'secondaryCtaText' => $config['secondary_cta_text'] ?? '',
            'secondaryCtaHref' => $config['secondary_cta_href'] ?? '#programs',
            'statValue' => $config['stat_value'] ?? '',
            'statLabel' => $config['stat_label'] ?? '',
            'experienceBadgeText' => $config['experience_badge_text'] ?? '',
            'coachQuote' => $config['coach_quote'] ?? '« Chaque transformation commence par une première décision. Je suis là pour t’accompagner pas à pas. »',
            'portraitFocal' => $config['portrait_focal'] ?? 'center',

            'backgroundImage' => self::resolveImageUrl($config['background_image'] ?? null, null),
            'backgroundImagePath' => $config['background_image'] ?? null,
            'coachImage' => self::resolveImageUrl($config['coach_image'] ?? null, 'images/2.webp'),
            'coachImageFallback' => asset('images/2.png'),
            'coachImagePath' => $config['coach_image'] ?? null,
            'coachImageAlt' => $config['coach_image_alt'] ?? 'Coach Fit Youness',

            'showBadge' => (bool) ($config['show_badge'] ?? true),
            'showTitle' => (bool) ($config['show_title'] ?? true),
            'showKeywords' => (bool) ($config['show_keywords'] ?? true),
            'showDescription' => (bool) ($config['show_description'] ?? true),
            'showGoalSelector' => (bool) ($config['show_goal_selector'] ?? true),
            'showCta' => (bool) ($config['show_cta'] ?? true),
            'showSecondaryCta' => (bool) ($config['show_secondary_cta'] ?? true),
            'showStat' => (bool) ($config['show_stat'] ?? true),
            'showCoachImage' => (bool) ($config['show_coach_image'] ?? true),
            'showCoachQuote' => (bool) ($config['show_coach_quote'] ?? true),
            'showExperienceBadge' => (bool) ($config['show_experience_badge'] ?? true),
            'showBackgroundImage' => (bool) ($config['show_background_image'] ?? true),
            'showTrustStrip' => (bool) ($config['show_trust_strip'] ?? true),
            'showSlashes' => (bool) ($config['show_slashes'] ?? false),

            'layoutVariant' => $config['layout_variant'] ?? 'editorial-split',
            'textAlignment' => $config['text_alignment'] ?? 'auto',
            'backgroundStyle' => $config['background_style'] ?? 'subtle-glow',
        ];
    }
}
