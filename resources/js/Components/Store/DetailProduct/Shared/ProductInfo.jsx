import React from 'react';
import ProductPrice from './ProductPrice';
import ProductRating from './ProductRating';

export default function ProductInfo({
    title,
    categoryName,
    price,
    sale_price,
    description,
    rating = 0,
    count = 0,
}) {
    return (
        <div className="flex flex-col space-y-4">
            <div>
                {categoryName && (
                    <span className="inline-block mb-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--color-primary)] font-inter">
                        {categoryName}
                    </span>
                )}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-archivo text-slate-900 dark:text-white leading-tight tracking-tight">
                    {title}
                </h1>
            </div>

            <ProductRating rating={rating} count={count} />

            <ProductPrice
                price={price}
                salePrice={sale_price}
            />
            {description && (
                <p className="pt-1 text-sm sm:text-base text-slate-600 dark:text-slate-300 font-inter leading-relaxed whitespace-pre-line">
                    {description}
                </p>
            )}
        </div>
    );
}