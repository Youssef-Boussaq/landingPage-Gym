@extends('emails.orders.layout')

@section('title', 'Commande Annulée - Fit Youness')
@section('heading', 'Annulation de votre commande')

@section('content')
    <p style="margin-top: 0; font-size: 15px;">
        Bonjour <strong>{{ $order->customer_name }}</strong>,
    </p>

    <p style="color: #444444;">
        Nous vous informons que votre commande <strong style="color: #000000;">{{ $order->order_number }}</strong> a été annulée.
    </p>

    <p style="color: #666666; font-size: 13px;">
        Si vous n'êtes pas à l'origine de cette annulation ou si vous souhaitez renouveler votre commande, notre équipe reste à votre écoute pour vous accompagner.
    </p>
@endsection
