<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrderEventMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Order $order,
        public string $emailView,
        public string $emailSubject,
    ) {
    }

    public function build()
    {
        return $this
            ->subject($this->emailSubject)
            ->view($this->emailView);
    }
}
