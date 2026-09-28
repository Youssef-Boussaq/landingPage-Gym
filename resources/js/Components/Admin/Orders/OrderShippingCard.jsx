
import {
    MapPin,
    Navigation,
} from 'lucide-react';

export default function OrderShippingCard({ shipping }) {
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
                    <MapPin
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
                        Expédition
                    </h2>

                    <p className="text-xs text-[#596254]">
                        Adresse de livraison
                    </p>
                </div>
            </div>

            {/* Address */}
            <div
                className="
                    rounded-xl
                    border border-black/[0.06]
                    bg-[#f8faf5]
                    p-4
                "
            >
                {/* Address */}
                <div className="flex items-start gap-3">
                    <Navigation
                        size={17}
                        strokeWidth={2.1}
                        className="
                            mt-0.5
                            shrink-0
                            text-[var(--color-primary-dark)]
                        "
                    />

                    <div className="min-w-0 space-y-1">
                        <p
                            className="
                                break-words
                                font-bold
                                leading-relaxed
                                text-[var(--color-black)]
                            "
                        >
                            {shipping?.address || '—'}
                        </p>

                        {shipping?.city && (
                            <p className="text-sm text-[#596254]">
                                {shipping.city}
                            </p>
                        )}

                        {shipping?.postal_code && (
                            <p className="text-sm text-[#596254]">
                                {shipping.postal_code}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

