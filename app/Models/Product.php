<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Enums\ProductType;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\ProductImage;


class Product extends Model
{
    


use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'type',
        'price',
        'sale_price',
        'stock_quantity',
        'manage_stock',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'type' => ProductType::class,
            'price' => 'decimal:2',
            'sale_price' => 'decimal:2',
            'stock_quantity' => 'integer',
            'manage_stock' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    // Catégories du produit
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class);
    }


public function images(): HasMany
{
    return $this->hasMany(ProductImage::class)
        ->orderBy('sort_order');
}

public function primaryImage(): HasOne
{
    return $this->hasOne(ProductImage::class, 'product_id')
        ->where('is_primary', true);
}


    // Lignes de commande liées
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    // Fichier digital associé (si produit digital)
    public function digitalDeliverable(): HasOne
    {
        return $this->hasOne(DigitalDeliverable::class);
    }
}
