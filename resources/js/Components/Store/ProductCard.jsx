import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';

export default function ProductCard({ product = {}, preview = false }) {
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
        'Produit Fit Youness';

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

        router.post(
            route('store.cart.add'),
            {
                product_id: product.id,
                quantity: 1,
            },
            {
                preserveScroll: true,
            }
        );
    };

    const price = product.sale_price ?? product.price;

    const content = (
        <article className="group relative flex flex-col w-full bg-white rounded-none p-2 sm:p-3 transition-all duration-200">
            {/* PRODUCT IMAGE: Aspect 4/5, rounded-none */}
            <div className="relative w-full aspect-[4/5] bg-stone-100 overflow-hidden rounded-none">
                <img
                    src={imageUrl}
                    alt={imageAlt}
                    width="400"
                    height="500"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover rounded-none transition-transform duration-500 ease-out group-hover:scale-105"
                />

                {product.type === 'digital' && (
                    <span className="absolute top-2 left-2 bg-black text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5">
                        E-Product
                    </span>
                )}
            </div>

            {/* METADATA: Title, Price, Quick Add */}
            <div className="mt-2.5 flex flex-col flex-1 justify-between gap-1.5">
                <div>
                    {/* Product Title in Favorit 12px */}
                    <h3 className="text-[12px] sm:text-[13px] font-medium leading-[1.3] text-black tracking-[0.025em] line-clamp-1">
                        {product.title}
                    </h3>

                    {/* Price */}
                    <div className="mt-0.5 flex items-baseline gap-2">
                        <span className="text-[12px] sm:text-[13px] font-semibold text-black tracking-[0.025em]">
                            {Number(price).toFixed(2)} MAD
                        </span>
                        {product.sale_price && (
                            <span className="text-[11px] font-normal text-stone-400 line-through tracking-[0.025em]">
                                {Number(product.price).toFixed(2)} MAD
                            </span>
                        )}
                    </div>
                </div>

                {/* Quick Add Button */}
                <div className="mt-1 flex items-center justify-end">
                    <button
                        type="button"
                        onClick={handleQuickAdd}
                        aria-label={`Ajouter ${product.title} au panier`}
                        className="inline-flex items-center justify-center gap-1 rounded-[4px] bg-black px-2.5 py-1 text-[11px] font-medium tracking-[0.025em] text-white hover:bg-stone-800 transition-colors"
                    >
                        <Plus className="w-3 h-3 stroke-[2]" />
                        <span>{product.type === 'digital' ? 'Acheter' : 'Ajouter'}</span>
                    </button>
                </div>
            </div>
        </article>
    );

    if (preview) {
        return <div className="block">{content}</div>;
    }

    return (
        <Link
            href={route('store.products.show', product.id)}
            className="block text-inherit no-underline focus:outline-none focus-visible:ring-1 focus-visible:ring-black"
        >
            {content}
        </Link>
    );
}
