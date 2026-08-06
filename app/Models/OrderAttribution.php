<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;




use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderAttribution extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_content',
        'fbclid',
        'gclid',
        'referer_url',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}