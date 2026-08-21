<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;
use App\Support\CustomerIdentity;

class OrderPolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(?User $user, Order $order): bool
    {
        $identity = CustomerIdentity::resolve(request());

        if ($identity->isAuthenticated()) {
            return $identity->userId() === $order->user_id;
        }

        if ($identity->isGuest()) {
            return $identity->guestToken() === $order->guest_token;
        }

        return false;
    }
}
