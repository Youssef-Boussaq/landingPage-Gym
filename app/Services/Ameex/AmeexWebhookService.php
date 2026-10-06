<?php
namespace App\Services\Ameex;

use App\Enums\OrderStatus;
use App\Models\AmeexEvent;
use App\Models\AmeexShipment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use RuntimeException;


class AmeexWebhookService
{
    /**
     * AMEEX statuses that actually change our Order status.
     */
    private const ORDER_STATUS_MAP = [
        'DISTRIBUTION' => OrderStatus::OUT_FOR_DELIVERY,
        'DELIVERED' => OrderStatus::DELIVERED,
        'RETURNED' => OrderStatus::RETURNED,
    ];

    public function handle(Request $request): void
    {
        $payload = $this->normalizePayload(
            $request
        );

        $this->verifySignature(
            $request
        );

        $parcelCode = $payload['parcel_code'];

        $shipment = AmeexShipment::query()
            ->where('parcel_code', $parcelCode)
            ->first();

        if (!$shipment) {
            throw new RuntimeException(
                "Aucun colis AMEEX trouvé pour le parcel_code : {$parcelCode}"
            );
        }

        DB::transaction(function () use (
            $shipment,
            $payload
        ): void {
            /*
             * Always save the AMEEX event.
             */
            AmeexEvent::create([
                'ameex_shipment_id' => $shipment->id,
                'parcel_code' => $payload['parcel_code'],

                'status' => $payload['status'],
                'status_name' => $payload['status_name'],
                'status_color' => $payload['status_color'],

                'sub_status' => $payload['sub_status'],
                'sub_status_name' => $payload['sub_status_name'],
                'sub_status_color' => $payload['sub_status_color'],

                'comment' => $payload['comment'],
                'sandbox' => $payload['sandbox'],

                'raw_payload' => $payload['raw_payload'],

                'received_at' => now(),
            ]);

            /*
             * Update the current AMEEX shipment state.
             */
            $shipment->update([
                'status' => $payload['status'],
                'status_name' => $payload['status_name'],
                'status_color' => $payload['status_color'],

                'sub_status' => $payload['sub_status'],
                'sub_status_name' => $payload['sub_status_name'],
                'sub_status_color' => $payload['sub_status_color'],

                'comment' => $payload['comment'],
                'sandbox' => $payload['sandbox'],
            ]);

            /*
             * Only selected AMEEX statuses change the Order.
             */
            $newOrderStatus = self::ORDER_STATUS_MAP[
                $payload['status']
            ] ?? null;

            if (!$newOrderStatus) {
                return;
            }

            $order = $shipment->order()
                ->lockForUpdate()
                ->first();

            if (!$order) {
                return;
            }

            /*
             * Never move an Order backwards.
             */
            if (
                $newOrderStatus === OrderStatus::OUT_FOR_DELIVERY
                && $order->status !== OrderStatus::SHIPPED
            ) {
                return;
            }

            if (
                $newOrderStatus === OrderStatus::DELIVERED
                && !in_array(
                    $order->status,
                    [
                        OrderStatus::SHIPPED,
                        OrderStatus::OUT_FOR_DELIVERY,
                    ],
                    true
                )
            ) {
                return;
            }

            if (
                $newOrderStatus === OrderStatus::RETURNED
                && $order->status !== OrderStatus::OUT_FOR_DELIVERY
            ) {
                return;
            }

            $updates = [
                'status' => $newOrderStatus,
            ];

            if ($newOrderStatus === OrderStatus::DELIVERED) {
                $updates['delivered_at'] = now();

                /*
                 * Cash on delivery becomes paid
                 * only when AMEEX confirms delivery.
                 */
                if ($order->payment_method === 'cash') {
                    $updates['payment_status'] = 'paid';
                }
            }

            if ($newOrderStatus === OrderStatus::RETURNED) {
                $updates['returned_at'] = now();
            }

            $order->update($updates);
        });
    }

    private function normalizePayload(
        Request $request
    ): array {
        $status = strtoupper(
            trim((string) $request->input('STATUT', ''))
        );

        if ($status === '') {
            throw new RuntimeException(
                'AMEEX webhook: STATUT is missing.'
            );
        }

        $parcelCode = trim(
            (string) $request->input('CODE', '')
        );

        if ($parcelCode === '') {
            throw new RuntimeException(
                'AMEEX webhook: CODE is missing.'
            );
        }

        return [
            'parcel_code' => $parcelCode,

            'status' => $status,
            'status_name' => $this->nullableString(
                $request->input('STATUT_NAME')
            ),
            'status_color' => $this->nullableString(
                $request->input('STATUT_COLOR')
            ),

            'sub_status' => $this->nullableString(
                $request->input('STATUT_S')
            ),
            'sub_status_name' => $this->nullableString(
                $request->input('STATUT_S_NAME')
            ),
            'sub_status_color' => $this->nullableString(
                $request->input('STATUT_S_COLOR')
            ),

            'comment' => $this->nullableString(
                $request->input('COMMENT')
            ),

            'sandbox' => filter_var(
                $request->input('SANDBOX', false),
                FILTER_VALIDATE_BOOLEAN
            ),

            'raw_payload' => $request->all(),
        ];
    }

    private function verifySignature(
        Request $request
    ): void {
        $secret = config(
            'services.ameex.webhook_secret'
        );

        /*
         * If no webhook secret is configured,
         * signature verification is skipped.
         *
         * For production, configure the secret.
         */
        if (!$secret) {
            return;
        }

        $signature = $request->header(
            'X-Ameex-Signature'
        );

        if (!$signature) {
            throw new RuntimeException(
                'AMEEX webhook signature is missing.'
            );
        }

        /*
         * Expected:
         *
         * t=timestamp,v1=signature
         */
        $parts = [];

        foreach (
            explode(',', $signature)
            as $part
        ) {
            [$key, $value] = array_pad(
                explode('=', $part, 2),
                2,
                null
            );

            if ($key && $value) {
                $parts[trim($key)] = trim($value);
            }
        }

        $timestamp = $parts['t'] ?? null;
        $receivedSignature = $parts['v1'] ?? null;

        if (
            !$timestamp ||
            !$receivedSignature
        ) {
            throw new RuntimeException(
                'AMEEX webhook signature format is invalid.'
            );
        }

        $signedPayload =
            $timestamp . '.' . $request->getContent();

        $expectedSignature = hash_hmac(
            'sha256',
            $signedPayload,
            $secret
        );

        if (
            !hash_equals(
                $expectedSignature,
                $receivedSignature
            )
        ) {
            throw new RuntimeException(
                'AMEEX webhook signature is invalid.'
            );
        }
    }

    private function nullableString(
        mixed $value
    ): ?string {
        if (
            !is_string($value) &&
            !is_numeric($value)
        ) {
            return null;
        }

        $value = trim((string) $value);

        return $value !== ''
            ? $value
            : null;
    }
}

