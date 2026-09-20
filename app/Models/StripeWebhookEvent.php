<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StripeWebhookEvent extends Model
{
    protected $fillable = [
        'stripe_event_id',
        'event_type',
        'payload',
        'status',
        'attempts',
        'processed_at',
        'failed_at',
        'last_error',
    ];

    protected $casts = [
        'processed_at' => 'datetime',
        'failed_at' => 'datetime',
    ];

    public function wasAlreadyProcessed(): bool
    {
        return $this->status === 'processed';
    }
}
