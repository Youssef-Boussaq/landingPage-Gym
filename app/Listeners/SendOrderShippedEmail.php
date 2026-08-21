<?php

namespace App\Listeners;

use App\Events\OrderShipped;
use App\Support\OrderMailer;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendOrderShippedEmail implements ShouldQueue
{
    public function handle(OrderShipped $event): void
    {
        OrderMailer::send(
            $event->order,
            'emails.orders.shipped',
            "Commande expédiée {$event->order->order_number}"
        );
    }
}
