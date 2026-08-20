<?php

namespace App\Support;

use App\Models\Order;
use App\Notifications\OrderCreatedNotification;
use App\Notifications\PaymentSuccessfulNotification;
use App\Notifications\OrderConfirmedNotification;
use App\Notifications\OrderShippedNotification;
use App\Notifications\OrderDeliveredNotification;
use App\Notifications\OrderCancelledNotification;
use App\Notifications\PaymentFailedNotification;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;

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

    public static function orderConfirmed(Order $order): void
    {
        $notification = new OrderConfirmedNotification($order);
        self::send($order, $notification);
    }

    public static function orderShipped(Order $order): void
    {
        $notification = new OrderShippedNotification($order);
        self::send($order, $notification);
    }

    public static function orderDelivered(Order $order): void
    {
        $notification = new OrderDeliveredNotification($order);
        self::send($order, $notification);
    }

    public static function orderCancelled(Order $order): void
    {
        $notification = new OrderCancelledNotification($order);
        self::send($order, $notification);
    }

    public static function paymentFailed(Order $order): void
    {
        $notification = new PaymentFailedNotification($order);
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

        if (!isset($notification['id'])) {
            $notification['id'] = (string) Str::uuid();
        }

        $guestNotifications = \Illuminate\Support\Facades\Cache::get(
            "guest_notifications_{$guestToken}",
            []
        );

        /*
        |--------------------------------------------------------------------------
        | Add notification
        |--------------------------------------------------------------------------
        */

        $guestNotifications[] = $notification;

        /*
        |--------------------------------------------------------------------------
        | Save
        |--------------------------------------------------------------------------
        */

        \Illuminate\Support\Facades\Cache::put(
            "guest_notifications_{$guestToken}",
            $guestNotifications,
            now()->addDays(7)
        );
    }
}