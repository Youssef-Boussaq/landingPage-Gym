import React from 'react';
import ProductPrice from './ProductPrice';
import ProductRating from './ProductRating';

export default function ProductInfo({ title, categoryName, price, originalPrice, description }) {
    return (
        <div className="flex flex-col space-y-4">
            <div>
                {categoryName && (
                    <span className="text-sm font-semibold uppercase tracking-wider text-[var(--color-primary)] font-inter">
                        {categoryName}
                    </span>
                )}
                <h1 className="mt-1 text-3xl font-black font-archivo text-slate-900 leading-tight">
                    {title}
                </h1>
            </div>

            <ProductRating rating={4.5} count={24} />

            <ProductPrice price={price} originalPrice={originalPrice} />

            {description && (
                <p className="mt-4 text-base text-slate-600 font-inter leading-relaxed">
                    {description}
                </p>
            )}
        </div>
    );
}
