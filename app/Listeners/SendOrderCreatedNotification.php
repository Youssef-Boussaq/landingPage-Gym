<?php

namespace App\Listeners;

use App\Events\OrderCreated;
use App\Support\NotificationService;

class SendOrderCreatedNotification
{
    public function handle(OrderCreated $event): void
    {
        NotificationService::orderCreated(
            $event->order
        );
    }
}