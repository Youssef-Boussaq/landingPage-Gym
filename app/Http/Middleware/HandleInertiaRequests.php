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

        'categories' => Category::orderBy('name', 'asc')->get(),

        'cart' => [
            'items' => $cart,

            'count' => collect($cart)->sum(function ($item) {
                return (int) ($item['quantity'] ?? 0);
            }),
        ],
    ];
}
}

