@extends('emails.orders.layout')

@section('title', 'Commande créée')
@section('heading', 'Commande créée')

@section('content')
    <p>Bonjour {{ $order->customer_name }},</p>
    <p>
        Votre commande
        <strong>{{ $order->order_number }}</strong>
        a été créée avec succès.
    </p>
    <p>
        Total :
        <strong>{{ $order->total_amount }} MAD</strong>
    </p>
@endsection
