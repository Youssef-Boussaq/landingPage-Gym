<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class CategoryMedia extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'type',
        'path',
        'alt_text',
        'sort_order',
        'is_primary',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'is_primary' => 'boolean',
    ];

    protected $appends = [
        'url',
    ];

    /*
    |--------------------------------------------------------------------------
    | Category
    |--------------------------------------------------------------------------
    */

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /*
    |--------------------------------------------------------------------------
    | URL
    |--------------------------------------------------------------------------
    */

    public function getUrlAttribute(): string
    {
        return asset('storage/' . $this->path);
    }

    protected static function booted(): void
    {
        static::deleted(function (CategoryMedia $media) {
            if (!$media->path) {
                return;
            }

            $stillReferenced = static::query()
                ->where('path', $media->path)
                ->where('id', '!=', $media->id)
                ->exists();

            if ($stillReferenced) {
                return;
            }

            if (Storage::disk('public')->exists($media->path)) {
                Storage::disk('public')->delete($media->path);
            }
        });
    }
}