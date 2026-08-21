<?php

namespace App\Listeners;

use App\Events\OrderConfirmed;
use App\Support\OrderMailer;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendOrderConfirmedEmail implements ShouldQueue
{
    public function handle(OrderConfirmed $event): void
    {
        OrderMailer::send(
            $event->order,
            'emails.orders.confirmed',
            "Commande confirmée {$event->order->order_number}"
        );
    }
}
