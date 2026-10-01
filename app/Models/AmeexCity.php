<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AmeexCity extends Model
{
    protected $fillable = [
        'ameex_id',
        'name',
        'name_ar',
        'name_fr',
        'active',
        'raw_data',
    ];

    protected function casts(): array
    {
        return [
            'ameex_id' => 'integer',
            'active' => 'boolean',
            'raw_data' => 'array',
        ];
    }

    public function shipments(): HasMany
    {
        return $this->hasMany(AmeexShipment::class, 'ameex_city_record_id');
    }
}