<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function markAsRead(Request $request, string $notification)
    {
        // Client
        if ($request->user()) {
            $request->user()
                ->notifications()
                ->where('id', $notification)
                ->firstOrFail()
                ->markAsRead();

            return back();
        }

        // Guest
        $identity = \App\Support\CustomerIdentity::resolve($request);
        $guestToken = $identity->guestToken();

        if ($guestToken) {
            $notifications = \Illuminate\Support\Facades\Cache::get(
                "guest_notifications_{$guestToken}",
                []
            );

            $notifications = collect($notifications)
                ->map(function (array $item) use ($notification) {
                    if (($item['id'] ?? null) === $notification) {
                        $item['read_at'] = now()->toISOString();
                    }
                    return $item;
                })
                ->values()
                ->all();

            \Illuminate\Support\Facades\Cache::put(
                "guest_notifications_{$guestToken}",
                $notifications,
                now()->addDays(7)
            );
        }

        return back();
    }

    public function markAllAsRead(Request $request)
    {
        // Client
        if ($request->user()) {
            $request->user()
                ->unreadNotifications
                ->markAsRead();

            return back();
        }

        // Guest
        $identity = \App\Support\CustomerIdentity::resolve($request);
        $guestToken = $identity->guestToken();

        if ($guestToken) {
            $notifications = \Illuminate\Support\Facades\Cache::get(
                "guest_notifications_{$guestToken}",
                []
            );

            $notifications = collect($notifications)
                ->map(function (array $item) {
                    $item['read_at'] = now()->toISOString();
                    return $item;
                })
                ->values()
                ->all();

            \Illuminate\Support\Facades\Cache::put(
                "guest_notifications_{$guestToken}",
                $notifications,
                now()->addDays(7)
            );
        }

        return back();
    }
}