<?php

namespace App\Listeners;

use App\Events\OrderCreated;
use App\Support\OrderMailer;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendOrderCreatedEmail implements ShouldQueue
{
    public function handle(OrderCreated $event): void
    {
        OrderMailer::send(
            $event->order,
            'emails.orders.created',
            "Nouvelle commande {$event->order->order_number}"
        );
    }
}
