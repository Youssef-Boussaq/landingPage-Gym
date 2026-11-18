<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandingTransformation extends Model
{
    protected $fillable = [
        'slug',
        'title',
        'program',
        'before_image',
        'before_image_alt',
        'after_image',
        'after_image_alt',
        'result_badge',
        'sort_order',
        'is_enabled',
    ];

    protected function casts(): array
    {
        return [
            'is_enabled' => 'boolean',
        ];
    }

    public function scopeEnabled($query)
    {
        return $query->where('is_enabled', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }

    /**
     * Format for frontend consumption — mirrors the TRANSFORMATIONS array shape
     * used in Transformations.jsx so the landing page component is a drop-in.
     */
    public function toFrontend(): array
    {
        return [
            'id'             => $this->id,
            'slug'           => $this->slug,
            'title'          => $this->title,
            'program'        => $this->program ?? '',
            'beforeImg'      => LandingSectionSetting::resolveImageUrl($this->before_image),
            'beforeImagePath'=> $this->before_image,
            'beforeImageAlt' => $this->before_image_alt ?? ($this->title . ' — before'),
            'afterImg'       => LandingSectionSetting::resolveImageUrl($this->after_image),
            'afterImagePath' => $this->after_image,
            'afterImageAlt'  => $this->after_image_alt ?? ($this->title . ' — after'),
            'resultBadge'    => $this->result_badge ?? 'Real Result',
            'isEnabled'      => (bool) $this->is_enabled,
            'sortOrder'      => $this->sort_order,
        ];
    }
}

