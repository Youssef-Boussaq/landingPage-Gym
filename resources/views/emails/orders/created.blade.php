<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Commande créée</title>
</head>

<body>
    <h1>Commande créée</h1>

    <p>
        Bonjour {{ $order->customer_name }},
    </p>

    <p>
        Votre commande
        <strong>{{ $order->order_number }}</strong>
        a été créée avec succès.
    </p>

    <p>
        Total :
        <strong>{{ $order->total_amount }} MAD</strong>
    </p>

    <p>
        Merci pour votre commande.
    </p>
</body>
</html>