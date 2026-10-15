<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeroSetting extends Model
{
    protected $fillable = [
        'badge',
        'title_line1',
        'title_line2',
        'title_line3',
        'keywords',
        'cta_text',
        'cta_href',
        'background_image',
        'coach_image',
        'coach_image_alt',
        'show_badge',
        'show_title',
        'show_keywords',
        'show_cta',
        'show_coach_image',
        'show_background_image',
        'show_slashes',
    ];

    protected function casts(): array
    {
        return [
            'show_badge' => 'boolean',
            'show_title' => 'boolean',
            'show_keywords' => 'boolean',
            'show_cta' => 'boolean',
            'show_coach_image' => 'boolean',
            'show_background_image' => 'boolean',
            'show_slashes' => 'boolean',
        ];
    }
}
