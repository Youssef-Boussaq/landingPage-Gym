<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AmeexShipment extends Model
{
    protected $fillable = [
        'order_id',
        'ameex_city_record_id',
        'parcel_code',
        'status',
        'status_name',
        'status_color',
        'sub_status',
        'sub_status_name',
        'sub_status_color',
        'comment',
        'sandbox',
    ];

    protected function casts(): array
    {
        return [
            'sandbox' => 'boolean',
        ];
    }

    /**
     * Order المرتبط بهذه الشحنة
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * مدينة AMEEX
     */
    public function city(): BelongsTo
    {
        return $this->belongsTo(
            AmeexCity::class,
            'ameex_city_record_id'
        );
    }

    /**
     * جميع أحداث Webhook الخاصة بهذه الشحنة
     */
    public function events(): HasMany
    {
        return $this->hasMany(AmeexEvent::class);
    }
}