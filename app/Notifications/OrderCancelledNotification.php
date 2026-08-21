<?php

namespace App\Notifications;

use App\Models\Order;
use App\Notifications\Concerns\BuildsOrderNotificationData;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class OrderCancelledNotification extends Notification
{
    use BuildsOrderNotificationData;
    use Queueable;

    public function __construct(
        public Order $order
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function data(?object $notifiable = null): array
    {
        return $this->payload(
            'order_cancelled',
            'Commande annulée',
            "Votre commande {$this->order->order_number} a été annulée.",
            'Commande annulée',
            "La commande {$this->order->order_number} a été annulée.",
            $notifiable
        );
    }

    public function toDatabase(object $notifiable): array
    {
        return $this->data($notifiable);
    }

    public function toGuestArray(): array
    {
        return $this->data();
    }
}
