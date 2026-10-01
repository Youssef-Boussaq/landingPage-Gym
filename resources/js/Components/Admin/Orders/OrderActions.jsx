import { useForm } from '@inertiajs/react';
import {
    Ban,
    CheckCircle2,
    ChevronRight,
    Clock3,
    Loader2,
    PackageCheck,
    RotateCcw,
} from 'lucide-react';

const ACTION_CONFIG = {
    confirmed: {
        label: 'Confirmer la commande',
        icon: CheckCircle2,
        className: `
            border-[var(--color-primary-dark)]/30
            bg-[var(--color-primary)]/15
            text-[#547900]
            hover:bg-[var(--color-primary)]/25
            hover:border-[var(--color-primary-dark)]/50
        `,
    },

    processing: {
        label: 'Mettre en préparation',
        icon: Clock3,
        className: `
            border-blue-200
            bg-blue-50
            text-blue-700
            hover:bg-blue-100
            hover:border-blue-300
        `,
    },

    cancelled: {
        label: 'Annuler la commande',
        icon: Ban,
        className: `
            border-red-200
            bg-red-50
            text-red-700
            hover:bg-red-100
            hover:border-red-300
        `,
    },
};

export default function OrderActions({ order }) {
    const form = useForm({
        status: '',
    });

    const ameexForm = useForm();

    if (
        !order.allowed_statuses ||
        order.allowed_statuses.length === 0
    ) {
        /*
         * Processing has a separate AMEEX action,
         * so it must still render.
         */
        if (order.status !== 'processing') {
            return null;
        }
    }

    const submitStatus = (status) => {
        form.setData('status', status);

        form.patch(
            route('admin.orders.status', order.id),
            {
                preserveScroll: true,
            }
        );
    };

    const sendToAmeex = () => {
        ameexForm.post(
            route('admin.orders.ship', order.id),
            {
                preserveScroll: true,
            }
        );
    };

    const isSendingToAmeex = ameexForm.processing;

    return (
        <section
            className="
                print:hidden
                rounded-2xl
                border border-black/[0.08]
                bg-white
                p-5
                shadow-[0_10px_35px_rgba(11,12,14,0.06)]
            "
        >
            {/* Header */}
            <div className="mb-5">
                <div className="flex items-center gap-2">
                    <div
                        className="
                            flex h-9 w-9 items-center justify-center
                            rounded-xl
                            bg-[var(--color-primary)]/15
                            text-[var(--color-primary-dark)]
                        "
                    >
                        <ChevronRight
                            size={18}
                            strokeWidth={2.5}
                        />
                    </div>

                    <h2
                        className="
                            font-archivo
                            text-sm
                            uppercase
                            tracking-wide
                            text-[var(--color-black)]
                        "
                    >
                        Actions de la commande
                    </h2>
                </div>

                <p className="mt-2 text-sm text-[#596254]">
                    Faites évoluer le statut de cette commande.
                </p>
            </div>

            <div className="flex flex-wrap gap-3">
                {order.allowed_statuses?.map((status) => {
                    const config =
                        ACTION_CONFIG[status] || {
                            label: `Passer à ${status}`,
                            icon: ChevronRight,
                            className: `
                                border-black/10
                                bg-[#f5f7f1]
                                text-[var(--color-black)]
                                hover:bg-[#eaf0df]
                            `,
                        };

                    const Icon = config.icon;

                    const isProcessing =
                        form.processing &&
                        form.data.status === status;

                    return (
                        <button
                            key={status}
                            type="button"
                            onClick={() => submitStatus(status)}
                            disabled={
                                form.processing ||
                                isSendingToAmeex
                            }
                            className={`
                                inline-flex
                                items-center
                                gap-2
                                rounded-xl
                                border
                                px-4
                                py-2.5
                                text-sm
                                font-bold
                                shadow-sm
                                transition-all
                                duration-200
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                                ${config.className}
                            `}
                        >
                            {isProcessing ? (
                                <Loader2
                                    className="h-4 w-4 animate-spin"
                                />
                            ) : (
                                <Icon
                                    className="h-4 w-4"
                                    strokeWidth={2.2}
                                />
                            )}

                            <span>
                                {isProcessing
                                    ? 'Traitement...'
                                    : config.label}
                            </span>
                        </button>
                    );
                })}

                {/* AMEEX */}
                {order.status === 'processing' && (
                    <button
                        type="button"
                        onClick={sendToAmeex}
                        disabled={
                            form.processing ||
                            isSendingToAmeex
                        }
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-indigo-200
                            bg-indigo-50
                            px-4
                            py-2.5
                            text-sm
                            font-bold
                            text-indigo-700
                            shadow-sm
                            transition-all
                            duration-200
                            hover:border-indigo-300
                            hover:bg-indigo-100
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        {isSendingToAmeex ? (
                            <Loader2
                                className="h-4 w-4 animate-spin"
                            />
                        ) : (
                            <PackageCheck
                                className="h-4 w-4"
                                strokeWidth={2.2}
                            />
                        )}

                        <span>
                            {isSendingToAmeex
                                ? 'Création du colis...'
                                : 'Envoyer à AMEEX'}
                        </span>
                    </button>
                )}
            </div>

            {/* Normal status error */}
            {form.errors.status && (
                <div
                    className="
                        mt-4
                        rounded-xl
                        border border-rose-200
                        bg-rose-50
                        px-4
                        py-3
                        text-sm
                        font-medium
                        text-rose-700
                    "
                >
                    {form.errors.status}
                </div>
            )}

            {/* AMEEX error */}
            {ameexForm.errors.ameex && (
                <div
                    className="
                        mt-4
                        rounded-xl
                        border border-rose-200
                        bg-rose-50
                        px-4
                        py-3
                        text-sm
                        font-medium
                        text-rose-700
                    "
                >
                    {ameexForm.errors.ameex}
                </div>
            )}
        </section>
    );
}

