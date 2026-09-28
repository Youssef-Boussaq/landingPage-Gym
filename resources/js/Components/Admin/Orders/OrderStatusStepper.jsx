
import {
    BadgeCheck,
    CircleCheckBig,
    CircleDot,
    Clock3,
    PackageCheck,
    PackageOpen,
    Truck,
} from 'lucide-react';

const NORMAL_STEPS = [
    {
        key: 'pending',
        label: 'En attente',
        icon: Clock3,
    },
    {
        key: 'confirmed',
        label: 'Confirmée',
        icon: BadgeCheck,
    },
    {
        key: 'processing',
        label: 'En préparation',
        icon: PackageOpen,
    },
    {
        key: 'shipped',
        label: 'Expédiée',
        icon: PackageCheck,
    },
    {
        key: 'out_for_delivery',
        label: 'En livraison',
        icon: Truck,
    },
    {
        key: 'delivered',
        label: 'Terminée',
        icon: CircleCheckBig,
    },
];

export default function OrderStatusStepper({ status }) {
    const isSpecialState =
        status === 'cancelled' || status === 'returned';

    const currentIndex = NORMAL_STEPS.findIndex(
        (step) => step.key === status
    );

    const activeIndex = isSpecialState ? -1 : currentIndex;

    return (
        <section
            className="
                overflow-x-auto
                rounded-2xl
                border border-black/[0.08]
                bg-white
                p-5
                shadow-[0_10px_35px_rgba(11,12,14,0.06)]
                print:hidden
            "
        >
            {/* Header */}
            <div className="mb-5 flex items-center justify-between gap-4">
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
                        Suivi de la commande
                    </h2>

                    <p className="mt-1 text-xs text-[#596254]">
                        Progression et état actuel de la commande
                    </p>
                </div>
            </div>

            <div className="min-w-[680px] px-2 py-3">
                <div className="relative">
                    {/* Background line */}
                    <div
                        className="
                            absolute
                            left-[28px]
                            right-[28px]
                            top-5
                            h-1
                            -translate-y-1/2
                            rounded-full
                            bg-[#edf1e8]
                        "
                    />

                    {/* Progress line */}
                    {!isSpecialState && activeIndex > 0 && (
                        <div
                            className="
                                absolute
                                left-[28px]
                                top-5
                                h-1
                                -translate-y-1/2
                                rounded-full
                                bg-[var(--color-primary)]
                                shadow-[0_0_12px_rgba(157,229,0,0.25)]
                                transition-all
                                duration-500
                                ease-out
                            "
                            style={{
                                width: `calc(${(
                                    (activeIndex /
                                        (NORMAL_STEPS.length - 1)) *
                                    100
                                )}% - 28px)`,
                            }}
                        />
                    )}

                    <div
                        className="
                            relative
                            z-10
                            flex
                            items-start
                            justify-between
                        "
                    >
                        {NORMAL_STEPS.map((step, index) => {
                            const isCompleted = index < activeIndex;
                            const isCurrent = index === activeIndex;
                            const isFuture = index > activeIndex;

                            const Icon = step.icon;

                            return (
                                <div
                                    key={step.key}
                                    className="
                                        flex
                                        w-[110px]
                                        flex-col
                                        items-center
                                        gap-2.5
                                    "
                                >
                                    {/* Status icon */}
                                    <div
                                        className={`
flex
h - 10
w - 10
items - center
justify - center
rounded - full
border - 2
bg - white
transition - all
duration - 300

                                            ${isCompleted
                                                ? `
                                                        border-[var(--color-primary)]
                                                        bg-[var(--color-primary)]
                                                        text-[var(--color-black)]
                                                        shadow-[0_5px_18px_rgba(157,229,0,0.22)]
                                                    `
                                                : ''
                                            }

                                            ${isCurrent
                                                ? `
                                                        border-[var(--color-primary-dark)]
                                                        bg-[var(--color-primary)]/15
                                                        text-[var(--color-primary-dark)]
                                                        ring-4
                                                        ring-[var(--color-primary)]/15
                                                    `
                                                : ''
                                            }

                                            ${isFuture
                                                ? `
                                                        border-black/[0.10]
                                                        bg-[#f8faf5]
                                                        text-[#aeb5a9]
                                                    `
                                                : ''
                                            }

                                            ${isSpecialState
                                                ? `
                                                        border-black/[0.08]
                                                        bg-[#f8faf5]
                                                        text-[#b6bdb0]
                                                    `
                                                : ''
                                            }
`}
                                    >
                                        {isCompleted ? (
                                            <CircleCheckBig
                                                className="h-5 w-5"
                                                strokeWidth={2.4}
                                            />
                                        ) : (
                                            <Icon
                                                className={`
h - 5 w - 5
                                                    ${isCurrent
                                                        ? 'scale-105'
                                                        : ''
                                                    }
`}
                                                strokeWidth={2.2}
                                            />
                                        )}
                                    </div>

                                    {/* Status label */}
                                    <span
                                        className={`
max - w - [105px]
text - center
text - [11px]
font - bold
uppercase
leading - tight
tracking - wide
transition - colors
duration - 300

                                            ${isCompleted
                                                ? 'text-[var(--color-black)]'
                                                : ''
                                            }

                                            ${isCurrent
                                                ? 'text-[var(--color-primary-dark)]'
                                                : ''
                                            }

                                            ${isFuture
                                                ? 'text-[#9da59a]'
                                                : ''
                                            }

                                            ${isSpecialState
                                                ? 'text-[#9da59a]'
                                                : ''
                                            }
`}
                                    >
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Cancelled / Returned */}
            {isSpecialState && (
                <div
                    className="
                        mt-4
                        flex
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-rose-200
                        bg-rose-50
                        px-4
                        py-3.5
                        text-sm
                        font-bold
                        text-rose-700
                    "
                >
                    {status === 'cancelled'
                        ? 'La commande a été annulée.'
                        : 'La commande a été retournée.'}
                </div>
            )}
        </section>
    );
}

