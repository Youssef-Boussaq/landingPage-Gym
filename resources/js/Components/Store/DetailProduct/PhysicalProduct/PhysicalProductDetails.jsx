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
    onBuyNow
}) {
    const isOutOfStock = product.stock <= 0;
    const totalPrice = product.price * quantity;

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
                    onQuantityChange={onQuantityChange}
                    max={product.stock_quantity || 99}
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
                    <StockInfo inStock={!isOutOfStock} stockCount={product.stock} />
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
