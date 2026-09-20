import React from 'react';
import ProductVariants from './ProductVariants';
import StockInfo from './StockInfo';
import ShippingInfo from './ShippingInfo';
import ProductQuantity from '../Shared/ProductQuantity';
import ProductActions from '../Shared/ProductActions';
import { formatPrice } from '../../../../utils/productHelpers';

export default function PhysicalProductDetails({
    product,
    quantity,
    onQuantityChange,
    selectedVariant,
    onVariantSelect,
    onAddToCart,
    onBuyNow,
}) {
    const manageStock = Boolean(product.manage_stock);

    const stockQuantity = Number(product.stock_quantity ?? 0);
    const reservedQuantity = Number(product.reserved_quantity ?? 0);

    // Stock réellement disponible
    const availableStock = Math.max(
        0,
        stockQuantity - reservedQuantity
    );

    const isOutOfStock =
        manageStock && availableStock <= 0;

    // Maximum selectable quantity
    const maxQuantity = manageStock
        ? availableStock
        : 99;

    const totalPrice =
        Number(product.sale_price ?? product.price ?? 0) * quantity;

    const handleQuantityChange = (newQuantity) => {
        let nextQuantity = Number(newQuantity);

        if (!Number.isFinite(nextQuantity)) {
            return;
        }

        nextQuantity = Math.floor(nextQuantity);

        if (nextQuantity < 1) {
            nextQuantity = 1;
        }

        // Si le stock est géré
        if (manageStock) {
            if (availableStock <= 0) {
                onQuantityChange(1);
                return;
            }

            nextQuantity = Math.min(
                nextQuantity,
                availableStock
            );
        }

        onQuantityChange(nextQuantity);
    };

    return (
        <div className="space-y-6">

            <ProductVariants
                variants={product.variants}
                selectedVariant={selectedVariant}
                onVariantSelect={onVariantSelect}
            />

            <div className="flex flex-wrap items-end gap-6 pt-4 border-t border-slate-100">

                <ProductQuantity
                    quantity={quantity}
                    onQuantityChange={handleQuantityChange}
                    max={maxQuantity}
                    availableStock={availableStock}
                    manageStock={manageStock}
                />

                <div className="flex flex-col gap-1">
                    <span className="font-inter text-sm text-slate-500">
                        Total
                    </span>

                    <span className="font-archivo text-2xl font-bold text-slate-900">
                        {formatPrice(totalPrice)}
                    </span>
                </div>

                <div className="flex-1 min-w-[200px]">
                    <StockInfo
                        manageStock={manageStock}
                        inStock={!isOutOfStock}
                        stockCount={availableStock}
                    />
                </div>

            </div>

            <ProductActions
                onAddToCart={onAddToCart}
                onBuyNow={onBuyNow}
                isOutOfStock={isOutOfStock}
            />

            <ShippingInfo />

        </div>
    );
}