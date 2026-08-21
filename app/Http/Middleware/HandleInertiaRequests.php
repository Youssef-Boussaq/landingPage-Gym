<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

use App\Models\Category;
use App\Support\CustomerIdentity;
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
    $user = $request->user();
    
    return [
        ...parent::share($request),

        'auth' => [
            'user' => $user,
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
        'notifications' => function () use ($request, $user) {
            // Client
            if ($user) {
                return $user->notifications()
                    ->latest()
                    ->limit(20)
                    ->get()
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
                    ->values();
            }

            // Guest
            $identity = CustomerIdentity::resolve($request);
            $guestToken = $identity->guestToken();
            
            $currentGuestNotifications = $guestToken
                ? \Illuminate\Support\Facades\Cache::get("guest_notifications_{$guestToken}", [])
                : [];

            return collect($currentGuestNotifications)
                ->map(function ($notification, $index) {
                    return [
                        'id' => (string) ($notification['id'] ?? 'guest-' . $index),
                        'type' => $notification['type'] ?? null,
                        'title' => $notification['title'] ?? null,
                        'message' => $notification['message'] ?? null,
                        'order_id' => $notification['order_id'] ?? null,
                        'order_number' => $notification['order_number'] ?? null,
                        'created_at' => $notification['created_at'] ?? null,
                        'read_at' => $notification['read_at'] ?? null,
                    ];
                })
                ->sortByDesc('created_at')
                ->take(20)
                ->values();
        },
    ];
}
}

