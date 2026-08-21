<?php

namespace App\Listeners;

use App\Events\OrderCancelled;
use App\Support\OrderMailer;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendOrderCancelledEmail implements ShouldQueue
{
    public function handle(OrderCancelled $event): void
    {
        OrderMailer::send(
            $event->order,
            'emails.orders.cancelled',
            "Commande annulée {$event->order->order_number}"
        );
    }
}
