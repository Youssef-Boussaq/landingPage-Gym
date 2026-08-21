<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class OrderController extends Controller
{
    use AuthorizesRequests;

    public function show(Request $request, Order $order)
    {
        $this->authorize('view', $order);

        $order->load([
            'items.product',
            'items.product.primaryImage',
            'attribution',
        ]);

        return Inertia::render('Store/Orders/Show', [
            'order' => $order,
        ]);
    }
}
