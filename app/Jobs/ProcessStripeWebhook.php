<?php

namespace App\Jobs;

use App\Services\Stripe\StripeWebhookService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessStripeWebhook implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public int $webhookEventId
    ) {}

    public function handle(
        StripeWebhookService $service
    ): void {
        $service->process($this->webhookEventId);
    }
}
