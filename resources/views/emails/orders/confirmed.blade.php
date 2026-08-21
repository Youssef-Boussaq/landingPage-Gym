@extends('emails.orders.layout')

@section('title', 'Commande confirmée')
@section('heading', 'Commande confirmée')

@section('content')
    <p>Bonjour {{ $order->customer_name }},</p>
    <p>
        Votre commande
        <strong>{{ $order->order_number }}</strong>
        a été confirmée.
    </p>
    <p>Nous préparons votre colis.</p>
@endsection
