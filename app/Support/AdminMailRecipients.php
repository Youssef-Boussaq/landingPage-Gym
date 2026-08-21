<?php

namespace App\Support;

use App\Models\User;

class AdminMailRecipients
{
    /**
     * @return array<int, string>
     */
    public static function emails(): array
    {
        $emails = User::query()
            ->where('role', 'admin')
            ->whereNotNull('email')
            ->pluck('email')
            ->all();

        $configured = config('store.admin_notification_email');

        if (is_string($configured) && $configured !== '') {
            $emails[] = $configured;
        }

        return array_values(array_unique(array_filter($emails)));
    }
}
