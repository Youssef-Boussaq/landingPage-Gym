@extends('emails.orders.layout')

@section('title', 'Commande Livrée - Fit Youness')
@section('heading', 'Votre commande a été livrée')

@section('content')
    <p style="margin-top: 0; font-size: 15px;">
        Bonjour <strong>{{ $order->customer_name }}</strong>,
    </p>

    <p style="color: #444444;">
        Votre commande <strong style="color: #000000;">{{ $order->order_number }}</strong> a bien été livrée.
    </p>

    <p style="color: #444444;">
        Nous espérons que vos articles et programmes répondent pleinement à vos attentes. N'hésitez pas à laisser votre avis sur la boutique pour partager votre expérience !
    </p>

    <div style="margin: 24px 0;">
        <a href="{{ route('store.index') }}"
           style="display: inline-block; padding: 12px 24px; background-color: #000000; color: #ffffff; text-decoration: none; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;">
            Découvrir d'autres programmes →
        </a>
    </div>
@endsection
