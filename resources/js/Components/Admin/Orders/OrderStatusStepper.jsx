import {
    BadgeCheck,
    Check,
    CircleCheckBig,
    CircleX,
    Clock3,
    PackageCheck,
    PackageOpen,
    PackageX,
    Truck,
    RotateCcw,
} from 'lucide-react';

const STEPS = [
    {
        key: 'pending',
        label: 'En attente',
        shortLabel: 'Attente',
        icon: Clock3,
    },
    {
        key: 'confirmed',
        label: 'Confirmée',
        shortLabel: 'Confirmée',
        icon: BadgeCheck,
    },
    {
        key: 'processing',
        label: 'Préparation',
        shortLabel: 'Préparation',
        icon: PackageOpen,
    },
    {
        key: 'shipped',
        label: 'Expédiée',
        shortLabel: 'Expédiée',
        icon: PackageCheck,
    },
    {
        key: 'out_for_delivery',
        label: 'En livraison',
        shortLabel: 'Livraison',
        icon: Truck,
    },
    {
        key: 'delivered',
        label: 'Livrée',
        shortLabel: 'Livrée',
        icon: CircleCheckBig,
    },
];

const STATUS_INDEX = {
    pending: 0,
    paid: 1,
    confirmed: 1,
    processing: 2,
    shipped: 3,
    out_for_delivery: 4,
    delivered: 5,
};

export default function OrderStatusStepper({ status }) {
    const isReturned = status === 'returned';
    const isCancelled = status === 'cancelled';

    /*
     * ---------------------------------------------------------
     * TERMINAL STATE
     * Returned / Cancelled are not part of the normal journey.
     * ---------------------------------------------------------
     */
    if (isReturned || isCancelled) {
        const returned = isReturned;

        return (
            <section className="overflow-hidden rounded-[28px] border border-black/[0.07] bg-white shadow-[0_12px_40px_rgba(11,12,14,0.045)]">
                <div className="p-5 sm:p-6">

                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <div>
                            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#929a8e]">
                                Progression de la commande
                            </p>

                            <h2 className="mt-1 text-base font-extrabold text-[var(--color-black)]">
                                Parcours terminé
                            </h2>
                        </div>

                        <div
                            className={`
                                flex h-10 w-10 items-center justify-center rounded-xl
                                ${returned
                                    ? 'bg-red-50 text-red-600'
                                    : 'bg-slate-100 text-slate-600'
                                }
                            `}
                        >
                            {returned ? (
                                <PackageX size={19} strokeWidth={2.2} />
                            ) : (
                                <CircleX size={19} strokeWidth={2.2} />
                            )}
                        </div>
                    </div>

                    {/* Normal journey + terminal state */}
                    <div className="flex flex-wrap items-center gap-y-5">

                        {STEPS.map((step, index) => {
                            const StepIcon = step.icon;

                            return (
                                <div
                                    key={step.key}
                                    className="flex min-w-[90px] flex-1 items-center"
                                >
                                    {/* Step */}
                                    <div className="flex flex-col items-center">
                                        <div
                                            className="
                                                flex h-10 w-10
                                                items-center justify-center
                                                rounded-full
                                                border
                                                bg-white
                                            "
                                            style={{
                                                borderColor:
                                                    'rgba(0,0,0,0.08)',
                                            }}
                                        >
                                            <StepIcon
                                                size={16}
                                                className="text-[#a0a79b]"
                                            />
                                        </div>

                                        <span className="mt-2 text-center text-[10px] font-bold text-[#929a8e]">
                                            {step.shortLabel}
                                        </span>
                                    </div>

                                    {/* Connector */}
                                    {index < STEPS.length - 1 && (
                                        <div className="mx-2 h-px flex-1 bg-black/[0.07]" />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Terminal state */}
                    <div
                        className={`
                            mt-6 flex items-center gap-4 rounded-2xl border p-4
                            ${returned
                                ? 'border-red-200 bg-red-50/70'
                                : 'border-slate-200 bg-slate-50'
                            }
                        `}
                    >
                        <div
                            className={`
                                flex h-11 w-11 shrink-0 items-center justify-center rounded-xl
                                ${returned
                                    ? 'bg-red-100 text-red-600'
                                    : 'bg-slate-200 text-slate-600'
                                }
                            `}
                        >
                            {returned ? (
                                <RotateCcw
                                    size={20}
                                    strokeWidth={2.2}
                                />
                            ) : (
                                <CircleX
                                    size={20}
                                    strokeWidth={2.2}
                                />
                            )}
                        </div>

                        <div className="min-w-0">
                            <p
                                className={`
                                    text-sm font-extrabold
                                    ${returned
                                        ? 'text-red-700'
                                        : 'text-slate-700'
                                    }
                                `}
                            >
                                {returned
                                    ? 'Commande retournée'
                                    : 'Commande annulée'}
                            </p>

                            <p className="mt-0.5 text-xs text-[#697263]">
                                {returned
                                    ? 'La commande a été retournée après son expédition.'
                                    : 'La commande a été annulée et son traitement est terminé.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Accent */}
                <div
                    className={
                        returned
                            ? 'h-[3px] bg-red-500'
                            : 'h-[3px] bg-slate-400'
                    }
                />
            </section>
        );
    }

    const currentIndex =
        STATUS_INDEX[status] ?? 0;

    return (
        <section className="overflow-hidden rounded-[28px] border border-black/[0.07] bg-white shadow-[0_12px_40px_rgba(11,12,14,0.045)]">
            <div className="p-5 sm:p-6 lg:p-7">

                {/* =================================================
                    HEADER
                ================================================= */}
                <div className="mb-7 flex items-center justify-between gap-4">

                    <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#929a8e]">
                            Progression
                        </p>

                        <h2 className="mt-1 text-base font-extrabold text-[var(--color-black)]">
                            Suivi de la commande
                        </h2>
                    </div>

                    <div className="hidden items-center gap-2 sm:flex">
                        <span className="text-xs font-semibold text-[#929a8e]">
                            Étape
                        </span>

                        <span className="rounded-full bg-[#f4f6f1] px-2.5 py-1 text-xs font-extrabold text-[#697263]">
                            {currentIndex + 1}/{STEPS.length}
                        </span>
                    </div>
                </div>

                {/* =================================================
                    DESKTOP STEPPER
                ================================================= */}
                <div className="hidden md:block">
                    <div className="flex items-start">

                        {STEPS.map((step, index) => {
                            const StepIcon = step.icon;

                            const completed =
                                index < currentIndex;

                            const current =
                                index === currentIndex;

                            const future =
                                index > currentIndex;

                            return (
                                <div
                                    key={step.key}
                                    className="flex min-w-0 flex-1 items-start"
                                >
                                    <div className="flex min-w-0 flex-1 flex-col items-center">

                                        {/* Icon */}
                                        <div
                                            className={`
                                                relative
                                                flex h-12 w-12
                                                items-center justify-center
                                                rounded-2xl
                                                border
                                                transition-all
                                                duration-200
                                                ${completed
                                                    ? 'border-[var(--color-primary-dark)] bg-[var(--color-primary)] text-[var(--color-black)]'
                                                    : ''
                                                }
                                                ${current
                                                    ? 'border-[var(--color-primary-dark)] bg-[var(--color-primary)] text-[var(--color-black)] shadow-[0_0_0_5px_color-mix(in_srgb,var(--color-primary)_12%,transparent)]'
                                                    : ''
                                                }
                                                ${future
                                                    ? 'border-black/[0.07] bg-[#fafbf8] text-[#a2a99d]'
                                                    : ''
                                                }
                                            `}
                                        >
                                            {completed ? (
                                                <Check
                                                    size={18}
                                                    strokeWidth={3}
                                                />
                                            ) : (
                                                <StepIcon
                                                    size={19}
                                                    strokeWidth={
                                                        current
                                                            ? 2.5
                                                            : 2
                                                    }
                                                />
                                            )}

                                            {/* Current indicator */}
                                            {current && (
                                                <span
                                                    className="
                                                        absolute
                                                        -right-1
                                                        -top-1
                                                        h-2.5
                                                        w-2.5
                                                        rounded-full
                                                        border-2
                                                        border-white
                                                        bg-[var(--color-primary-dark)]
                                                    "
                                                />
                                            )}
                                        </div>

                                        {/* Label */}
                                        <div className="mt-3 text-center">
                                            <p
                                                className={`
                                                    text-xs
                                                    font-extrabold
                                                    ${completed || current
                                                        ? 'text-[var(--color-black)]'
                                                        : 'text-[#9aa195]'
                                                    }
                                                `}
                                            >
                                                {step.label}
                                            </p>

                                            {current && (
                                                <p className="mt-1 text-[10px] font-semibold text-[#8a9285]">
                                                    Étape actuelle
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Connector */}
                                    {index < STEPS.length - 1 && (
                                        <div
                                            className="
                                                mt-6
                                                h-[2px]
                                                min-w-[20px]
                                                flex-1
                                            "
                                            style={{
                                                backgroundColor:
                                                    index < currentIndex
                                                        ? 'var(--color-primary)'
                                                        : 'rgba(11,12,14,0.07)',
                                            }}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* =================================================
                    MOBILE STEPPER
                ================================================= */}
                <div className="md:hidden">

                    <div className="space-y-0">
                        {STEPS.map((step, index) => {
                            const StepIcon = step.icon;

                            const completed =
                                index < currentIndex;

                            const current =
                                index === currentIndex;

                            const future =
                                index > currentIndex;

                            return (
                                <div
                                    key={step.key}
                                    className="flex gap-4"
                                >
                                    {/* Timeline */}
                                    <div className="flex flex-col items-center">

                                        <div
                                            className={`
                                                flex h-10 w-10 shrink-0
                                                items-center justify-center
                                                rounded-xl
                                                border
                                                ${completed || current
                                                    ? 'border-[var(--color-primary-dark)] bg-[var(--color-primary)] text-[var(--color-black)]'
                                                    : 'border-black/[0.07] bg-[#fafbf8] text-[#a2a99d]'
                                                }
                                                ${current
                                                    ? 'shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-primary)_12%,transparent)]'
                                                    : ''
                                                }
                                            `}
                                        >
                                            {completed ? (
                                                <Check
                                                    size={16}
                                                    strokeWidth={3}
                                                />
                                            ) : (
                                                <StepIcon
                                                    size={17}
                                                    strokeWidth={2.2}
                                                />
                                            )}
                                        </div>

                                        {index < STEPS.length - 1 && (
                                            <div
                                                className="my-1 min-h-8 w-[2px]"
                                                style={{
                                                    backgroundColor:
                                                        index < currentIndex
                                                            ? 'var(--color-primary)'
                                                            : 'rgba(11,12,14,0.07)',
                                                }}
                                            />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="pb-6 pt-1">
                                        <p
                                            className={`
                                                text-sm font-extrabold
                                                ${completed || current
                                                    ? 'text-[var(--color-black)]'
                                                    : 'text-[#9aa195]'
                                                }
                                            `}
                                        >
                                            {step.label}
                                        </p>

                                        <p className="mt-1 text-xs text-[#929a8e]">
                                            {completed
                                                ? 'Étape terminée'
                                                : current
                                                    ? 'Étape actuelle'
                                                    : 'À venir'}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* =====================================================
                PROGRESS BAR
            ===================================================== */}
            <div className="h-[3px] bg-black/[0.04]">
                <div
                    className="h-full bg-[var(--color-primary)] transition-all duration-500"
                    style={{
                        width: `${((currentIndex + 1) / STEPS.length) * 100}%`,
                    }}
                />
            </div>
        </section>
    );
}