import React from 'react';
import ProductCarousel from '@/Components/Store/ProductCarousel';

export default function CategorySection({ categoryName, count, products, isFilterOpen }) {
    return (
        <section className="space-y-4 my-10">
            {categoryName && (
                <div className="flex items-baseline justify-between border-b border-black pb-3">
                    <div className="flex items-baseline gap-3">
                        <h2 className="text-[20px] font-bold text-black tracking-[0.025em]">
                            {categoryName}
                        </h2>
                        {count !== undefined && (
                            <span className="text-[12px] font-normal text-stone-500">
                                ({count} {count > 1 ? 'articles' : 'article'})
                            </span>
                        )}
                    </div>
                </div>
            )}

            <ProductCarousel products={products} isFilterOpen={isFilterOpen} />
        </section>
    );
}
