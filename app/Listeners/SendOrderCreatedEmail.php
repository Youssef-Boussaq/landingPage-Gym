<?php

namespace App\Listeners;

use App\Events\OrderCreated;
use App\Mail\OrderCreatedMail;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendOrderCreatedEmail implements ShouldQueue
{
    public function handle(OrderCreated $event): void
    {
        $order = $event->order;

        /*
        |--------------------------------------------------------------------------
        | Customer
        |--------------------------------------------------------------------------
        */

        if ($order->customer_email) {
            Mail::to($order->customer_email)
                ->send(
                    new OrderCreatedMail($order)
                );
        }

        /*
        |--------------------------------------------------------------------------
        | Admins
        |--------------------------------------------------------------------------
        */

        User::where('role', 'admin')
            ->get()
            ->each(function (User $admin) use ($order) {

                if (!$admin->email) {
                    return;
                }

                Mail::to($admin->email)
                    ->send(
                        new OrderCreatedMail($order)
                    );
            });
    }
}