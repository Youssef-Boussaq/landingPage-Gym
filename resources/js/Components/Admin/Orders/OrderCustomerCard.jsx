import {
    Mail,
    Phone,
    User,
} from 'lucide-react';

export default function OrderCustomerCard({ customer }) {
    const name = customer?.name || 'Client inconnu';

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
            <div className="mb-4 flex items-center gap-3">
                <div
                    className="
                        flex h-10 w-10
                        items-center justify-center
                        rounded-xl
                        bg-[var(--color-primary)]/15
                        text-[var(--color-primary-dark)]
                    "
                >
                    <User
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
                        Client
                    </h2>

                    <p className="text-xs text-[#596254]">
                        Informations du client
                    </p>
                </div>
            </div>

            {/* Customer */}
            <div className="space-y-4">

                {/* Name + Type */}
                <div>
                    <p className="text-lg font-bold text-[var(--color-black)]">
                        {name}
                    </p>

                    {customer?.type_label && (
                        <span
                            className="
                                mt-1
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
                                text-[var(--color-primary-dark)]
                            "
                        >
                            {customer.type_label}
                        </span>
                    )}
                </div>

                {/* Contact */}
                <div className="space-y-2.5">

                    {/* Phone */}
                    {customer?.phone && (
                        <a
                            href={`tel:${customer.phone}`}
                            className="
                                group
                                flex
                                items-center
                                gap-3
                                rounded-xl
                                border
                                border-black/[0.06]
                                bg-[#f8faf5]
                                px-3
                                py-2.5
                                text-sm
                                text-[#596254]
                                transition-all
                                duration-200
                                hover:border-[var(--color-primary-dark)]/30
                                hover:bg-[var(--color-primary)]/10
                                hover:text-[var(--color-black)]
                            "
                        >
                            <span
                                className="
                                    flex h-8 w-8
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-white
                                    text-[var(--color-primary-dark)]
                                    shadow-sm
                                "
                            >
                                <Phone
                                    size={16}
                                    strokeWidth={2.2}
                                />
                            </span>

                            <span className="truncate font-medium">
                                {customer.phone}
                            </span>
                        </a>
                    )}

                    {/* Email */}
                    {customer?.email && (
                        <a
                            href={`mailto:${customer.email}`}
                            className="
                                group
                                flex
                                items-center
                                gap-3
                                rounded-xl
                                border
                                border-black/[0.06]
                                bg-[#f8faf5]
                                px-3
                                py-2.5
                                text-sm
                                text-[#596254]
                                transition-all
                                duration-200
                                hover:border-[var(--color-primary-dark)]/30
                                hover:bg-[var(--color-primary)]/10
                                hover:text-[var(--color-black)]
                            "
                        >
                            <span
                                className="
                                    flex h-8 w-8
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-white
                                    text-[var(--color-primary-dark)]
                                    shadow-sm
                                "
                            >
                                <Mail
                                    size={16}
                                    strokeWidth={2.2}
                                />
                            </span>

                            <span className="truncate font-medium">
                                {customer.email}
                            </span>
                        </a>
                    )}

                    {/* No contact information */}
                    {!customer?.phone && !customer?.email && (
                        <div
                            className="
                                rounded-xl
                                border border-dashed
                                border-black/[0.08]
                                bg-[#f8faf5]
                                px-3
                                py-3
                                text-xs
                                text-[#596254]
                            "
                        >
                            Aucune information de contact disponible.
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}