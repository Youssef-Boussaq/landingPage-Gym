<?php

namespace App\Listeners;

use App\Events\OrderDelivered;
use App\Support\OrderMailer;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendOrderDeliveredEmail implements ShouldQueue
{
    public function handle(OrderDelivered $event): void
    {
        OrderMailer::send(
            $event->order,
            'emails.orders.delivered',
            "Commande livrée {$event->order->order_number}"
        );
    }
}
