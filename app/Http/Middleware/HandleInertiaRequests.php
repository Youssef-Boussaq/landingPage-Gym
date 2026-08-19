<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

use App\Models\Category;
use Illuminate\Support\Facades\Cache;


class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    

public function share(Request $request): array
{
    $cart = session()->get('cart', []);

    return [
        ...parent::share($request),

        'auth' => [
            'user' => $request->user(),
        ],

       'categories' => Category::with('children.children')
            ->whereNull('parent_id')
            ->orderBy('name', 'asc')
            ->get(),
                
        

        'cart' => [
            'items' => $cart,

            'count' => collect($cart)->sum(function ($item) {
                return (int) ($item['quantity'] ?? 0);
            }),
        ],
      'notifications' => fn () => $request->user()
    ? $request->user()
        ->unreadNotifications
        ->take(10)
        ->map(function ($notification) {
            return [
                'id' => $notification->id,
                'type' => $notification->data['type'] ?? null,
                'title' => $notification->data['title'] ?? null,
                'message' => $notification->data['message'] ?? null,
                'order_id' => $notification->data['order_id'] ?? null,
                'order_number' => $notification->data['order_number'] ?? null,
                'created_at' => $notification->created_at,
                'read_at' => $notification->read_at,
            ];
        })
        ->values()
    : ($request->session()->get('notification')
        ? collect([
            $request->session()->get('notification'),
        ])
        : collect()),

'notifications_count' => fn () => $request->user()
    ? $request->user()->unreadNotifications()->count()
    : ($request->session()->has('notification') ? 1 : 0),

'notification' => fn () => $request->session()->get('notification'),
    ];
}
}

