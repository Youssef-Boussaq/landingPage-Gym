<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Enums\OrderStatus;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
    'user_id',
    'guest_token',
    'order_number',
    'status',
    'total_amount',
    'payment_method',
    'transaction_id',

    'customer_name',
    'customer_email',
    'customer_phone',

    'shipping_address',
    'city',
    'postal_code',
];

    protected function casts(): array
{
    return [
        'status' => \App\Enums\OrderStatus::class,
        'payment_status' => \App\Enums\PaymentStatus::class,
        'total_amount' => 'decimal:2',
    ];
}

    // Client ayant passé la commande
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Lignes de commande
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    // Métadonnées d'attribution marketing
    public function attribution(): HasOne
    {
        return $this->hasOne(OrderAttribution::class);
    }
}