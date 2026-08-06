import { Link } from '@inertiajs/react';

export default function ProductCard({ product }) {
    return (
        <Link
            href={route('store.products.show', product.id)}
            className="min-w-[18rem] shrink-0 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
            <div className="overflow-hidden rounded-2xl bg-slate-100">
                <img
                    src={product.images?.[0]?.url || '/images/placeholder.png'}
                    alt={product.images?.[0]?.alt_text || product.title}
                    className="h-44 w-full object-cover"
                />
            </div>
            <div className="mt-4 space-y-2">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                    {product.categories?.map((category) => category.name).join(', ')}
                </div>
                <div className="text-lg font-black text-slate-900">{product.title}</div>
                <div className="text-sm text-slate-600">{product.price} €</div>
            </div>
        </Link>
    );
}
