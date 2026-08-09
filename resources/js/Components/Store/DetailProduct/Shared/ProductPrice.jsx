import React from 'react';
import { formatPrice, getDiscountPercentage } from '../../../../utils/productHelpers';

export default function ProductPrice({ price, originalPrice }) {
    const discount = getDiscountPercentage(originalPrice, price);

    return (
        <div className="flex items-end gap-3 mt-4">
            <span className="text-4xl font-black font-archivo text-slate-900">
                {formatPrice(price)}
            </span>
            {originalPrice > price && (
                <>
                    <span className="text-xl font-medium text-slate-400 line-through mb-1">
                        {formatPrice(originalPrice)}
                    </span>
                    <span className="mb-1 rounded-full bg-red-100 px-2.5 py-0.5 text-sm font-bold text-red-700">
                        -{discount}%
                    </span>
                </>
            )}
        </div>
    );
}
