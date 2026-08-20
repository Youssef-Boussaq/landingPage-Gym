<?php

namespace App\Listeners;

use App\Events\OrderDelivered;
use App\Support\NotificationService;

class SendOrderDeliveredNotification
{
    public function handle(OrderDelivered $event): void
    {
        NotificationService::orderDelivered(
            $event->order
        );
    }
}
