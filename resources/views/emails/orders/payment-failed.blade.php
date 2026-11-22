@extends('emails.orders.layout')

@section('title', 'Paiement Non Abouti - Fit Youness')
@section('heading', 'Information concernant votre paiement')

@section('content')
    <p style="margin-top: 0; font-size: 15px;">
        Bonjour <strong>{{ $order->customer_name }}</strong>,
    </p>

    <p style="color: #444444;">
        La tentative de paiement pour votre commande <strong style="color: #000000;">{{ $order->order_number }}</strong> n'a pas pu aboutir.
    </p>

    <div style="margin: 20px 0; padding: 16px; background-color: #fff1f2; border-left: 4px solid #e11d48;">
        <p style="margin: 0; font-size: 13px; font-weight: 700; color: #9f1239;">
            Aucun montant n'a été prélevé sur votre compte.
        </p>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #be123c;">
            Veuillez vérifier les informations de votre carte bancaire ou choisir un autre moyen de paiement.
        </p>
    </div>

    <div style="margin: 24px 0;">
        <a href="{{ route('checkout.index') }}"
           style="display: inline-block; padding: 12px 24px; background-color: #000000; color: #ffffff; text-decoration: none; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;">
            Réessayer mon paiement →
        </a>
    </div>
@endsection
