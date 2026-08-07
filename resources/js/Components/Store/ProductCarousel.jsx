import React from 'react';
import ProductCard from '@/Components/Store/ProductCard';

export default function ProductCarousel({ products = [], isFilterOpen = false }) {
    if (products.length === 0) {
        return (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
                Aucun produit à afficher pour l'instant.
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* 
              - Grille responsive (1 colonne sur mobile, adaptative sur plus grands écrans)
            */}
            <div className={`
                grid gap-4 sm:gap-5
                ${isFilterOpen
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                }
            `}>
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="w-full flex flex-col"
                    >
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
}