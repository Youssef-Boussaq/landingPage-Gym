<?php

namespace App\Support;

use App\Models\Order;
use App\Notifications\OrderCreatedNotification;
use App\Notifications\PaymentSuccessfulNotification;
use Illuminate\Notifications\Notification;

class NotificationService
{
    /**
     * Send order-created notification
     * to the correct customer type.
     */
    public static function orderCreated(Order $order): void
    {
        $notification = new OrderCreatedNotification($order);

        self::send($order, $notification);
    }

    /**
     * Send payment-successful notification
     * to the correct customer type.
     */
    public static function paymentSuccessful(Order $order): void
    {
        $notification = new PaymentSuccessfulNotification($order);

        self::send($order, $notification);
    }

    /**
     * Send notification to Client or Guest.
     */
    public static function send(
        Order $order,
        Notification $notification
    ): void {
        /*
        |--------------------------------------------------------------------------
        | Authenticated Client
        |--------------------------------------------------------------------------
        */

        if ($order->user_id !== null) {

            $user = $order->user;

            if ($user) {
                $user->notify($notification);
            }

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Guest
        |--------------------------------------------------------------------------
        */

        if ($order->guest_token !== null) {

            self::storeGuestNotification(
                $order->guest_token,
                $notification->toGuestArray()
            );
        }
    }

    /**
     * Store notification for a specific Guest.
     */
    private static function storeGuestNotification(
        string $guestToken,
        array $notification
    ): void {
        /*
        |--------------------------------------------------------------------------
        | Get all guest notifications
        |--------------------------------------------------------------------------
        */

        $guestNotifications = session()->get(
            'guest_notifications',
            []
        );

        /*
        |--------------------------------------------------------------------------
        | Make sure this Guest has a notification list
        |--------------------------------------------------------------------------
        */

        if (!isset($guestNotifications[$guestToken])) {
            $guestNotifications[$guestToken] = [];
        }

        /*
        |--------------------------------------------------------------------------
        | Add notification
        |--------------------------------------------------------------------------
        */

        $guestNotifications[$guestToken][] = $notification;

        /*
        |--------------------------------------------------------------------------
        | Save
        |--------------------------------------------------------------------------
        */

        session()->put(
            'guest_notifications',
            $guestNotifications
        );
    }
}