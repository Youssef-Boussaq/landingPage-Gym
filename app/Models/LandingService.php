<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandingService extends Model
{
    protected $fillable = [
        'slug',
        'title',
        'description',
        'image',
        'image_alt',
        'icon',
        'cta_label',
        'sort_order',
        'is_enabled',
        'is_featured',
    ];

    protected function casts(): array
    {
        return [
            'is_enabled'  => 'boolean',
            'is_featured' => 'boolean',
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
     * Format a single service for frontend consumption.
     */
    public function toFrontend(): array
    {
        return [
            'id'          => $this->id,
            'slug'        => $this->slug,
            'title'       => $this->title,
            'description' => $this->description ?? '',
            'image'       => LandingSectionSetting::resolveImageUrl($this->image),
            'imagePath'   => $this->image,
            'imageAlt'    => $this->image_alt ?? $this->title,
            'icon'        => $this->icon ?? 'Dumbbell',
            'ctaLabel'    => $this->cta_label ?? 'Learn More',
            'isEnabled'   => (bool) $this->is_enabled,
            'isFeatured'  => (bool) $this->is_featured,
            'sortOrder'   => $this->sort_order,
        ];
    }
}
