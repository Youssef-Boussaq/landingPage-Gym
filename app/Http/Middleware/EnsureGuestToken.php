<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class EnsureGuestToken
{
    public function handle(
        Request $request,
        Closure $next
    ): Response {
        if (!$request->cookie('guest_token')) {
            Cookie::queue(
                Cookie::make(
                    'guest_token',
                    (string) Str::uuid(),
                    60 * 24 * 30,
                    '/',
                    null,
                    app()->environment('production'),
                    true,
                    false,
                    'lax'
                )
            );
        }

        return $next($request);
    }
}