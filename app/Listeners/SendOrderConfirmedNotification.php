<?php

namespace App\Listeners;

use App\Events\OrderConfirmed;
use App\Support\NotificationService;

class SendOrderConfirmedNotification
{
    public function handle(OrderConfirmed $event): void
    {
        NotificationService::orderConfirmed(
            $event->order
        );
    }
}
