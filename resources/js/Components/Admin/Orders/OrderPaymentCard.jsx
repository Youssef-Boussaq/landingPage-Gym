
import {
    Banknote,
    CreditCard,
    Info,
    ReceiptText,
} from 'lucide-react';

import AdminStatusBadge from '@/Components/Admin/AdminStatusBadge';

export default function OrderPaymentCard({ order }) {
    const isCash = order.is_cash;
    const PaymentIcon = isCash ? Banknote : CreditCard;

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
                        Paiement
                    </h2>

                    <p className="text-xs text-[#596254]">
                        Informations du paiement
                    </p>
                </div>
            </div>

            {/* Payment information */}
            <dl className="space-y-1">
                {/* Method */}
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
                        Méthode
                    </dt>

                    <dd
                        className="
                            flex
                            items-center
                            gap-2
                            text-right
                            text-sm
                            font-bold
                            uppercase
                            tracking-wide
                            text-[var(--color-black)]
                        "
                    >
                        <PaymentIcon
                            size={16}
                            strokeWidth={2.2}
                            className="text-[var(--color-primary-dark)]"
                        />

                        {order.payment_method}
                    </dd>
                </div>

                {/* Status */}
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
                        Statut
                    </dt>

                    <dd>
                        <AdminStatusBadge
                            status={order.payment_status}
                            label={order.payment_status_label}
                        />
                    </dd>
                </div>

                {/* Transaction */}
                {order.transaction_id && (
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
                        <dt className="shrink-0 text-sm text-[#596254]">
                            Transaction ID
                        </dt>

                        <dd
                            className="
                                min-w-0
                                max-w-[180px]
                                truncate
                                rounded-lg
                                bg-[#f5f7f1]
                                px-2.5
                                py-1.5
                                font-mono
                                text-xs
                                font-medium
                                text-[var(--color-black)]
                            "
                            title={order.transaction_id}
                        >
                            {order.transaction_id}
                        </dd>
                    </div>
                )}
            </dl>

            {/* Cash payment information */}
            {order.is_cash &&
                order.payment_status === 'pending' && (
                    <div
                        className="
                            mt-4
                            flex
                            items-start
                            gap-3
                            rounded-xl
                            border
                            border-blue-200
                            bg-blue-50
                            px-4
                            py-3
                            text-sm
                            text-blue-700
                        "
                    >
                        <Info
                            className="mt-0.5 h-4 w-4 shrink-0"
                            strokeWidth={2.2}
                        />

                        <div>
                            <p className="font-bold">
                                Paiement à la livraison
                            </p>

                            <p className="mt-0.5 text-xs leading-relaxed text-blue-600">
                                Le paiement est confirmé uniquement
                                après la livraison de la commande.
                            </p>
                        </div>
                    </div>
                )}
        </section>
    );
}

