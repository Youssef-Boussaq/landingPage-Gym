<?php

namespace App\Listeners;

use App\Events\PaymentSuccessful;
use App\Support\NotificationService;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendPaymentSuccessfulNotification implements ShouldQueue
{
    public function handle(PaymentSuccessful $event): void
    {
        NotificationService::paymentSuccessful(
            $event->order
        );
    }
}