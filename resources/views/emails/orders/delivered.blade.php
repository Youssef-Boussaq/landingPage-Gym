@extends('emails.orders.layout')

@section('title', 'Commande livrée')
@section('heading', 'Commande livrée')

@section('content')
    <p>Bonjour {{ $order->customer_name }},</p>
    <p>
        Votre commande
        <strong>{{ $order->order_number }}</strong>
        a été livrée.
    </p>
@endsection
