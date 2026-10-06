import {
    Banknote,
    CheckCircle2,
    CreditCard,
    Hash,
    ShieldCheck,
    XCircle,
    Clock3,
} from 'lucide-react';

function getPaymentMethod(paymentMethod) {
    switch (paymentMethod) {
        case 'cash':
            return {
                label: 'Paiement à la livraison',
                shortLabel: 'À la livraison',
                icon: Banknote,
                description: 'Le client paiera à la réception.',
            };

        case 'card':
        case 'stripe':
            return {
                label: 'Carte bancaire',
                shortLabel: 'Carte bancaire',
                icon: CreditCard,
                description: 'Paiement effectué par carte bancaire.',
            };

        default:
            return {
                label: paymentMethod || 'Non défini',
                shortLabel: paymentMethod || 'Non défini',
                icon: CreditCard,
                description: 'Méthode de paiement non précisée.',
            };
    }
}

function getPaymentStatus(status) {
    switch (status) {
        case 'paid':
            return {
                label: 'Payé',
                description: 'Le paiement a été confirmé.',
                icon: CheckCircle2,
                className: 'text-emerald-600',
                bgClassName: 'bg-emerald-50',
                borderClassName: 'border-emerald-200',
            };

        case 'failed':
            return {
                label: 'Échec',
                description: 'Le paiement a échoué.',
                icon: XCircle,
                className: 'text-red-600',
                bgClassName: 'bg-red-50',
                borderClassName: 'border-red-200',
            };

        case 'pending':
        default:
            return {
                label: 'En attente',
                description: 'Le paiement n’est pas encore confirmé.',
                icon: Clock3,
                className: 'text-amber-600',
                bgClassName: 'bg-amber-50',
                borderClassName: 'border-amber-200',
            };
    }
}

function TransactionId({ value }) {
    if (!value) {
        return (
            <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
                    <Hash className="h-4 w-4" />
                </div>

                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        Transaction
                    </p>

                    <p className="mt-0.5 text-xs font-medium text-slate-500">
                        Aucune transaction enregistrée
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-slate-400" />

                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    ID de transaction
                </span>
            </div>

            <p className="mt-2 break-all font-mono text-xs font-bold text-slate-700">
                {value}
            </p>
        </div>
    );
}

export default function OrderPaymentCard({ order }) {
    const payment = getPaymentMethod(order?.payment_method);
    const paymentStatus = getPaymentStatus(order?.payment_status);

    const PaymentIcon = payment.icon;
    const PaymentStatusIcon = paymentStatus.icon;

    return (
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {/* Header */}
            <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                        <CreditCard className="h-5 w-5" />
                    </div>

                    <div>
                        <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                            Paiement
                        </h2>

                        <p className="mt-0.5 text-xs text-slate-500">
                            Informations de paiement
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-4 p-5 sm:p-6">
                {/* Payment method */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
                            <PaymentIcon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                                Méthode
                            </p>

                            <p className="mt-1 text-sm font-black text-slate-800">
                                {payment.label}
                            </p>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                {payment.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Payment status */}
                <div
                    className={`rounded-2xl border p-4 ${paymentStatus.bgClassName} ${paymentStatus.borderClassName}`}
                >
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                            <PaymentStatusIcon
                                className={`h-5 w-5 ${paymentStatus.className}`}
                            />
                        </div>

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                                    Statut du paiement
                                </p>

                                <span
                                    className={`rounded-full bg-white px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${paymentStatus.className}`}
                                >
                                    {paymentStatus.label}
                                </span>
                            </div>

                            <p className="mt-1 text-xs leading-5 text-slate-600">
                                {paymentStatus.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Transaction */}
                <TransactionId value={order?.transaction_id} />

                {/* Security note */}
                <div className="flex items-start gap-3 border-t border-slate-100 pt-4">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

                    <p className="text-[11px] leading-5 text-slate-400">
                        Les informations sensibles de paiement ne sont pas
                        affichées dans le tableau de bord.
                    </p>
                </div>
            </div>
        </section>
    );
}