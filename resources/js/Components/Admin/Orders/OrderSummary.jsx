import {
    CircleCheck,
    ReceiptText,
    Truck,
} from 'lucide-react';

function formatPrice(value) {
    return new Intl.NumberFormat('fr-MA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(value || 0));
}

export default function OrderSummary({ summary }) {
    const subtotal = Number(summary?.subtotal || 0);
    const shippingFee = Number(summary?.shipping_fee || 0);
    const total = Number(summary?.total || 0);

    const isFreeShipping = shippingFee === 0;

    return (
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {/* Header */}
            <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                        <ReceiptText className="h-5 w-5" />
                    </div>

                    <div>
                        <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                            Récapitulatif
                        </h2>

                        <p className="mt-0.5 text-xs text-slate-500">
                            Résumé financier de la commande
                        </p>
                    </div>
                </div>
            </div>

            {/* Amounts */}
            <div className="p-5 sm:p-6">
                <div className="space-y-4">
                    {/* Subtotal */}
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-slate-500">
                            Sous-total
                        </span>

                        <span className="text-sm font-bold text-slate-800">
                            {formatPrice(subtotal)} DH
                        </span>
                    </div>

                    {/* Shipping */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-slate-400" />

                            <span className="text-sm text-slate-500">
                                Livraison
                            </span>
                        </div>

                        {isFreeShipping ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600">
                                <CircleCheck className="h-3.5 w-3.5" />
                                Gratuite
                            </span>
                        ) : (
                            <span className="text-sm font-bold text-slate-800">
                                {formatPrice(shippingFee)} DH
                            </span>
                        )}
                    </div>
                </div>

                {/* Divider */}
                <div className="my-5 border-t border-dashed border-slate-200" />

                {/* Total */}
                <div className="rounded-2xl border border-[#9de500]/20 bg-[#9de500]/5 p-4">
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                                Total
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Montant final de la commande
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="text-2xl font-black tracking-tight text-slate-900">
                                {formatPrice(total)}
                                <span className="ml-1 text-sm font-bold text-slate-500">
                                    DH
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Shipping info */}
                <div className="mt-4 flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">
                        <Truck className="h-4 w-4" />
                    </div>

                    <div>
                        <p className="text-xs font-bold text-slate-700">
                            Livraison
                        </p>

                        <p className="mt-0.5 text-[11px] leading-5 text-slate-500">
                            {isFreeShipping
                                ? 'Livraison offerte pour cette commande.'
                                : 'Frais de livraison appliqués à cette commande.'}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}