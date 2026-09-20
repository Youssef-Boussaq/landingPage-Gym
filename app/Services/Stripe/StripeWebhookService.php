<?php

namespace App\Services\Stripe;

use App\Models\StripeWebhookEvent;
use App\Services\Orders\OrderPaymentService;
use Illuminate\Support\Facades\Log;

class StripeWebhookService
{
    public function __construct(
        private OrderPaymentService $paymentService
    ) {}

    public function process(int $webhookEventId): void
    {
        $webhookEvent = StripeWebhookEvent::find($webhookEventId);

        if (!$webhookEvent) {
            return;
        }

        if ($webhookEvent->wasAlreadyProcessed()) {
            return;
        }

        try {
            $webhookEvent->update([
                'status' => 'processing',
                'attempts' => $webhookEvent->attempts + 1,
            ]);

            $payload = json_decode($webhookEvent->payload ?? '{}', true);

            Log::info('Processing Stripe webhook', [
                'event_id' => $webhookEvent->stripe_event_id,
                'event_type' => $webhookEvent->event_type,
            ]);

            match ($webhookEvent->event_type) {
                'checkout.session.completed' => $this->checkoutCompleted($payload),
                'checkout.session.async_payment_succeeded' => $this->paymentSucceeded($payload),
                'checkout.session.async_payment_failed' => $this->paymentFailed($payload),
                'payment_intent.payment_failed' => $this->paymentIntentFailed($payload),
                default => null,
            };

            $webhookEvent->update([
                'status' => 'processed',
                'processed_at' => now(),
            ]);

        } catch (\Throwable $e) {
            $webhookEvent->update([
                'status' => 'failed',
                'failed_at' => now(),
                'last_error' => $e->getMessage(),
            ]);

            Log::error('Webhook processing failed', [
                'event_id' => $webhookEvent->stripe_event_id,
                'error' => $e->getMessage(),
            ]);
            
            throw $e;
        }
    }

    private function checkoutCompleted(array $session): void
    {
        $orderId = data_get($session, 'metadata.order_id');

        if (!$orderId) {
            Log::error('Stripe order_id missing', [
                'session_id' => data_get($session, 'id'),
            ]);
            return;
        }

        if (data_get($session, 'payment_status') === 'paid') {
            $this->paymentService->markPaid(
                (int) $orderId,
                data_get($session, 'id'),
                data_get($session, 'payment_intent')
            );
        }
    }

    private function paymentSucceeded(array $session): void
    {
        $orderId = data_get($session, 'metadata.order_id');

        if (!$orderId) {
            return;
        }

        $this->paymentService->markPaid(
            (int) $orderId,
            data_get($session, 'id'),
            data_get($session, 'payment_intent')
        );
    }

    private function paymentFailed(array $session): void
    {
        $orderId = data_get($session, 'metadata.order_id');

        if (!$orderId) {
            return;
        }

        $this->paymentService->markFailed((int) $orderId);
    }

    private function paymentIntentFailed(array $paymentIntent): void
    {
        $orderId = data_get($paymentIntent, 'metadata.order_id');

        if (!$orderId) {
            return;
        }

        $this->paymentService->markFailed((int) $orderId);
    }
}
