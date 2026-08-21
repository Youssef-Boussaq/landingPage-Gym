@extends('emails.orders.layout')

@section('title', 'Paiement réussi')
@section('heading', 'Paiement réussi')

@section('content')
    <p>Bonjour {{ $order->customer_name }},</p>
    <p>
        Le paiement de votre commande
        <strong>{{ $order->order_number }}</strong>
        a été confirmé.
    </p>
    <p>
        Total :
        <strong>{{ $order->total_amount }} MAD</strong>
    </p>
@endsection
