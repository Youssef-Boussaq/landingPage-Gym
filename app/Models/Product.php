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
use App\Models\ProductReview;


class Product extends Model
{
    


use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'type',
        'digital_file_path',
        'digital_file_name',
        'digital_file_size',
        'digital_download_link',
        'price',
        'sale_price',
        'stock_quantity',
        'reserved_quantity',
        'manage_stock',
        'is_active',
    ];

    protected $appends = [
        'has_digital_content',
        'formatted_file_size',
    ];

    protected function casts(): array
    {
        return [
            'type' => ProductType::class,
            'price' => 'decimal:2',
            'sale_price' => 'decimal:2',
            'stock_quantity' => 'integer',
            'reserved_quantity' => 'integer',
            'digital_file_size' => 'integer',
            'manage_stock' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function getHasDigitalContentAttribute(): bool
    {
        return !empty($this->digital_file_path) || !empty($this->digital_download_link);
    }

    public function getFormattedFileSizeAttribute(): ?string
    {
        if (!$this->digital_file_size) {
            return null;
        }

        $bytes = (int) $this->digital_file_size;
        $units = ['B', 'KB', 'MB', 'GB'];
        $i = 0;
        while ($bytes >= 1024 && $i < count($units) - 1) {
            $bytes /= 1024;
            $i++;
        }

        return round($bytes, 1) . ' ' . $units[$i];
    }

    public function getAvailableStockAttribute(): int
    {
        return max(0, $this->stock_quantity - $this->reserved_quantity);
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

    // Tous les avis
    public function reviews(): HasMany
    {
        return $this->hasMany(ProductReview::class);
    }

    // Avis approuvés uniquement
    public function approvedReviews(): HasMany
    {
        return $this->hasMany(ProductReview::class)
            ->where('status', 'approved')
            ->latest();
    }

    // Avis approuvés avec une note chiffrée
    public function approvedRatings(): HasMany
    {
        return $this->hasMany(ProductReview::class)
            ->where('status', 'approved')
            ->whereNotNull('rating');
    }

    /**
     * Statistiques complètes des avis approuvés.
     * Prend en compte les avis sans note (message uniquement)
     * sans fausser la moyenne ni afficher un 0.0 artificiel.
     */
    public function getReviewStatsAttribute(): array
    {
        $approved = $this->relationLoaded('approvedReviews')
            ? $this->approvedReviews
            : $this->approvedReviews()->get();

        $totalReviews = $approved->count();
        $ratedReviews = $approved->whereNotNull('rating');
        $ratingsCount = $ratedReviews->count();
        $unratedCount = $totalReviews - $ratingsCount;

        $averageRating = $ratingsCount > 0
            ? round((float) $ratedReviews->avg('rating'), 1)
            : null;

        $distribution = [5 => 0, 4 => 0, 3 => 0, 2 => 0, 1 => 0];
        foreach ($ratedReviews as $rev) {
            $r = (int) $rev->rating;
            if (isset($distribution[$r])) {
                $distribution[$r]++;
            }
        }

        $distributionPercentages = [];
        foreach ($distribution as $star => $count) {
            $distributionPercentages[$star] = $ratingsCount > 0
                ? (int) round(($count / $ratingsCount) * 100)
                : 0;
        }

        return [
            'total_reviews'            => $totalReviews,
            'ratings_count'            => $ratingsCount,
            'unrated_count'            => $unratedCount,
            'average_rating'           => $averageRating,
            'has_ratings'              => $ratingsCount > 0,
            'distribution'             => $distribution,
            'distribution_percentages' => $distributionPercentages,
        ];
    }
}
