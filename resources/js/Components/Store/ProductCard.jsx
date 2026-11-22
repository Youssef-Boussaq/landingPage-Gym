import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { Heart, Plus } from 'lucide-react';

const DEFAULT_SWATCHES = [
    { name: 'Black', color: '#000000' },
    { name: 'Mist', color: '#e5e7eb' },
    { name: 'Slate', color: '#2f3440' },
    { name: 'Driftwood', color: '#dfccbe' },
];

export default function ProductCard({ product = {}, preview = false }) {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [activeSwatch, setActiveSwatch] = useState(0);

    const primaryImage =
        product.images?.find((img) => img.is_primary) ??
        product.images?.[0];

    const imageUrl =
        primaryImage?.url ??
        primaryImage?.path ??
        '/images/placeholder.png';

    const imageAlt =
        primaryImage?.alt_text ??
        product.title ??
        'Product image';

    const handleQuickAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (product.type === 'digital') {
            router.post(route('checkout.buy-now'), {
                product_id: product.id,
                quantity: 1,
            });
            return;
        }

        router.post(route('store.cart.add'), {
            product_id: product.id,
            quantity: 1,
        }, {
            preserveScroll: true,
        });
    };

    const handleWishlistToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsWishlisted((prev) => !prev);
    };

    const price = product.sale_price ?? product.price;

    const content = (
        <div className="group relative flex flex-col w-full bg-white rounded-none p-3 sm:p-4 transition-all duration-200">
            {/* PRODUCT IMAGE: Full width, 0px border radius, no shadow */}
            <div className="relative w-full aspect-[4/5] bg-stone-100 overflow-hidden rounded-none">
                <img
                    src={imageUrl}
                    alt={imageAlt}
                    className="h-full w-full object-cover rounded-none transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />

                {/* Wishlist Heart Icon: Outline stroke, floats top-right */}
                <button
                    type="button"
                    onClick={handleWishlistToggle}
                    aria-label="Sauvegarder dans les favoris"
                    className="absolute top-2.5 right-2.5 p-1 text-black transition-colors hover:text-black z-10"
                >
                    <Heart
                        className={`w-4 h-4 transition-colors ${
                            isWishlisted
                                ? 'fill-black stroke-black'
                                : 'stroke-black fill-none stroke-[1.5]'
                        }`}
                    />
                </button>
            </div>

            {/* METADATA: Swatches, Title, Price, Quick Add */}
            <div className="mt-3 flex flex-col flex-1 justify-between gap-2">
                <div>
                    {/* Color Swatch Row: 12x12px squares, 4px gap */}
                    <div className="flex items-center gap-1 mb-2">
                        {DEFAULT_SWATCHES.map((swatch, idx) => (
                            <button
                                key={swatch.name}
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setActiveSwatch(idx);
                                }}
                                title={swatch.name}
                                className={`w-3 h-3 rounded-none transition-all ${
                                    activeSwatch === idx
                                        ? 'ring-1 ring-black ring-offset-1'
                                        : 'opacity-80 hover:opacity-100'
                                }`}
                                style={{ backgroundColor: swatch.color }}
                            />
                        ))}
                    </div>

                    {/* Product Title in Favorit 12px weight 400 at #000000 */}
                    <h3 className="text-[12px] font-normal leading-[1.3] text-black tracking-[0.025em] line-clamp-1">
                        {product.title}
                    </h3>

                    {/* Price in Favorit 12px weight 400 at #000000 */}
                    <div className="mt-0.5 flex items-baseline gap-2">
                        <span className="text-[12px] font-normal text-black tracking-[0.025em]">
                            {Number(price).toFixed(2)} MAD
                        </span>
                        {product.sale_price && (
                            <span className="text-[11px] font-normal text-stone-400 line-through tracking-[0.025em]">
                                {Number(product.price).toFixed(2)} MAD
                            </span>
                        )}
                    </div>
                </div>

                {/* Filled Quick Add Button: Solid #000000, white text 12px, 4px radius, 4px 10px padding */}
                <div className="mt-2 flex items-center justify-end">
                    <button
                        type="button"
                        onClick={handleQuickAdd}
                        className="inline-flex items-center justify-center gap-1 rounded-[4px] bg-black px-2.5 py-1 text-[11px] font-medium tracking-[0.025em] text-white hover:bg-stone-800 transition-colors"
                    >
                        <Plus className="w-3 h-3 stroke-[2]" />
                        <span>Quick Add</span>
                    </button>
                </div>
            </div>
        </div>
    );

    if (preview) {
        return <div className="block">{content}</div>;
    }

    return (
        <Link
            href={route('store.products.show', product.id)}
            className="block text-inherit no-underline"
        >
            {content}
        </Link>
    );
}
