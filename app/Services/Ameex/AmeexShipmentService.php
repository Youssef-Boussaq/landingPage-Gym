<?php

namespace App\Services\Ameex;

use App\Models\AmeexCity;
use App\Models\AmeexShipment;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class AmeexShipmentService
{
    public function __construct(
        private readonly AmeexClient $client
    ) {
    }

    /**
     * Create an AMEEX parcel for an order.
     *
     * This method:
     * - validates the order
     * - creates the parcel on AMEEX
     * - saves the parcel locally
     *
     * This method does NOT:
     * - change order status
     * - modify stock
     */
    public function create(
        Order $order,
        AmeexCity $city
    ): AmeexShipment {
        /*
         * Never create a second parcel for the same order.
         */
        $existingShipment = $order->ameexShipment;

        if ($existingShipment) {
            return $existingShipment;
        }

        $this->validateOrder($order, $city);

        $payload = $this->buildPayload(
            $order,
            $city
        );

        /*
         * AMEEX Create Parcel endpoint.
         *
         * AmeexClient uses asForm(), which has been
         * verified to work with this endpoint.
         */
        $response = $this->client->post(
            '/Delivery/Parcels/Action/Type/Add',
            $payload
        );

        /*
         * Expected successful response:
         *
         * {
         *     "api": {
         *         "type": "success",
         *         "msg": "Sandbox parcel created.",
         *         "data": {
         *             "code": "SBX-F6BEA9B2"
         *         }
         *     }
         * }
         */
        $this->ensureSuccessfulResponse($response);

        $parcelCode = $this->extractParcelCode(
            $response
        );

        if ($parcelCode === null) {
            throw new RuntimeException(
                'AMEEX parcel was created but no parcel code was returned.'
            );
        }

        /*
         * Save the local shipment only after AMEEX
         * successfully returned the parcel code.
         */
        return DB::transaction(
            function () use (
                $order,
                $city,
                $response,
                $parcelCode
            ): AmeexShipment {
                /*
                 * Double-check inside the transaction.
                 *
                 * This protects against two requests trying
                 * to create the shipment simultaneously.
                 */
                $existingShipment = AmeexShipment::query()
                    ->where('order_id', $order->id)
                    ->first();

                if ($existingShipment) {
                    return $existingShipment;
                }

                return AmeexShipment::create([
                    'order_id' => $order->id,

                    'ameex_city_record_id' => $city->id,

                    'parcel_code' => $parcelCode,

                    /*
                     * Create Parcel response currently does not
                     * provide these fields, so they remain null.
                     *
                     * They will be populated by tracking/webhooks.
                     */
                    'status' => $this->extractStatus($response),
                    'status_name' => $this->extractStatusName($response),
                    'status_color' => $this->extractStatusColor($response),

                    'sub_status' => $this->extractSubStatus($response),
                    'sub_status_name' => $this->extractSubStatusName($response),
                    'sub_status_color' => $this->extractSubStatusColor($response),

                    'comment' => $this->extractComment($response),

                    'sandbox' => $this->extractSandbox($response),
                ]);
            }
        );
    }

    /**
     * Validate order data before sending it to AMEEX.
     */
    private function validateOrder(
        Order $order,
        AmeexCity $city
    ): void {
        if (!$order->customer_name) {
            throw new RuntimeException(
                'Customer name is required before shipping.'
            );
        }

        if (!$order->customer_phone) {
            throw new RuntimeException(
                'Customer phone is required before shipping.'
            );
        }

        if (!$order->shipping_address) {
            throw new RuntimeException(
                'Shipping address is required before shipping.'
            );
        }

        if (!$city->active) {
            throw new RuntimeException(
                'The selected AMEEX city is not active.'
            );
        }

        if (!$city->ameex_id) {
            throw new RuntimeException(
                'The selected AMEEX city has no AMEEX ID.'
            );
        }

        $order->loadMissing('items');

        if ($order->items->isEmpty()) {
            throw new RuntimeException(
                'The order has no items.'
            );
        }
    }

    /**
     * Build AMEEX Create Parcel payload.
     */
    private function buildPayload(
        Order $order,
        AmeexCity $city
    ): array {
        $order->loadMissing('items.product');

        return [
            'type' => 'SIMPLE',

            'receiver' => $order->customer_name,

            'phone' => $order->customer_phone,

            /*
             * IMPORTANT:
             *
             * This is the AMEEX city ID,
             * NOT our local ameex_cities.id.
             */
            'city' => $city->ameex_id,

            /*
             * Cash:
             * AMEEX collects the order amount.
             *
             * Already paid:
             * nothing to collect.
             */
            'cod' => $this->codAmount($order),

            'address' => $order->shipping_address,

            'product' => $this->productDescription($order),

            /*
             * Our internal order number.
             */
            'order_num' => $order->order_number,
        ];
    }

    /**
     * Determine COD amount.
     */
    private function codAmount(Order $order): float
    {
        if ($order->payment_method !== 'cash') {
            return 0.0;
        }

        return round(
            (float) $order->total_amount,
            2
        );
    }

    /**
     * Build product description.
     */
    private function productDescription(
        Order $order
    ): string {
        return $order->items
            ->map(function ($item): string {
                $title = $item->product?->title
                    ?? 'Product';

                return "{$title} x {$item->quantity}";
            })
            ->implode(', ');
    }

    /**
     * Make sure AMEEX reports a successful operation.
     */
    private function ensureSuccessfulResponse(
        array $response
    ): void {
        $type = $response['api']['type'] ?? null;

        if ($type !== 'success') {
            $message =
                $response['api']['msg']
                ?? 'Unknown AMEEX error.';

            throw new RuntimeException(
                "AMEEX parcel creation failed: {$message}"
            );
        }
    }

    /**
     * Extract the real AMEEX parcel code.
     *
     * Verified response:
     *
     * api.data.code
     */
    private function extractParcelCode(
        array $response
    ): ?string {
        $value = $response['api']['data']['code']
            ?? null;

        if ($value === null) {
            return null;
        }

        $value = trim((string) $value);

        return $value !== ''
            ? $value
            : null;
    }

    private function extractStatus(
        array $response
    ): ?string {
        return $this->nullableString(
            $response['api']['status']
                ?? null
        );
    }

    private function extractStatusName(
        array $response
    ): ?string {
        return $this->nullableString(
            $response['api']['status_name']
                ?? null
        );
    }

    private function extractStatusColor(
        array $response
    ): ?string {
        return $this->nullableString(
            $response['api']['status_color']
                ?? null
        );
    }

    private function extractSubStatus(
        array $response
    ): ?string {
        return $this->nullableString(
            $response['api']['sub_status']
                ?? null
        );
    }

    private function extractSubStatusName(
        array $response
    ): ?string {
        return $this->nullableString(
            $response['api']['sub_status_name']
                ?? null
        );
    }

    private function extractSubStatusColor(
        array $response
    ): ?string {
        return $this->nullableString(
            $response['api']['sub_status_color']
                ?? null
        );
    }

    private function extractComment(
        array $response
    ): ?string {
        return $this->nullableString(
            $response['api']['msg']
                ?? null
        );
    }

    private function extractSandbox(
        array $response
    ): bool {
        return (bool) (
            $response['sandbox']
            ?? $response['api']['sandbox']
            ?? false
        );
    }

    private function nullableString(
        mixed $value
    ): ?string {
        if (
            !is_string($value)
            && !is_numeric($value)
        ) {
            return null;
        }

        $value = trim((string) $value);

        return $value !== ''
            ? $value
            : null;
    }
}

