import { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    AlertTriangle,
    Ban,
    Box,
    CheckCircle2,
    ChevronRight,
    Loader2,
    PackageCheck,
    Send,
    Truck,
    X,
} from 'lucide-react';

const ACTIONS = {
    confirmed: {
        label: 'Confirmer la commande',
        description: 'La commande sera confirmée et pourra être préparée.',
        icon: CheckCircle2,
        tone: 'primary',
        nextStatus: 'confirmed',
    },

    processing: {
        label: 'Mettre en préparation',
        description: 'La commande passe en préparation avant son expédition.',
        icon: Box,
        tone: 'violet',
        nextStatus: 'processing',
    },
};

function getAction(order) {
    switch (order.status) {
        case 'pending':
        case 'paid':
            return ACTIONS.confirmed;

        case 'confirmed':
            return ACTIONS.processing;

        default:
            return null;
    }
}

function PrimaryAction({ order }) {
    const action = getAction(order);
    const [processing, setProcessing] = useState(false);

    if (!action) {
        return null;
    }

    const Icon = action.icon;

    function submit() {
        setProcessing(true);

        router.patch(
            route('admin.orders.status', order.id),
            {
                status: action.nextStatus,
            },
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
            }
        );
    }

    return (
        <button
            type="button"
            disabled={processing}
            onClick={submit}
            className="group flex w-full items-center justify-between rounded-2xl bg-[var(--color-primary)] px-4 py-4 text-left text-black shadow-sm transition hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
        >
            <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/10">
                    {processing ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <Icon className="h-5 w-5" />
                    )}
                </div>

                <div className="min-w-0">
                    <p className="text-sm font-black">
                        {processing
                            ? 'Mise à jour...'
                            : action.label}
                    </p>

                    <p className="mt-0.5 text-xs text-black/60">
                        {action.description}
                    </p>
                </div>
            </div>

            {!processing && (
                <ChevronRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5" />
            )}
        </button>
    );
}

function AmeexAction({ order }) {
    const [processing, setProcessing] = useState(false);

    if (order.status !== 'processing') {
        return null;
    }

    function ship() {
        setProcessing(true);

        router.post(
            route('admin.orders.ship', order.id),
            {},
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
            }
        );
    }

    return (
        <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4">
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                    <Truck className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                    <p className="text-sm font-black text-slate-900">
                        Prête pour l'expédition
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                        Créez le colis AMEEX puis envoyez la commande
                        au transporteur.
                    </p>
                </div>
            </div>

            <button
                type="button"
                disabled={processing}
                onClick={ship}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {processing ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Envoi en cours...
                    </>
                ) : (
                    <>
                        <Send className="h-4 w-4" />
                        Envoyer à AMEEX
                    </>
                )}
            </button>
        </div>
    );
}

function ShippingWaiting({ order }) {
    if (order.status !== 'shipped') {
        return null;
    }

    return (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                    <PackageCheck className="h-5 w-5" />
                </div>

                <div>
                    <p className="text-sm font-black text-emerald-800">
                        Colis expédié
                    </p>

                    <p className="mt-1 text-xs leading-5 text-emerald-700/70">
                        La commande est maintenant suivie par AMEEX.
                        Les prochaines étapes seront synchronisées via
                        les événements de livraison.
                    </p>
                </div>
            </div>
        </div>
    );
}

function TerminalState({ order }) {
    if (order.status === 'delivered') {
        return (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />

                    <div>
                        <p className="text-sm font-black text-emerald-800">
                            Commande terminée
                        </p>

                        <p className="mt-0.5 text-xs text-emerald-700/70">
                            La commande a été livrée au client.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (order.status === 'returned') {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                <div className="flex items-center gap-3">
                    <PackageCheck className="h-5 w-5 rotate-180 text-red-600" />

                    <div>
                        <p className="text-sm font-black text-red-800">
                            Commande retournée
                        </p>

                        <p className="mt-0.5 text-xs text-red-700/70">
                            AMEEX a signalé le retour du colis.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (order.status === 'cancelled') {
        return (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                    <Ban className="h-5 w-5 text-slate-500" />

                    <div>
                        <p className="text-sm font-black text-slate-800">
                            Commande annulée
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                            Aucune action supplémentaire n'est disponible.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}

function CancelAction({ order }) {
    const [open, setOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    const canCancel = [
        'pending',
        'paid',
        'confirmed',
    ].includes(order.status);

    if (!canCancel) {
        return null;
    }

    function cancelOrder() {
        setProcessing(true);

        router.patch(
            route('admin.orders.status', order.id),
            {
                status: 'cancelled',
            },
            {
                preserveScroll: true,
                onFinish: () => {
                    setProcessing(false);
                    setOpen(false);
                },
            }
        );
    }

    return (
        <>
            {!open ? (
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
                >
                    <Ban className="h-4 w-4" />
                    Annuler la commande
                </button>
            ) : (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                    <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-red-500 shadow-sm">
                            <AlertTriangle className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                            <p className="text-sm font-black text-red-800">
                                Confirmer l'annulation ?
                            </p>

                            <p className="mt-1 text-xs leading-5 text-red-700/70">
                                Cette action libérera la réservation de
                                stock de la commande.
                            </p>
                        </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            disabled={processing}
                            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-600"
                        >
                            <X className="h-4 w-4" />
                            Retour
                        </button>

                        <button
                            type="button"
                            onClick={cancelOrder}
                            disabled={processing}
                            className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
                        >
                            {processing ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Ban className="h-4 w-4" />
                            )}

                            Confirmer
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default function OrderActions({ order }) {
    return (
        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                    Actions
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                    Gestion de la commande
                </p>
            </div>

            <div className="space-y-3 p-5">
                <PrimaryAction order={order} />

                <AmeexAction order={order} />

                <ShippingWaiting order={order} />

                <TerminalState order={order} />

                <CancelAction order={order} />
            </div>
        </section>
    );
}