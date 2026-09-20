<?php

namespace App\Listeners;

use App\Events\PaymentFailed;
use App\Support\NotificationService;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendPaymentFailedNotification implements ShouldQueue
{
    public function handle(PaymentFailed $event): void
    {
        NotificationService::paymentFailed(
            $event->order
        );
    }
}
