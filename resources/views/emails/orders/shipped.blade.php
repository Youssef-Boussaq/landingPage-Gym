@extends('emails.orders.layout')

@section('title', 'Commande expédiée')
@section('heading', 'Commande expédiée')

@section('content')
    <p>Bonjour {{ $order->customer_name }},</p>
    <p>
        Votre commande
        <strong>{{ $order->order_number }}</strong>
        a été expédiée.
    </p>
@endsection
