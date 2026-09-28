
import { Package } from 'lucide-react';
import { formatMoney } from '@/helpers/format';

export default function OrderItems({ items }) {
    return (
        <section
            className="
                overflow-hidden
                rounded-2xl
                border border-black/[0.08]
                bg-white
                shadow-[0_10px_35px_rgba(11,12,14,0.06)]
            "
        >
            {/* Header */}
            <div
                className="
                    flex items-center justify-between
                    border-b border-black/[0.06]
                    bg-[#f8faf5]
                    px-5 py-4
                "
            >
                <div className="flex items-center gap-3">
                    <div
                        className="
                            flex h-9 w-9
                            items-center justify-center
                            rounded-xl
                            bg-[var(--color-primary)]/15
                            text-[var(--color-primary-dark)]
                        "
                    >
                        <Package
                            size={18}
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
                            Articles
                        </h2>

                        <p className="text-xs text-[#596254]">
                            {items.length}{' '}
                            {items.length > 1
                                ? 'articles'
                                : 'article'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Items */}
            <div className="divide-y divide-black/[0.06]">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="
                            flex
                            items-center
                            gap-4
                            p-5
                            transition-colors
                            duration-200
                            hover:bg-[#f8faf5]
                        "
                    >
                        {/* Product image */}
                        <div
                            className="
                                h-16 w-16
                                shrink-0
                                overflow-hidden
                                rounded-xl
                                border border-black/[0.07]
                                bg-[#f1f4ec]
                                shadow-sm
                            "
                        >
                            <img
                                src={
                                    item.product.image ||
                                    '/images/placeholder.png'
                                }
                                alt={item.product.title}
                                className="
                                    h-full
                                    w-full
                                    object-cover
                                    transition-transform
                                    duration-300
                                    hover:scale-105
                                "
                            />
                        </div>

                        {/* Product information */}
                        <div className="min-w-0 flex-1">
                            <p
                                className="
                                    truncate
                                    font-bold
                                    text-[var(--color-black)]
                                "
                                title={item.product.title}
                            >
                                {item.product.title}
                            </p>

                            <div className="mt-1 flex flex-wrap items-center gap-2">
                                <span className="text-sm font-medium text-[#596254]">
                                    {item.quantity} ×
                                </span>

                                <span className="text-sm text-[#596254]">
                                    {formatMoney(item.unit_price)}
                                </span>
                            </div>
                        </div>

                        {/* Subtotal */}
                        <div className="shrink-0 text-right">
                            <p
                                className="
                                    font-archivo
                                    text-base
                                    text-[var(--color-black)]
                                "
                            >
                                {formatMoney(item.subtotal)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

