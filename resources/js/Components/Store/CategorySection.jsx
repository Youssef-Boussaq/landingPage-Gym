import React from 'react';
import ProductCarousel from '@/Components/Store/ProductCarousel';

export default function CategorySection({ categoryName, count, products, isFilterOpen }) {
    return (
        <section className="space-y-2.5 sm:space-y-4">
            <div className="flex flex-col items-center justify-center text-center my-3 sm:my-6 space-y-1.5 sm:space-y-2.5">
                <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-2xl font-black text-slate-900 tracking-tight">
                        {categoryName}
                    </h2>
                    {count !== undefined && (
                        <span className="text-[10px] sm:text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full shadow-xs">
                            {count}
                        </span>
                    )}
                </div>
                <div className="relative flex items-center justify-center w-20 sm:w-28 h-1">
                    <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-slate-900 to-transparent rounded-full" />
                    <div className="absolute w-1.5 h-1.5 rounded-full bg-slate-900 shadow-xs" />
                </div>
            </div>

            <ProductCarousel products={products} isFilterOpen={isFilterOpen} />
        </section>
    );
}