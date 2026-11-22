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
        <div className="mt-2 flex flex-wrap items-baseline gap-2.5 sm:gap-3 font-favorit">

            {/* Current price */}
            <span
                className="
                    text-2xl
                    font-normal
                    tracking-[0.025em]
                    text-[#000000]
                    sm:text-3xl
                "
            >
                {formatPrice(currentPrice)}
            </span>

            {/* Original price */}
            {hasDiscount && (
                <>
                    <span
                        className="
                            text-base
                            font-normal
                            text-[#999999]
                            line-through
                            sm:text-lg
                        "
                    >
                        {formatPrice(originalPrice)}
                    </span>

                    {/* Discount */}
                    <span
                        className="
                            inline-flex
                            items-center
                            rounded-none
                            border
                            border-[#000000]
                            bg-[#000000]
                            px-2
                            py-0.5
                            text-[10px]
                            font-medium
                            uppercase
                            tracking-[0.05em]
                            text-white
                        "
                    >
                        -{discount}%
                    </span>
                </>
            )}
        </div>
    );
}