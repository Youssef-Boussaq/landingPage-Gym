import { Link } from '@inertiajs/react';
import ProductCard from '@/Components/Store/ProductCard';

export default function ProductCarousel({ products = [] }) {
    if (products.length === 0) {
        return (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
                Aucun produit à afficher pour l'instant.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
