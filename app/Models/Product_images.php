<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Product_images extends Model
{

    use HasFactory;

    protected $fillable = [
        'product_id',
        'path',
        'alt_text',
        'sort_order',
        'is_primary',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_primary' => 'boolean',
        ];
    }

    // URL publique automatique du fichier
    protected function url(): Attribute
    {
        return Attribute::make(
            get: fn () => Storage::disk('public')->url($this->path)
        );
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }



    protected static function booted()
    {
        
        static::deleted(function ($image) {
            Storage::disk('public')->delete($image->path);
        });
    }
}