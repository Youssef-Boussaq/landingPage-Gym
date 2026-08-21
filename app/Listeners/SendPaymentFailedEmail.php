<?php

namespace App\Listeners;

use App\Events\PaymentFailed;
use App\Support\OrderMailer;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendPaymentFailedEmail implements ShouldQueue
{
    public function handle(PaymentFailed $event): void
    {
        OrderMailer::send(
            $event->order,
            'emails.orders.payment-failed',
            "Échec du paiement {$event->order->order_number}"
        );
    }
}
