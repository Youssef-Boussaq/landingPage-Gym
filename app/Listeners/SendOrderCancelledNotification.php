<?php

namespace App\Listeners;

use App\Events\OrderCancelled;
use App\Support\NotificationService;

class SendOrderCancelledNotification
{
    public function handle(OrderCancelled $event): void
    {
        NotificationService::orderCancelled(
            $event->order
        );
    }
}
