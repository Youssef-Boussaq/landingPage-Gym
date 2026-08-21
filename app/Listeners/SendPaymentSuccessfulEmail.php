<?php

namespace App\Listeners;

use App\Events\PaymentSuccessful;
use App\Support\OrderMailer;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendPaymentSuccessfulEmail implements ShouldQueue
{
    public function handle(PaymentSuccessful $event): void
    {
        OrderMailer::send(
            $event->order,
            'emails.orders.payment-successful',
            "Paiement confirmé {$event->order->order_number}"
        );
    }
}
