import {
    Home,
    MapPin,
    Navigation,
    Mail,
} from 'lucide-react';

function InfoRow({ icon: Icon, label, value }) {
    if (!value) return null;

    return (
        <div
            className="
                flex
                items-start
                gap-3
                rounded-xl
                border border-black/[0.06]
                bg-[#f8faf5]
                px-3
                py-3
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
                <Icon
                    size={16}
                    strokeWidth={2.2}
                />
            </span>

            <div className="min-w-0">
                <p
                    className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.12em]
                        text-[#8a9384]
                    "
                >
                    {label}
                </p>

                <p
                    className="
                        mt-0.5
                        break-words
                        text-sm
                        font-semibold
                        leading-5
                        text-[var(--color-black)]
                    "
                >
                    {value}
                </p>
            </div>
        </div>
    );
}

export default function OrderShippingCard({ shipping }) {
    const address = shipping?.address || null;
    const city = shipping?.city || null;
    const postalCode = shipping?.postal_code || null;

    const hasShippingInformation =
        address || city || postalCode;

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
                    <Home
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
                        Livraison
                    </h2>

                    <p className="text-xs text-[#596254]">
                        Adresse de livraison
                    </p>
                </div>
            </div>

            {/* Shipping information */}
            {hasShippingInformation ? (
                <div className="space-y-2.5">

                    {/* Address */}
                    {address && (
                        <div
                            className="
                                rounded-xl
                                border border-black/[0.06]
                                bg-[#f8faf5]
                                p-3
                            "
                        >
                            <div className="flex items-start gap-3">
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
                                    <MapPin
                                        size={16}
                                        strokeWidth={2.2}
                                    />
                                </span>

                                <div className="min-w-0">
                                    <p
                                        className="
                                            text-[10px]
                                            font-bold
                                            uppercase
                                            tracking-[0.12em]
                                            text-[#8a9384]
                                        "
                                    >
                                        Adresse
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            break-words
                                            text-sm
                                            font-semibold
                                            leading-5
                                            text-[var(--color-black)]
                                        "
                                    >
                                        {address}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* City */}
                    <InfoRow
                        icon={Navigation}
                        label="Ville"
                        value={city}
                    />

                    {/* Postal code */}
                    <InfoRow
                        icon={Mail}
                        label="Code postal"
                        value={postalCode}
                    />

                </div>
            ) : (
                <div
                    className="
                        rounded-xl
                        border border-dashed
                        border-black/[0.08]
                        bg-[#f8faf5]
                        px-4
                        py-4
                    "
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="
                                flex h-9 w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-white
                                text-[#8a9384]
                                shadow-sm
                            "
                        >
                            <MapPin
                                size={17}
                                strokeWidth={2}
                            />
                        </div>

                        <div>
                            <p className="text-sm font-bold text-[var(--color-black)]">
                                Adresse indisponible
                            </p>

                            <p className="mt-0.5 text-xs text-[#596254]">
                                Aucune information de livraison disponible.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* AMEEX destination hint */}
            {city && (
                <div
                    className="
                        mt-3
                        flex
                        items-start
                        gap-3
                        rounded-xl
                        border
                        border-[var(--color-primary-dark)]/15
                        bg-[var(--color-primary)]/5
                        px-3
                        py-3
                    "
                >
                    <Navigation
                        size={15}
                        className="
                            mt-0.5
                            shrink-0
                            text-[var(--color-primary-dark)]
                        "
                        strokeWidth={2.2}
                    />

                    <p className="text-[11px] leading-5 text-[#596254]">
                        Cette ville sera utilisée comme destination
                        pour l'expédition AMEEX.
                    </p>
                </div>
            )}
        </section>
    );
}