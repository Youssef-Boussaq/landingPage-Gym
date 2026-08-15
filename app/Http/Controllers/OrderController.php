<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class OrderController extends Controller
{
     public function show(Request $request, Order $order)
    {
        // Logged user: only allow access to his own order
        if ($request->user() && $order->user_id !== $request->user()->id) {
            abort(403);
        }

        $order->load([
            'items.product',
        ]);

        return Inertia::render('Store/Orders/Show', [
            'order' => $order,
        ]);
    }
}
