
import {
    CheckCircle2,
    MessageCircle,
    PackageOpen,
    Truck,
} from 'lucide-react';

import { formatMoney } from '@/helpers/format';

export default function OrderWhatsApp({ order }) {
    if (!order.customer?.phone) {
        return null;
    }

    const phone = order.customer.phone.replace(/[^0-9]/g, '');
    const amount = formatMoney(order.summary.total);

    const templates = [
        {
            label: 'Commande confirmée',
            icon: CheckCircle2,
            message: `Bonjour ${order.customer.name},\n\nVotre commande #${order.order_number} d'un montant de ${amount} est bien confirmée.\n\nMerci pour votre confiance !`,
            iconClass:
                'bg-[var(--color-primary)]/15 text-[var(--color-primary-dark)]',
            hoverClass:
                'hover:border-[var(--color-primary-dark)]/30 hover:bg-[var(--color-primary)]/10',
        },
        {
            label: 'En préparation',
            icon: PackageOpen,
            message: `Bonjour ${order.customer.name},\n\nVotre commande #${order.order_number} est actuellement en préparation. Nous vous tiendrons au courant de son expédition.`,
            iconClass: 'bg-blue-50 text-blue-600',
            hoverClass: 'hover:border-blue-200 hover:bg-blue-50/70',
        },
        {
            label: 'Expédition / En livraison',
            icon: Truck,
            message: `Bonjour ${order.customer.name},\n\nBonne nouvelle ! Votre commande #${order.order_number} a été expédiée et sera bientôt livrée.\n\nMerci de vous tenir disponible.`,
            iconClass: 'bg-orange-50 text-orange-600',
            hoverClass: 'hover:border-orange-200 hover:bg-orange-50/70',
        },
    ];

    return (
        <section
            className="
                rounded-2xl
                border border-black/[0.08]
                bg-white
                p-5
                shadow-[0_10px_35px_rgba(11,12,14,0.06)]
                print:hidden
            "
        >
            {/* Header */}
            <div className="mb-5 flex items-center gap-3">
                <div
                    className="
                        flex h-10 w-10
                        items-center justify-center
                        rounded-xl
                        bg-[#25D366]/10
                        text-[#128C4A]
                    "
                >
                    <MessageCircle
                        size={20}
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
                        Messages & WhatsApp
                    </h2>

                    <p className="mt-0.5 text-xs text-[#596254]">
                        Contactez rapidement le client
                    </p>
                </div>
            </div>

            {/* Templates */}
            <div className="space-y-2.5">
                {templates.map((tpl) => {
                    const Icon = tpl.icon;

                    const whatsappUrl =
                        `https://wa.me/${phone}` +
                        `?text=${encodeURIComponent(tpl.message)}`;

                    return (
                        <a
                            key={tpl.label}
                            href={whatsappUrl}
                            target="_blank"
                            rel="noreferrer"
                            className={`
                                group
                                flex
                                items-center
                                gap-3
                                rounded-xl
                                border
                                border-black/[0.07]
                                bg-[#f8faf5]
                                px-3
                                py-3
                                text-sm
                                font-bold
                                text-[var(--color-black)]
                                shadow-sm
                                transition-all
                                duration-200
                                hover:-translate-y-0.5
                                hover:shadow-md
                                ${tpl.hoverClass}
                            `}
                        >
                            {/* Icon */}
                            <span
                                className={`
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    transition-transform
                                    duration-200
                                    group-hover:scale-105
                                    ${tpl.iconClass}
                                `}
                            >
                                <Icon
                                    size={17}
                                    strokeWidth={2.2}
                                />
                            </span>

                            {/* Label */}
                            <span className="min-w-0 flex-1">
                                {tpl.label}
                            </span>

                            {/* WhatsApp indicator */}
                            <MessageCircle
                                size={16}
                                strokeWidth={2.1}
                                className="
                                    shrink-0
                                    text-[#25D366]
                                    opacity-60
                                    transition-all
                                    duration-200
                                    group-hover:translate-x-0.5
                                    group-hover:opacity-100
                                "
                            />
                        </a>
                    );
                })}
            </div>

            {/* Phone number */}
            <div
                className="
                    mt-4
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-[#25D366]/15
                    bg-[#25D366]/5
                    px-3
                    py-2.5
                    text-xs
                    text-[#596254]
                "
            >
                <MessageCircle
                    size={14}
                    className="shrink-0 text-[#25D366]"
                    strokeWidth={2.2}
                />

                <span>
                    WhatsApp :{' '}
                    <strong className="text-[var(--color-black)]">
                        {order.customer.phone}
                    </strong>
                </span>
            </div>
        </section>
    );
}

