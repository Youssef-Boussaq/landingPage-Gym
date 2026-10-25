<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandingReview extends Model
{
    protected $fillable = [
        'name',
        'role',
        'text',
        'rating',
        'avatar',
        'is_enabled',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_enabled' => 'boolean',
            'rating'     => 'integer',
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
            'id'        => $this->id,
            'name'      => $this->name,
            'role'      => $this->role ?? '',
            'text'      => $this->text,
            'rating'    => min(5, max(1, (int) $this->rating)),
            'avatar'    => $this->avatar ? LandingSectionSetting::resolveImageUrl($this->avatar) : null,
            'isEnabled' => (bool) $this->is_enabled,
            'sortOrder' => $this->sort_order,
        ];
    }
}
