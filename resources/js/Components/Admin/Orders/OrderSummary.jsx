
import { ReceiptText, Truck } from 'lucide-react';
import { formatMoney } from '@/helpers/format';

export default function OrderSummary({ summary }) {
    const hasFreeShipping = summary.shipping_fee <= 0;

    return (
        <section
            className="
                rounded-2xl
                border border-black/[0.08]
                bg-white
                p-5
                shadow-[0_10px_35px_rgba(11,12,14,0.06)]
            "
        >
            {/* Header */}
            <div className="mb-5 flex items-center gap-3">
                <div
                    className="
                        flex h-10 w-10
                        items-center justify-center
                        rounded-xl
                        bg-[var(--color-primary)]/15
                        text-[var(--color-primary-dark)]
                    "
                >
                    <ReceiptText
                        size={19}
                        strokeWidth={2.2}
                    />
                </div>

                <div>
                    <h2
                        className="
                            font-archivo
                            text-sm
                            uppercase
                            tracking-wide
                            text-[var(--color-black)]
                        "
                    >
                        Résumé
                    </h2>

                    <p className="text-xs text-[#596254]">
                        Détail du montant de la commande
                    </p>
                </div>
            </div>

            {/* Summary */}
            <dl className="space-y-1">
                {/* Subtotal */}
                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-4
                        rounded-xl
                        px-3
                        py-3
                        transition-colors
                        hover:bg-[#f8faf5]
                    "
                >
                    <dt className="text-sm text-[#596254]">
                        Sous-total
                    </dt>

                    <dd className="text-sm font-bold text-[var(--color-black)]">
                        {formatMoney(summary.subtotal)}
                    </dd>
                </div>

                {/* Shipping */}
                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-4
                        rounded-xl
                        px-3
                        py-3
                        transition-colors
                        hover:bg-[#f8faf5]
                    "
                >
                    <dt className="flex items-center gap-2 text-sm text-[#596254]">
                        <Truck
                            size={15}
                            strokeWidth={2.1}
                            className="text-[var(--color-primary-dark)]"
                        />
                        Frais de livraison
                    </dt>

                    <dd>
                        {hasFreeShipping ? (
                            <span
                                className="
                                    inline-flex
                                    items-center
                                    rounded-full
                                    border
                                    border-[var(--color-primary-dark)]/25
                                    bg-[var(--color-primary)]/10
                                    px-2.5
                                    py-1
                                    text-xs
                                    font-bold
                                    text-[#547900]
                                "
                            >
                                Gratuit
                            </span>
                        ) : (
                            <span className="text-sm font-bold text-[var(--color-black)]">
                                {formatMoney(summary.shipping_fee)}
                            </span>
                        )}
                    </dd>
                </div>

                {/* Total */}
                <div
                    className="
                        mt-3
                        flex
                        items-center
                        justify-between
                        gap-4
                        rounded-xl
                        border
                        border-[var(--color-primary-dark)]/20
                        bg-[var(--color-primary)]/10
                        px-4
                        py-4
                    "
                >
                    <dt
                        className="
                            font-archivo
                            text-sm
                            uppercase
                            tracking-wide
                            text-[var(--color-black)]
                        "
                    >
                        Total
                    </dt>

                    <dd
                        className="
                            font-archivo
                            text-xl
                            tracking-tight
                            text-[var(--color-black)]
                        "
                    >
                        {formatMoney(summary.total)}
                    </dd>
                </div>
            </dl>
        </section>
    );
}

