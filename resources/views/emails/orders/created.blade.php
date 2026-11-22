@extends('emails.orders.layout')

@section('title', 'Confirmation de commande - Fit Youness')
@section('heading', 'Commande reçue avec succès')

@section('content')
    <p style="margin-top: 0; font-size: 15px;">
        Bonjour <strong>{{ $order->customer_name }}</strong>,
    </p>

    <p style="color: #444444;">
        Nous vous remercions pour votre commande 
        <strong style="color: #000000;">{{ $order->order_number }}</strong> passée sur Fit Youness.
    </p>

    <div style="margin: 20px 0; padding: 14px 18px; background-color: #f8fafc; border-left: 4px solid #000000;">
        <p style="margin: 0; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #000000;">
            Statut : {{ $order->payment_method === 'cash' ? 'En attente de paiement à la livraison' : 'Traitement du paiement en cours' }}
        </p>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #666666;">
            Mode de règlement : {{ $order->payment_method === 'stripe' ? 'Carte bancaire en ligne' : 'Paiement à la livraison' }}
        </p>
    </div>

    {{-- ORDER SUMMARY TABLE --}}
    <div style="margin: 24px 0;">
        <table width="100%" border="0" cellpadding="8" cellspacing="0" style="border-collapse: collapse; border: 1px solid #e5e7eb; font-size: 13px;">
            <thead>
                <tr style="background-color: #f9fafb; border-bottom: 1px solid #e5e7eb; text-align: left;">
                    <th style="padding: 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em;">Article</th>
                    <th style="padding: 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; text-align: center;">Qté</th>
                    <th style="padding: 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; text-align: right;">Prix</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->items as $item)
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                        <td style="padding: 10px; font-weight: 600;">{{ $item->product->title ?? 'Produit' }}</td>
                        <td style="padding: 10px; text-align: center;">{{ $item->quantity }}</td>
                        <td style="padding: 10px; text-align: right; font-weight: 600;">
                            {{ number_format($item->quantity * $item->unit_price, 2) }} MAD
                        </td>
                    </tr>
                @endforeach
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="2" style="padding: 10px; text-align: right; font-weight: 700; text-transform: uppercase; font-size: 11px;">Frais de port :</td>
                    <td style="padding: 10px; text-align: right; font-weight: 600;">
                        {{ $order->shipping_fee > 0 ? number_format($order->shipping_fee, 2) . ' MAD' : 'Offerte' }}
                    </td>
                </tr>
                <tr style="background-color: #f9fafb; border-top: 2px solid #000000;">
                    <td colspan="2" style="padding: 12px 10px; text-align: right; font-weight: 900; text-transform: uppercase; font-size: 12px;">Montant Total :</td>
                    <td style="padding: 12px 10px; text-align: right; font-weight: 900; font-size: 15px; color: #000000;">
                        {{ number_format($order->total_amount, 2) }} MAD
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>

    @if($order->shipping_address)
        <div style="margin-top: 20px; font-size: 12px; color: #555555;">
            <p style="margin: 0; font-weight: 700; text-transform: uppercase; color: #000000;">Adresse de livraison renseignée :</p>
            <p style="margin: 4px 0 0 0;">{{ $order->shipping_address }}, {{ $order->city }}</p>
        </div>
    @endif
@endsection
