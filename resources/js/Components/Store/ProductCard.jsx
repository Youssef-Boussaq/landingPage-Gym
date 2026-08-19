import { Link } from '@inertiajs/react';
import { ShoppingBag, ArrowUpRight } from 'lucide-react';

export default function ProductCard({ product }) {
    // Safe image fallback
    const primaryImage =
        product.images?.find((image) => image.is_primary) ??
        product.images?.[0];

    const imageUrl =
        primaryImage?.url ??
        '/images/placeholder.png';

    const imageAlt =
        primaryImage?.alt_text ??
        product.title;

    // Format categories
    const categoriesText = Array.isArray(product.categories)
        ? product.categories.map((c) => c.name).join(' • ')
        : 'Store';

    return (
        <Link
            href={route('store.products.show', product.id)}
            className="group flex flex-col w-full overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-200/60 hover:border-primary/60"
        >
            {/* FULL-WIDTH IMAGE CONTAINER (Matches card width) */}
            <div className="relative w-full aspect-square overflow-hidden bg-slate-100">
                <img
                    src={primaryImage?.url ?? '/images/placeholder.png'}
                    alt={primaryImage?.alt_text ?? product.title}
                />

                {/* Floating Action Badge */}
                <div className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md text-slate-900 shadow-md transition-all duration-300 group-hover:bg-[#9de500] group-hover:scale-110">
                    <ArrowUpRight className="w-4 h-4" />
                </div>
            </div>

            {/* CARD CONTENT (Padded inside) */}
            <div className="flex flex-col flex-1 p-5 justify-between bg-white">
                <div>
                    {/* Category Tag */}
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        {categoriesText}
                    </span>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-900 transition-colors group-hover:text-slate-950 line-clamp-1">
                        {product.title}
                    </h3>
                </div>

                {/* Price & Cart CTA Row */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                        <span className="text-[11px] text-slate-400 block font-medium uppercase tracking-wider">Prix</span>
                        <span className="text-lg font-extrabold text-slate-900">
                            {product.price} <span className="text-sm font-semibold text-slate-600">€</span>
                        </span>
                    </div>

                    {/* Icon CTA Button */}
                    <div className="inline-flex items-center justify-center p-2.5 rounded-xl bg-slate-900 text-[#9de500] transition-colors duration-300 group-hover:bg-[#9de500] group-hover:text-slate-950 shadow-sm">
                        <ShoppingBag className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </Link>
    );
}