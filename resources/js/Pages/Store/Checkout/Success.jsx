import { Link } from '@inertiajs/react';
import {
    CheckCircle,
    Package,
    ArrowRight,
    LoaderCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Success({ order, paymentPending = false }) {
    const [isPaid, setIsPaid] = useState(!paymentPending);

    useEffect(() => {
        if (!paymentPending) {
            return;
        }

        let attempts = 0;
        const maxAttempts = 30;

        const checkPayment = async () => {
            try {
                const response = await fetch(
                    `/checkout/success/${order.id}/status`,
                    {
                        headers: {
                            Accept: 'application/json',
                        },
                        credentials: 'same-origin',
                    }
                );

                if (!response.ok) {
                    return;
                }

                const data = await response.json();

                if (data.paid) {
                    setIsPaid(true);

                    // Reload page once so Laravel returns
                    // the final confirmed state.
                    window.location.reload();

                    return;
                }

                attempts++;

                if (attempts >= maxAttempts) {
                    clearInterval(interval);
                }
            } catch (error) {
                console.error(
                    'Payment status check failed:',
                    error
                );
            }
        };

        checkPayment();

        const interval = setInterval(checkPayment, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [paymentPending, order.id]);

    /*
    |--------------------------------------------------------------------------
    | Waiting for Stripe webhook
    |--------------------------------------------------------------------------
    */

    if (!isPaid) {
        return (
            <div className="min-h-screen bg-gray-50 py-20">
                <div className="mx-auto max-w-xl px-4 text-center">

                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                        <LoaderCircle className="h-8 w-8 animate-spin text-yellow-600" />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900">
                        Paiement en cours de confirmation
                    </h1>

                    <p className="mt-3 text-gray-600">
                        Votre paiement a été reçu par Stripe.
                        Nous attendons encore la confirmation finale.
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                        Commande #{order.order_number}
                    </p>

                </div>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Confirmed
    |--------------------------------------------------------------------------
    */

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="mx-auto max-w-4xl px-4">

                <div className="mb-8 text-center">

                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle className="h-9 w-9 text-green-600" />
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900">
                        Commande confirmée !
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Merci pour votre commande.
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        Commande #{order.order_number}
                    </p>

                </div>

                <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

                    <div className="border-b px-6 py-5">

                        <div className="flex items-center gap-3">
                            <Package className="h-6 w-6 text-gray-700" />

                            <div>
                                <h2 className="font-semibold text-gray-900">
                                    Votre commande
                                </h2>

                                <p className="text-sm text-gray-500">
                                    #{order.order_number}
                                </p>
                            </div>
                        </div>

                    </div>

                    <div className="divide-y">

                        {order.items.map((item) => {

                            const product = item.product;

                            const image =
                                product?.primary_image?.path ?? null;

                            return (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-4 p-6"
                                >

                                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">

                                        {image ? (
                                            <img
                                                src={
                                                    image.startsWith(
                                                        '/storage/'
                                                    )
                                                        ? image
                                                        : `/storage/${image}`
                                                }
                                                alt={product?.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-xs text-gray-400">
                                                No image
                                            </div>
                                        )}

                                    </div>

                                    <div className="min-w-0 flex-1">

                                        <h3 className="font-medium text-gray-900">
                                            {product?.title}
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Quantité : {item.quantity}
                                        </p>

                                    </div>

                                    <div className="text-right">

                                        <p className="font-semibold text-gray-900">
                                            {(
                                                Number(item.unit_price) *
                                                item.quantity
                                            ).toFixed(2)}{' '}
                                            MAD
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            {Number(item.unit_price).toFixed(2)}{' '}
                                            MAD / unité
                                        </p>

                                    </div>

                                </div>
                            );
                        })}

                    </div>

                    <div className="border-t bg-gray-50 px-6 py-5">

                        <div className="flex items-center justify-between">

                            <span className="font-medium text-gray-600">
                                Total
                            </span>

                            <span className="text-2xl font-bold text-gray-900">
                                {Number(order.total_amount).toFixed(2)} MAD
                            </span>

                        </div>

                    </div>

                </div>

                <div className="mt-8 flex justify-center">

                    <Link
                        href="/store"
                        className="inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
                    >
                        Continuer mes achats

                        <ArrowRight className="h-4 w-4" />
                    </Link>

                </div>

            </div>
        </div>
    );
}