@extends('emails.orders.layout')

@section('title', 'Commande Expédiée - Fit Youness')
@section('heading', 'Votre commande est en route !')

@section('content')
    <p style="margin-top: 0; font-size: 15px;">
        Bonjour <strong>{{ $order->customer_name }}</strong>,
    </p>

    <p style="color: #444444;">
        Bonne nouvelle ! Votre commande <strong style="color: #000000;">{{ $order->order_number }}</strong> a été expédiée avec soin par l'équipe Fit Youness.
    </p>

    <div style="margin: 20px 0; padding: 16px; background-color: #f8fafc; border-left: 4px solid #000000;">
        <p style="margin: 0; font-size: 13px; font-weight: 700; color: #000000;">
            Adresse de livraison :
        </p>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: #555555;">
            {{ $order->shipping_address }}, {{ $order->city }}
        </p>
    </div>

    <p style="color: #555555; font-size: 13px;">
        Le livreur prendra contact avec vous sur votre numéro de téléphone (<strong>{{ $order->customer_phone }}</strong>) avant la livraison.
    </p>
@endsection
