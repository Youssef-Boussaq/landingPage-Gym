<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AmeexEvent extends Model
{
    protected $fillable = [
        'ameex_shipment_id',
        'parcel_code',
        'status',
        'status_name',
        'status_color',
        'sub_status',
        'sub_status_name',
        'sub_status_color',
        'comment',
        'sandbox',
        'raw_payload',
        'received_at',
    ];

    protected function casts(): array
    {
        return [
            'sandbox' => 'boolean',
            'raw_payload' => 'array',
            'received_at' => 'datetime',
        ];
    }

    /**
     * Shipment المرتبط بهذا الحدث
     */
    public function shipment(): BelongsTo
    {
        return $this->belongsTo(AmeexShipment::class);
    }
}