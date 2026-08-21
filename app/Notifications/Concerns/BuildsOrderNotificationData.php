<?php

namespace App\Notifications\Concerns;

use App\Models\User;

trait BuildsOrderNotificationData
{
    /**
     * @return array<string, mixed>
     */
    protected function payload(
        string $type,
        string $customerTitle,
        string $customerMessage,
        string $adminTitle,
        string $adminMessage,
        ?object $notifiable = null
    ): array {
        $isAdmin = $notifiable instanceof User && $notifiable->role === 'admin';

        return [
            'id' => (string) $this->order->id,
            'type' => $type,
            'title' => $isAdmin ? $adminTitle : $customerTitle,
            'message' => $isAdmin ? $adminMessage : $customerMessage,
            'order_id' => $this->order->id,
            'order_number' => $this->order->order_number,
            'created_at' => now()->toIso8601String(),
        ];
    }
}
