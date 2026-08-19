<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function markAsRead(Request $request, string $notification)
    {
        if ($request->user()) {

            $request->user()
                ->notifications()
                ->where('id', $notification)
                ->firstOrFail()
                ->markAsRead();

            return back();
        }

        /*
        |--------------------------------------------------------------------------
        | Guest
        |--------------------------------------------------------------------------
        */

        $sessionNotification = $request->session()->get('notification');

        if (
            $sessionNotification &&
            ($sessionNotification['id'] ?? null) === $notification
        ) {
            $request->session()->forget('notification');
        }

        return back();
    }

    public function markAllAsRead(Request $request)
    {
        if ($request->user()) {

            $request->user()
                ->unreadNotifications
                ->markAsRead();

            return back();
        }

        /*
        |--------------------------------------------------------------------------
        | Guest
        |--------------------------------------------------------------------------
        */

        $request->session()->forget('notification');

        return back();
    }
}