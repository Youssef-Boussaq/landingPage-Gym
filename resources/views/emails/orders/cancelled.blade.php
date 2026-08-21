@extends('emails.orders.layout')

@section('title', 'Commande annulée')
@section('heading', 'Commande annulée')

@section('content')
    <p>Bonjour {{ $order->customer_name }},</p>
    <p>
        Votre commande
        <strong>{{ $order->order_number }}</strong>
        a été annulée.
    </p>
@endsection
