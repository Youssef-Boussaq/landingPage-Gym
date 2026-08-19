import React from 'react';
import {
    formatPrice,
    getDiscountPercentage,
} from '../../../../utils/productHelpers';

export default function ProductPrice({
    price,
    salePrice = null,
}) {
    const originalPrice = Number(price ?? 0);
    const currentPrice =
        salePrice !== null &&
            salePrice !== undefined &&
            Number(salePrice) > 0
            ? Number(salePrice)
            : originalPrice;

    const hasDiscount =
        salePrice !== null &&
        salePrice !== undefined &&
        Number(salePrice) > 0 &&
        Number(salePrice) < originalPrice;

    const discount = hasDiscount
        ? getDiscountPercentage(
            originalPrice,
            currentPrice
        )
        : 0;

    return (
        <div className="mt-3 flex flex-wrap items-baseline gap-2.5 sm:gap-3">

            {/* Current price */}
            <span
                className="
                    font-archivo
                    text-3xl
                    font-black
                    tracking-tight
                    text-slate-900
                    dark:text-white
                    sm:text-4xl
                "
            >
                {formatPrice(currentPrice)}
            </span>

            {/* Original price */}
            {hasDiscount && (
                <>
                    <span
                        className="
                            text-lg
                            font-medium
                            text-slate-400
                            line-through
                            dark:text-slate-500
                            sm:text-xl
                        "
                    >
                        {formatPrice(originalPrice)}
                    </span>

                    {/* Discount */}
                    <span
                        className="
                            inline-flex
                            items-center
                            rounded-full
                            border
                            border-rose-500/20
                            bg-rose-500/10
                            px-2.5
                            py-0.5
                            text-xs
                            font-bold
                            text-rose-600
                            dark:border-rose-500/30
                            dark:bg-rose-500/20
                            dark:text-rose-400
                            sm:text-sm
                        "
                    >
                        -{discount}%
                    </span>
                </>
            )}
        </div>
    );
}