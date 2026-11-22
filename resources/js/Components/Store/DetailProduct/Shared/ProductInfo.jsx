import React from 'react';
import ProductPrice from './ProductPrice';
import ProductRating from './ProductRating';

export default function ProductInfo({
    title,
    categoryName,
    price,
    sale_price,
    description,
    rating = null,
    count = 0,
    ratingsCount = 0,
}) {
    return (
        <div className="flex flex-col space-y-4 font-favorit">
            <div>
                {categoryName && (
                    <span className="inline-block mb-1.5 text-[12px] font-medium uppercase tracking-[0.025em] text-[#666666]">
                        {categoryName}
                    </span>
                )}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-[#000000] leading-tight tracking-[0.025em] uppercase">
                    {title}
                </h1>
            </div>

            <ProductRating rating={rating} count={count} ratingsCount={ratingsCount} />

            <ProductPrice
                price={price}
                salePrice={sale_price}
            />
            {description && (
                <p className="pt-1 text-[14px] text-[#333333] leading-[1.4] tracking-[0.025em] whitespace-pre-line">
                    {description}
                </p>
            )}
        </div>
    );
}