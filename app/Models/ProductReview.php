<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductReview extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'user_id',
        'order_id',
        'reviewer_name',
        'reviewer_email',
        'rating',
        'title',
        'comment',
        'is_verified_purchase',
        'status',
        'admin_reply',
        'admin_replied_at',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'integer',
            'is_verified_purchase' => 'boolean',
            'admin_replied_at' => 'datetime',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    public function scopeWithRating($query)
    {
        return $query->whereNotNull('rating');
    }

    public function scopeWithoutRating($query)
    {
        return $query->whereNull('rating');
    }

    public function scopeVerified($query)
    {
        return $query->where('is_verified_purchase', true);
    }
}

