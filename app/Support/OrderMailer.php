<?php

namespace App\Support;

use App\Mail\OrderCreatedMail;
use App\Mail\OrderEventMail;
use App\Models\Order;
use Illuminate\Support\Facades\Mail;

class OrderMailer
{
    public static function send(
        Order $order,
        string $view,
        string $customerSubject,
        ?string $adminSubject = null
    ): void {
        $customerEmail = $order->customer_email;

        if ($customerEmail) {
            Mail::to($customerEmail)->send(
                $view === 'emails.orders.created'
                    ? new OrderCreatedMail($order)
                    : new OrderEventMail($order, $view, $customerSubject)
            );
        }

        $adminSubject ??= $customerSubject;

        foreach (AdminMailRecipients::emails() as $email) {
            if ($customerEmail && strcasecmp($email, $customerEmail) === 0) {
                continue;
            }

            Mail::to($email)->send(
                $view === 'emails.orders.created'
                    ? new OrderCreatedMail($order)
                    : new OrderEventMail($order, $view, $adminSubject)
            );
        }
    }
}
