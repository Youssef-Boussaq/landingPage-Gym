import {
    ArrowLeft,
    BadgeCheck,
    Banknote,
    CalendarDays,
    CircleCheckBig,
    CircleX,
    CreditCard,
    MessageCircle,
    PackageCheck,
    PackageOpen,
    PackageX,
    Phone,
    Printer,
    Truck,
    UserRound,
    Clock3,
} from 'lucide-react';

import { formatDate } from '@/helpers/format';
import AdminStatusBadge from '@/Components/Admin/AdminStatusBadge';

const STATUS_CONFIG = {
    pending: {
        icon: Clock3,
        accent: '#d97706',
        soft: 'rgba(217,119,6,0.08)',
        border: 'rgba(217,119,6,0.18)',
        label: 'En attente',
    },

    paid: {
        icon: CircleCheckBig,
        accent: '#16a34a',
        soft: 'rgba(22,163,74,0.08)',
        border: 'rgba(22,163,74,0.18)',
        label: 'Payée',
    },

    confirmed: {
        icon: BadgeCheck,
        accent: '#2563eb',
        soft: 'rgba(37,99,235,0.08)',
        border: 'rgba(37,99,235,0.18)',
        label: 'Confirmée',
    },

    processing: {
        icon: PackageOpen,
        accent: '#7c3aed',
        soft: 'rgba(124,58,237,0.08)',
        border: 'rgba(124,58,237,0.18)',
        label: 'En préparation',
    },

    shipped: {
        icon: PackageCheck,
        accent: '#16a34a',
        soft: 'rgba(22,163,74,0.08)',
        border: 'rgba(22,163,74,0.18)',
        label: 'Expédiée',
    },

    out_for_delivery: {
        icon: Truck,
        accent: '#ea580c',
        soft: 'rgba(234,88,12,0.08)',
        border: 'rgba(234,88,12,0.18)',
        label: 'En livraison',
    },

    delivered: {
        icon: CircleCheckBig,
        accent: '#15803d',
        soft: 'rgba(21,128,61,0.08)',
        border: 'rgba(21,128,61,0.18)',
        label: 'Terminée',
    },

    returned: {
        icon: PackageX,
        accent: '#dc2626',
        soft: 'rgba(220,38,38,0.08)',
        border: 'rgba(220,38,38,0.18)',
        label: 'Retournée',
    },

    cancelled: {
        icon: CircleX,
        accent: '#64748b',
        soft: 'rgba(100,116,139,0.08)',
        border: 'rgba(100,116,139,0.18)',
        label: 'Annulée',
    },
};

const PAYMENT_CONFIG = {
    cash: {
        icon: Banknote,
        label: 'Paiement à la livraison',
    },

    card: {
        icon: CreditCard,
        label: 'Carte bancaire',
    },
};

export default function OrderHeader({ order }) {
    const handlePrint = () => {
        window.print();
    };

    const whatsappUrl = order.customer?.phone
        ? `https://wa.me/${order.customer.phone.replace(/[^0-9]/g, '')}`
        : null;

    const status =
        STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;

    const StatusIcon = status.icon;

    const payment =
        PAYMENT_CONFIG[order.payment_method] ?? null;

    const PaymentIcon = payment?.icon;

    return (
        <section
            className="
                relative
                overflow-hidden
                rounded-[30px]
                border border-black/[0.07]
                bg-white
                shadow-[0_18px_55px_rgba(11,12,14,0.06)]
            "
        >
            {/* -------------------------------------------------
                Decorative status glow
            ------------------------------------------------- */}
            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    -right-20
                    -top-20
                    h-64
                    w-64
                    rounded-full
                    blur-3xl
                "
                style={{
                    backgroundColor: status.soft,
                }}
            />

            {/* -------------------------------------------------
                Main content
            ------------------------------------------------- */}
            <div className="relative p-5 sm:p-6 lg:p-7">

                {/* =============================================
                    TOP BAR
                ============================================= */}
                <div className="mb-6 flex items-center justify-between gap-4">

                    {/* Back */}
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        aria-label="Retour aux commandes"
                        className="
                            group
                            inline-flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            border border-black/[0.07]
                            bg-[#fafbf8]
                            text-[#697263]
                            shadow-sm
                            transition-all
                            duration-200
                            hover:-translate-x-0.5
                            hover:border-[var(--color-primary-dark)]/30
                            hover:bg-[var(--color-primary)]/10
                            hover:text-[var(--color-black)]
                            focus:outline-none
                            focus:ring-2
                            focus:ring-[var(--color-primary)]/30
                        "
                    >
                        <ArrowLeft
                            size={17}
                            strokeWidth={2.2}
                            className="
                                transition-transform
                                duration-200
                                group-hover:-translate-x-0.5
                            "
                        />
                    </button>

                    {/* Context */}
                    <div className="flex min-w-0 flex-1 items-center gap-3">

                        <div
                            className="
                                hidden
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                sm:flex
                            "
                            style={{
                                color: status.accent,
                                backgroundColor: status.soft,
                            }}
                        >
                            <PackageCheck
                                size={18}
                                strokeWidth={2.2}
                            />
                        </div>

                        <div className="min-w-0">
                            <p
                                className="
                                    text-[10px]
                                    font-extrabold
                                    uppercase
                                    tracking-[0.18em]
                                    text-[#899184]
                                "
                            >
                                Gestion de commande
                            </p>

                            <p className="mt-0.5 truncate text-xs font-semibold text-[#697263]">
                                Détails et suivi
                            </p>
                        </div>
                    </div>

                    {/* Status indicator */}
                    <div
                        className="
                            hidden
                            items-center
                            gap-2
                            rounded-full
                            border
                            px-3
                            py-1.5
                            sm:flex
                        "
                        style={{
                            color: status.accent,
                            backgroundColor: status.soft,
                            borderColor: status.border,
                        }}
                    >
                        <StatusIcon
                            size={14}
                            strokeWidth={2.4}
                        />

                        <span className="text-xs font-extrabold">
                            {order.status_label || status.label}
                        </span>
                    </div>
                </div>

                {/* =============================================
                    MAIN HEADER
                ============================================= */}
                <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">

                    {/* -----------------------------------------
                        ORDER INFORMATION
                    ----------------------------------------- */}
                    <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2.5">

                            <h1
                                className="
                                    break-all
                                    font-archivo
                                    text-[27px]
                                    uppercase
                                    leading-[1.05]
                                    tracking-tight
                                    text-[var(--color-black)]
                                    sm:text-3xl
                                    lg:text-[36px]
                                "
                            >
                                #{order.order_number}
                            </h1>

                            {order.customer?.type_label && (
                                <span
                                    className="
                                        inline-flex
                                        items-center
                                        gap-1.5
                                        rounded-full
                                        border border-black/[0.07]
                                        bg-[#f8faf5]
                                        px-2.5
                                        py-1
                                        text-[10px]
                                        font-extrabold
                                        uppercase
                                        tracking-[0.08em]
                                        text-[#697263]
                                    "
                                >
                                    <UserRound
                                        size={11}
                                        strokeWidth={2.4}
                                    />

                                    {order.customer.type_label}
                                </span>
                            )}
                        </div>

                        {/* -------------------------------------
                            META INFORMATION
                        ------------------------------------- */}
                        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">

                            <div
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    text-sm
                                    text-[#697263]
                                "
                            >
                                <CalendarDays
                                    size={15}
                                    className="text-[#929a8e]"
                                />

                                <span>
                                    Créée le{' '}
                                    <strong className="font-semibold text-[#3f463b]">
                                        {formatDate(order.created_at)}
                                    </strong>
                                </span>
                            </div>

                            {order.customer?.name && (
                                <div
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        text-sm
                                        text-[#697263]
                                    "
                                >
                                    <UserRound
                                        size={15}
                                        className="text-[#929a8e]"
                                    />

                                    <span>
                                        {order.customer.name}
                                    </span>
                                </div>
                            )}

                            {order.customer?.phone && (
                                <div
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        text-sm
                                        text-[#697263]
                                    "
                                >
                                    <Phone
                                        size={14}
                                        className="text-[#929a8e]"
                                    />

                                    <span>
                                        {order.customer.phone}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* -------------------------------------
                            STATUS + PAYMENT
                        ------------------------------------- */}
                        <div className="mt-5 flex flex-wrap items-center gap-2">

                            {/* Main order status */}
                            <div
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    border
                                    px-3
                                    py-1.5
                                "
                                style={{
                                    color: status.accent,
                                    backgroundColor: status.soft,
                                    borderColor: status.border,
                                }}
                            >
                                <StatusIcon
                                    size={15}
                                    strokeWidth={2.5}
                                />

                                <span className="text-xs font-extrabold">
                                    {order.status_label ||
                                        status.label}
                                </span>
                            </div>

                            {/* Payment status */}
                            <AdminStatusBadge
                                status={order.payment_status}
                                label={order.payment_status_label}
                            />

                            {/* Payment method */}
                            {payment && PaymentIcon && (
                                <div
                                    className="
                                        inline-flex
                                        items-center
                                        gap-1.5
                                        rounded-full
                                        border border-black/[0.07]
                                        bg-white
                                        px-3
                                        py-1.5
                                        text-xs
                                        font-semibold
                                        text-[#697263]
                                    "
                                >
                                    <PaymentIcon
                                        size={14}
                                        strokeWidth={2.2}
                                    />

                                    {payment.label}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* =========================================
                        ACTIONS
                    ========================================= */}
                    <div
                        className="
                            flex
                            flex-wrap
                            gap-2
                            print:hidden
                            lg:justify-end
                        "
                    >
                        {whatsappUrl && (
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="
                                    group
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    border border-emerald-200
                                    bg-emerald-50
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-bold
                                    text-emerald-700
                                    shadow-sm
                                    transition-all
                                    duration-200
                                    hover:border-emerald-300
                                    hover:bg-emerald-100
                                    hover:shadow
                                "
                            >
                                <MessageCircle
                                    size={17}
                                    strokeWidth={2.2}
                                    className="
                                        transition-transform
                                        duration-200
                                        group-hover:scale-105
                                    "
                                />

                                <span>WhatsApp</span>
                            </a>
                        )}

                        <button
                            type="button"
                            onClick={handlePrint}
                            className="
                                group
                                inline-flex
                                items-center
                                gap-2
                                rounded-xl
                                border border-black/[0.08]
                                bg-white
                                px-4
                                py-2.5
                                text-sm
                                font-bold
                                text-[var(--color-black)]
                                shadow-sm
                                transition-all
                                duration-200
                                hover:border-[var(--color-primary-dark)]/30
                                hover:bg-[#f8faf5]
                                hover:shadow
                            "
                        >
                            <Printer
                                size={17}
                                strokeWidth={2.2}
                                className="
                                    transition-transform
                                    duration-200
                                    group-hover:-translate-y-0.5
                                "
                            />

                            <span>Imprimer</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* =============================================
                MOBILE STATUS STRIP
            ============================================= */}
            <div
                className="
                    flex
                    items-center
                    gap-2
                    border-t
                    px-5
                    py-3
                    sm:hidden
                "
                style={{
                    color: status.accent,
                    backgroundColor: status.soft,
                    borderColor: status.border,
                }}
            >
                <StatusIcon
                    size={15}
                    strokeWidth={2.4}
                />

                <span className="text-xs font-extrabold">
                    {order.status_label || status.label}
                </span>
            </div>

            {/* =============================================
                STATUS ACCENT
            ============================================= */}
            <div
                className="h-[3px]"
                style={{
                    backgroundColor: status.accent,
                }}
            />
        </section>
    );
}