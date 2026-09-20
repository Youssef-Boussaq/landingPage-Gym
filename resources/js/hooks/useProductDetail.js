
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { addToCart } from '../services/cartService';

export const useProductDetail = (product) => {
    const [activeImage, setActiveImage] = useState(
        product?.images?.[0]?.url ||
        '/images/placeholder.png'
    );

    const [quantity, setQuantity] = useState(1);

    const [selectedVariant, setSelectedVariant] = useState(null);

    const handleQuantityChange = (newQuantity) => {
        let nextQuantity = Number(newQuantity);

        if (!Number.isFinite(nextQuantity)) {
            return;
        }

        nextQuantity = Math.floor(nextQuantity);

        if (nextQuantity < 1) {
            nextQuantity = 1;
        }

        if (product?.manage_stock) {
            const stock = Number(
                product.stock_quantity ?? 0
            );

            if (stock <= 0) {
                setQuantity(1);
                return;
            }

            nextQuantity = Math.min(
                nextQuantity,
                stock
            );
        }

        setQuantity(nextQuantity);
    };

    const handleAddToCart = () => {
        return addToCart(
            product.id,
            quantity,
            selectedVariant
        );
    };

    const handleBuyNow = () => {
        return router.post(
            route('checkout.buy-now'),
            {
                product_id: Number(product.id),
                quantity: Number(quantity),
                variant_id: selectedVariant?.id ?? null,
            },
            {
                preserveScroll: true,
            }
        );
    };

    return {
        activeImage,
        setActiveImage,
        quantity,
        handleQuantityChange,
        selectedVariant,
        setSelectedVariant,
        handleAddToCart,
        handleBuyNow,
    };
};

