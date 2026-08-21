<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrderCreatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Order $order
    ) {
    }

    public function build()
    {
        return $this
            ->subject(
                "Nouvelle commande {$this->order->order_number}"
            )
            ->view('emails.orders.created');
    }
}