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

    protected $appends = [
    'url',
];
    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_primary' => 'boolean',
        ];
    }

    /**
     * URL publique de l'image.
     */
    protected function url(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->path
                ? Storage::disk('public')->url($this->path)
                : null
        );
    }

    /**
     * Produit associé.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Supprimer le fichier physique
     * lorsque l'image est supprimée.
     */
    protected static function booted(): void
    {
        static::deleted(function (Product_images $image) {
            if ($image->path) {
                Storage::disk('public')->delete($image->path);
            }
        });
    }
}