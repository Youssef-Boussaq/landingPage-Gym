import { Link } from '@inertiajs/react';
import {
    CheckCircle,
    Package,
    ArrowRight,
    LoaderCircle,
    Download,
    ExternalLink,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Success({ order, paymentPending = false }) {
    const [isPaid, setIsPaid] = useState(!paymentPending);

    const digitalItems = (order.items || []).filter(
        (item) => item.product?.type === 'digital'
    );
    const hasDigitalItems = digitalItems.length > 0;

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
            <div className="min-h-screen bg-[#f0efe7] py-20 font-favorit">
                <div className="mx-auto max-w-lg px-4 text-center">

                    <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-[4px] border border-[#000000] bg-white">
                        <LoaderCircle className="h-6 w-6 animate-spin text-[#000000]" strokeWidth={1.5} />
                    </div>

                    <h1 className="text-2xl font-normal uppercase tracking-[0.025em] text-[#000000]">
                        Paiement en cours de validation
                    </h1>

                    <p className="mt-3 text-[13px] text-[#666666] leading-relaxed">
                        Votre transaction a été transmise à Stripe.
                        Veuillez patienter quelques instants pendant la confirmation...
                    </p>

                    <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.05em] text-[#999999]">
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
        <div className="min-h-screen bg-[#f0efe7] py-16 font-favorit">
            <div className="mx-auto max-w-3xl px-4 sm:px-6">

                {/* Header */}
                <div className="mb-10 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[4px] border border-[#000000] bg-white">
                        <CheckCircle className="h-7 w-7 text-[#000000]" strokeWidth={1.5} />
                    </div>

                    <h1 className="text-3xl font-normal uppercase tracking-[0.025em] text-[#000000]">
                        Commande confirmée
                    </h1>

                    <p className="mt-2 text-[14px] text-[#666666] tracking-[0.025em]">
                        Merci pour votre confiance. Votre commande est validée.
                    </p>

                    <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.05em] text-[#999999]">
                        Numéro : #{order.order_number}
                    </p>
                </div>

                {/* Digital Download Direct Section */}
                {hasDigitalItems && (
                    <div className="mb-8 border-2 border-[#000000] bg-white p-6 rounded-none">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-[4px] bg-[#000000] text-white">
                                <Download size={13} strokeWidth={2} />
                            </span>
                            <h2 className="text-[14px] font-bold uppercase tracking-[0.025em] text-[#000000]">
                                Vos accès & téléchargements numériques
                            </h2>
                        </div>

                        <p className="text-[13px] text-[#666666] mb-5 leading-relaxed">
                            Vos produits numériques sont immédiatement disponibles. Cliquez ci-dessous pour lancer le téléchargement ou ouvrir votre contenu :
                        </p>

                        <div className="space-y-3">
                            {digitalItems.map((item) => {
                                const product = item.product;
                                const isExternal = Boolean(product?.digital_download_link);

                                return (
                                    <div
                                        key={item.id}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#e5e7eb] bg-[#f0efe7] p-4 rounded-none"
                                    >
                                        <div>
                                            <p className="text-[14px] font-bold uppercase tracking-[0.025em] text-[#000000]">
                                                {product?.title}
                                            </p>
                                            <p className="text-[12px] text-[#666666] mt-0.5">
                                                {product?.digital_file_name || 'Accès immédiat débloqué'}
                                                {product?.formatted_file_size && ` • ${product.formatted_file_size}`}
                                            </p>
                                        </div>

                                        {isExternal ? (
                                            <a
                                                href={product.digital_download_link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="filled-action-btn inline-flex items-center justify-center gap-2 py-2.5 px-5 text-[12px] font-medium uppercase tracking-[0.025em]"
                                            >
                                                <span>Accéder au contenu</span>
                                                <ExternalLink size={13} strokeWidth={1.5} />
                                            </a>
                                        ) : (
                                            <a
                                                href={route('orders.download', { order: order.id, product: item.product_id })}
                                                className="filled-action-btn inline-flex items-center justify-center gap-2 py-2.5 px-5 text-[12px] font-medium uppercase tracking-[0.025em]"
                                            >
                                                <span>Télécharger le fichier</span>
                                                <Download size={13} strokeWidth={1.5} />
                                            </a>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Order Summary Card */}
                <div className="border border-[#e5e7eb] bg-white rounded-none">
                    <div className="border-b border-[#e5e7eb] px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <Package className="h-5 w-5 text-[#000000]" strokeWidth={1.5} />
                            <h2 className="text-[13px] font-bold uppercase tracking-[0.025em] text-[#000000]">
                                Récapitulatif de commande
                            </h2>
                        </div>
                        <span className="text-[11px] font-medium text-[#999999] uppercase tracking-[0.05em]">
                            {order.items?.length || 0} article(s)
                        </span>
                    </div>

                    <div className="divide-y divide-[#e5e7eb]">
                        {order.items.map((item) => {
                            const product = item.product;
                            const image = product?.primary_image?.path ?? null;

                            return (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-4 p-6"
                                >
                                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-none border border-[#e5e7eb] bg-[#f0efe7]">
                                        {image ? (
                                            <img
                                                src={
                                                    image.startsWith('/storage/')
                                                        ? image
                                                        : `/storage/${image}`
                                                }
                                                alt={product?.title}
                                                className="h-full w-full object-contain"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-xs text-[#999999]">
                                                No image
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-[13px] font-medium uppercase tracking-[0.025em] text-[#000000]">
                                            {product?.title}
                                        </h3>
                                        <p className="mt-0.5 text-[12px] text-[#666666]">
                                            Quantité : {item.quantity}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-[13px] font-medium text-[#000000]">
                                            {(Number(item.unit_price) * item.quantity).toFixed(2)} DH
                                        </p>
                                        <p className="text-[11px] text-[#999999]">
                                            {Number(item.unit_price).toFixed(2)} DH / u
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="border-t border-[#e5e7eb] bg-[#f0efe7] px-6 py-4">
                        <div className="flex items-center justify-between text-[13px]">
                            <span className="text-[#666666] uppercase tracking-[0.025em]">Frais de livraison</span>
                            <span className="font-medium text-[#000000]">
                                {Number(order.shipping_fee) === 0 ? 'Gratuit' : `${Number(order.shipping_fee).toFixed(2)} DH`}
                            </span>
                        </div>
                        <div className="mt-2 pt-2 border-t border-[#e5e7eb] flex items-center justify-between">
                            <span className="text-[14px] font-bold uppercase tracking-[0.025em] text-[#000000]">
                                Total payé
                            </span>
                            <span className="text-xl font-bold text-[#000000]">
                                {Number(order.total_amount).toFixed(2)} DH
                            </span>
                        </div>
                    </div>
                </div>

                {/* Continue button */}
                <div className="mt-8 flex justify-center">
                    <Link
                        href="/store"
                        className="filled-action-btn inline-flex items-center gap-2 px-8 py-3.5 text-[12px] font-medium uppercase tracking-[0.025em]"
                    >
                        <span>Continuer mes achats</span>
                        <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </Link>
                </div>

            </div>
        </div>
    );
}