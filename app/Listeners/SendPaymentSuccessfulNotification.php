<?php

namespace App\Listeners;

use App\Events\PaymentSuccessful;
use App\Support\NotificationService;

class SendPaymentSuccessfulNotification
{
    public function handle(PaymentSuccessful $event): void
    {
        NotificationService::paymentSuccessful(
            $event->order
        );
    }
}