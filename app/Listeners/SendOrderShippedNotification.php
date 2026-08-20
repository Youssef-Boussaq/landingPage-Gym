<?php

namespace App\Listeners;

use App\Events\OrderShipped;
use App\Support\NotificationService;

class SendOrderShippedNotification
{
    public function handle(OrderShipped $event): void
    {
        NotificationService::orderShipped(
            $event->order
        );
    }
}
