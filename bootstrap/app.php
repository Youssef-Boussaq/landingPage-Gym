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
                'webhooks/ameex',
            ],
        );

        $middleware->alias([
            'admin' => \App\Http\Middleware\EnsureUserIsAdmin::class,
        ]);
    })

    ->withExceptions(function (Exceptions $exceptions): void {

        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->is('webhooks/*') || $request->is('stripe/*'),
        );

        $exceptions->render(function (\Stripe\Exception\ApiErrorException $e, Request $request) {
            \Illuminate\Support\Facades\Log::error('[STRIPE API ERROR] ' . $e->getMessage(), [
                'exception' => $e,
                'path' => $request->path(),
            ]);

            if ($request->wantsJson()) {
                return response()->json([
                    'error' => 'Erreur de communication avec le service de paiement.',
                    'message' => $e->getMessage(),
                ], 502);
            }

            return back()->withErrors([
                'error' => 'Erreur avec le service de paiement : ' . $e->getMessage(),
            ]);
        });
    })

    ->create();