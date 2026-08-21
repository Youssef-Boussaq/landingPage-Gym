<?php

namespace App\Notifications;

use App\Models\Order;
use App\Notifications\Concerns\BuildsOrderNotificationData;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class OrderCreatedNotification extends Notification
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
            'order_created',
            'Commande créée',
            "Votre commande {$this->order->order_number} a été créée.",
            'Nouvelle commande',
            "Commande {$this->order->order_number} créée par {$this->order->customer_name}.",
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
