<?php

namespace App\Support;

use App\Models\Order;
use Illuminate\Support\Collection;

class AdminOrderPresenter
{
    public static function getStatusLabel(?string $status): string
    {
        return match ($status) {
            'pending' => 'En attente',
            'paid' => 'Payée',
            'confirmed' => 'Confirmée',
            'processing' => 'En préparation',
            'shipped' => 'Expédiée',
            'out_for_delivery' => 'En livraison',
            'delivered' => 'Terminée',
            'returned' => 'Retournée',
            'cancelled' => 'Annulée',
            default => $status ?? 'Inconnu',
        };
    }

    public static function getPaymentStatusLabel(?string $status): string
    {
        return match ($status) {
            'pending' => 'En attente',
            'paid' => 'Payé',
            'failed' => 'Échoué',
            default => $status ?? 'Inconnu',
        };
    }

    public static function listItem(Order $order): array
    {
        $isClient = $order->user_id !== null;

        return [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'customer_name' => $order->customer_name,
            'customer_email' => $order->customer_email,
            'customer_type' => $isClient ? 'client' : 'guest',
            'customer_type_label' => $isClient ? 'Client' : 'Guest customer',
            'total_amount' => $order->total_amount,
            'payment_method' => $order->payment_method,
            'payment_status' => $order->payment_status?->value,
            'payment_status_label' => self::getPaymentStatusLabel($order->payment_status?->value),
            'status' => $order->status?->value,
            'status_label' => self::getStatusLabel($order->status?->value),
            'created_at' => $order->created_at?->toIso8601String(),
        ];
    }

    public static function detail(Order $order): array
    {
        $isClient = $order->user_id !== null;
        $subtotal = $order->total_amount - $order->shipping_fee;

        return [
            'id' => $order->id,
            'order_number' => $order->order_number,
            
            'created_at' => $order->created_at?->toIso8601String(),
            'updated_at' => $order->updated_at?->toIso8601String(),
            
            'status' => $order->status?->value,
            'status_label' => self::getStatusLabel($order->status?->value),
            
            'payment_status' => $order->payment_status?->value,
            'payment_status_label' => self::getPaymentStatusLabel($order->payment_status?->value),
            'payment_method' => $order->payment_method,
            'transaction_id' => $order->transaction_id,
            
            'customer' => [
                'name' => $order->customer_name,
                'email' => $order->customer_email,
                'phone' => $order->customer_phone,
                'type' => $isClient ? 'client' : 'guest',
                'type_label' => $isClient ? 'Client régulier' : 'Client invité',
                'user_id' => $order->user_id,
            ],
            
            'shipping' => [
                'address' => $order->shipping_address,
                'city' => $order->city,
                'postal_code' => $order->postal_code,
            ],
            'ameex_shipment' => $order->ameexShipment ? [
    'id' => $order->ameexShipment->id,
    'parcel_code' => $order->ameexShipment->parcel_code,
    'status' => $order->ameexShipment->status,
    'status_name' => $order->ameexShipment->status_name,
    'status_color' => $order->ameexShipment->status_color,
    'sub_status' => $order->ameexShipment->sub_status,
    'sub_status_name' => $order->ameexShipment->sub_status_name,
    'sub_status_color' => $order->ameexShipment->sub_status_color,
    'comment' => $order->ameexShipment->comment,
    'sandbox' => (bool) $order->ameexShipment->sandbox,
] : null,
            
            'items' => $order->items->map(function ($item) {
                $product = $item->product;
                return [
                    'id' => $item->id,
                    'quantity' => $item->quantity,
                    'unit_price' => (float) $item->unit_price,
                    'subtotal' => (float) $item->unit_price * (int) $item->quantity,
                    'product' => $product ? [
                        'id' => $product->id,
                        'title' => $product->title,
                        'image' => $product->primaryImage?->url,
                    ] : [
                        'id' => $item->product_id,
                        'title' => 'Produit supprimé',
                        'image' => null,
                    ],
                ];
            })->values(),
            
            'summary' => [
                'subtotal' => (float) $subtotal,
                'shipping_fee' => (float) $order->shipping_fee,
                'total' => (float) $order->total_amount,
            ],
            
            'attribution' => $order->attribution ? [
                'utm_source' => $order->attribution->utm_source,
                'utm_medium' => $order->attribution->utm_medium,
                'utm_campaign' => $order->attribution->utm_campaign,
                'utm_content' => $order->attribution->utm_content,
                'fbclid' => $order->attribution->fbclid,
                'gclid' => $order->attribution->gclid,
                'referer_url' => $order->attribution->referer_url,
            ] : null,
            
            'timeline' => OrderTimeline::for($order),
            
            'allowed_statuses' => collect(OrderStatusTransition::allowedFrom($order->status))
                ->map(fn ($status) => $status->value)
                ->values(),
            
            // Helpful flags for UI
            'is_cash' => $order->payment_method === 'cash',
        ];
    }

    /**
     * @param  Collection<int, Order>  $orders
     * @return Collection<int, array<string, mixed>>
     */
    public static function collection(Collection $orders): Collection
    {
        return $orders->map(fn (Order $order) => self::listItem($order));
    }
}

