<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;


class Category extends Model
{
  use HasFactory;

    protected $fillable = [
        'parent_id',
        'name',
        'slug',
    ];

    // Parent category (sous-catégorie -> catégorie parente)
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    // Children categories (catégorie parente -> sous-catégories)
    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function media(): HasMany
    {
        return $this->hasMany(CategoryMedia::class)
            ->orderBy('sort_order');
    }

    public function primaryMedia(): HasOne
    {
        return $this->hasOne(CategoryMedia::class)
            ->where('is_primary', true);
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class);
    }

    /**
     * @return array<int, int>
     */
    public function descendantIds(): array
    {
        $ids = [];

        foreach ($this->children()->get(['id']) as $child) {
            $ids[] = $child->id;
            $ids = array_merge($ids, $child->descendantIds());
        }

        return $ids;
    }

    public function wouldCreateCycle(?int $parentId): bool
    {
        if ($parentId === null || $this->id === null) {
            return false;
        }

        if ($parentId === $this->id) {
            return true;
        }

        return in_array($parentId, $this->descendantIds(), true);
    }
}
