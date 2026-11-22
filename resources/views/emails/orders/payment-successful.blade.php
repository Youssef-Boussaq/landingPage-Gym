@extends('emails.orders.layout')

@section('title', 'Paiement Confirmé - Fit Youness')
@section('heading', 'Paiement confirmé avec succès')

@section('content')
    <p style="margin-top: 0; font-size: 15px;">
        Bonjour <strong>{{ $order->customer_name }}</strong>,
    </p>

    <p style="color: #444444;">
        Nous avons le plaisir de vous confirmer la bonne réception de votre paiement pour la commande 
        <strong style="color: #000000;">{{ $order->order_number }}</strong>.
    </p>

    {{-- DIGITAL PRODUCTS INSTANT ACCESS SECTION --}}
    @php
        $digitalItems = $order->items->filter(fn($item) => $item->product && $item->product->type?->value === 'digital');
    @endphp

    @if($digitalItems->isNotEmpty())
        <div style="margin: 28px 0; padding: 20px; background-color: #f0efe7; border: 2px solid #000000;">
            <p style="margin: 0 0 12px 0; font-size: 12px; font-weight: 900; letter-spacing: 0.08em; text-transform: uppercase; color: #000000;">
                ⚡ Vos Accès & Téléchargements Numériques Immédiats :
            </p>
            <p style="margin: 0 0 16px 0; font-size: 13px; color: #555555;">
                Cliquez ci-dessous pour télécharger vos fichiers ou accéder directement à votre programme en ligne :
            </p>

            @foreach($digitalItems as $item)
                <div style="margin-bottom: 14px; padding-bottom: 14px; border-bottom: 1px solid #d1d5db;">
                    <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 700; color: #000000;">
                        {{ $item->product->title }}
                    </p>

                    <div style="margin-top: 6px;">
                        @if($item->product->digital_file_path)
                            <a href="{{ route('orders.download', ['order' => $order->id, 'product' => $item->product->id]) }}"
                               style="display: inline-block; padding: 10px 20px; background-color: #000000; color: #ffffff; text-decoration: none; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; margin-right: 8px;">
                                Télécharger le fichier
                            </a>
                        @endif

                        @if($item->product->digital_download_link)
                            <a href="{{ $item->product->digital_download_link }}" target="_blank"
                               style="display: inline-block; padding: 9px 18px; border: 1px solid #000000; background-color: #ffffff; color: #000000; text-decoration: none; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;">
                                Accéder en ligne →
                            </a>
                        @endif
                    </div>
                </div>
            @endforeach
        </div>
    @endif

    {{-- ORDER SUMMARY TABLE --}}
    <div style="margin: 28px 0;">
        <h3 style="margin: 0 0 12px 0; font-size: 12px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #000000;">
            Récapitulatif de votre commande :
        </h3>

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
                    <td colspan="2" style="padding: 10px; text-align: right; font-weight: 700; text-transform: uppercase; font-size: 11px;">Frais de livraison :</td>
                    <td style="padding: 10px; text-align: right; font-weight: 600;">
                        {{ $order->shipping_fee > 0 ? number_format($order->shipping_fee, 2) . ' MAD' : 'Offerte' }}
                    </td>
                </tr>
                <tr style="background-color: #f9fafb; border-top: 2px solid #000000;">
                    <td colspan="2" style="padding: 12px 10px; text-align: right; font-weight: 900; text-transform: uppercase; font-size: 12px;">Total Payé :</td>
                    <td style="padding: 12px 10px; text-align: right; font-weight: 900; font-size: 15px; color: #000000;">
                        {{ number_format($order->total_amount, 2) }} MAD
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>
@endsection
