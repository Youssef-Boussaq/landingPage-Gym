<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\EnsureGuestToken;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )

    ->withMiddleware(function (Middleware $middleware): void {

        /*
        |--------------------------------------------------------------------------
        | Web Middleware
        |--------------------------------------------------------------------------
        */

        $middleware->web(
            append: [
                HandleInertiaRequests::class,

                \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,

                EnsureGuestToken::class,
            ],
        );

        /*
        |--------------------------------------------------------------------------
        | Stripe Webhook - Disable CSRF
        |--------------------------------------------------------------------------
        */

        $middleware->validateCsrfTokens(
            except: [
                'stripe/webhook',
            ],
        );
    })

    ->withExceptions(function (Exceptions $exceptions): void {

        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );
    })

    ->create();