<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandingProgram extends Model
{
    protected $fillable = [
        'slug',
        'title',
        'description',
        'price',
        'currency',
        'period',
        'benefits',
        'is_popular',
        'is_enabled',
        'sort_order',
        'cta_label',
        'whatsapp_message',
    ];

    protected function casts(): array
    {
        return [
            'benefits'   => 'array',
            'is_popular' => 'boolean',
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
     * Format for frontend consumption.
     */
    public function toFrontend(): array
    {
        return [
            'id'               => $this->id,
            'slug'             => $this->slug,
            'title'            => $this->title,
            'description'      => $this->description ?? '',
            'price'            => $this->price,
            'currency'         => $this->currency ?? 'MAD',
            'period'           => $this->period ?? '',
            'benefits'         => is_array($this->benefits) ? $this->benefits : [],
            'isPopular'        => (bool) $this->is_popular,
            'isEnabled'        => (bool) $this->is_enabled,
            'sortOrder'        => $this->sort_order,
            'ctaLabel'         => $this->cta_label ?? 'Choose Plan',
            'whatsappMessage'  => $this->whatsapp_message ?? '',
        ];
    }
}
