<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessStripeWebhook;
use App\Models\StripeWebhookEvent;
use Illuminate\Http\Request;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;
use UnexpectedValueException;

class StripeWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $payload = $request->getContent();
        $signature = $request->header('Stripe-Signature');
        $webhookSecret = config('services.stripe.webhook_secret');

        try {
            $event = Webhook::constructEvent(
                $payload,
                $signature,
                $webhookSecret
            );
        } catch (UnexpectedValueException $e) {
            \Log::error('STRIPE WEBHOOK INVALID PAYLOAD', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Invalid payload',
            ], 400);
        } catch (SignatureVerificationException $e) {
            \Log::error('STRIPE WEBHOOK INVALID SIGNATURE', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Invalid signature',
            ], 400);
        }

        /*
        |--------------------------------------------------------------------------
        | Idempotency Layer
        |--------------------------------------------------------------------------
        */

        $webhookEvent = StripeWebhookEvent::firstOrCreate(
            ['stripe_event_id' => $event->id],
            [
                'event_type' => $event->type,
                'payload' => json_encode($event->data->object->toArray()),
                'status' => 'pending',
            ]
        );

        if ($webhookEvent->wasAlreadyProcessed() || $webhookEvent->status === 'processing') {
            return response()->json([
                'received' => true,
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Dispatch Job
        |--------------------------------------------------------------------------
        */

        ProcessStripeWebhook::dispatch($webhookEvent->id);

        return response()->json([
            'received' => true,
        ]);
    }
}