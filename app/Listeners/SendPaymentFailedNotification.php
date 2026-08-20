<?php

namespace App\Listeners;

use App\Events\PaymentFailed;
use App\Support\NotificationService;

class SendPaymentFailedNotification
{
    public function handle(PaymentFailed $event): void
    {
        NotificationService::paymentFailed(
            $event->order
        );
    }
}
