@extends('emails.orders.layout')

@section('title', 'Échec du paiement')
@section('heading', 'Échec du paiement')

@section('content')
    <p>Bonjour {{ $order->customer_name }},</p>
    <p>
        Le paiement de votre commande
        <strong>{{ $order->order_number }}</strong>
        a échoué.
    </p>
    <p>Vous pouvez réessayer le paiement depuis votre commande.</p>
@endsection
