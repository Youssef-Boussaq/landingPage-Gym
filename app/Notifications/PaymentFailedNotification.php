<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class PaymentFailedNotification extends Notification
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

    /**
     * Unified notification data.
     */
    public function data(): array
    {
        return [
            'id' => (string) $this->order->id,

            'type' => 'payment_failed',

            'title' => 'Échec du paiement',

            'message' =>
                "Le paiement de votre commande {$this->order->order_number} a échoué.",

            'order_id' => $this->order->id,

            'order_number' => $this->order->order_number,

            'created_at' => now()->toISOString(),
        ];
    }

    /**
     * Laravel Database Notification.
     */
    public function toDatabase(object $notifiable): array
    {
        return $this->data();
    }

    /**
     * Guest Notification.
     */
    public function toGuestArray(): array
    {
        return $this->data();
    }
}
