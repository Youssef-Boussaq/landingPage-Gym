<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class PaymentSuccessfulNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Order $order
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function data(): array
    {
        return [
            'id' => (string) $this->order->id,

            'type' => 'payment_successful',

            'title' => 'Paiement réussi',

            'message' =>
                "Le paiement de la commande {$this->order->order_number} a été confirmé.",

            'order_id' => $this->order->id,

            'order_number' => $this->order->order_number,

            'created_at' => now()->toISOString(),
        ];
    }

    public function toDatabase(object $notifiable): array
    {
        return $this->data();
    }

    public function toGuestArray(): array
    {
        return $this->data();
    }
}