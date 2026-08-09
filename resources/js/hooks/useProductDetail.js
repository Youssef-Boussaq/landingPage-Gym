import { useState } from 'react';

import { addToCart } from '../services/cartService';

export const useProductDetail = (product) => {
    // Gallery state
    const [activeImage, setActiveImage] = useState(
        product?.images?.[0]?.url || '/images/placeholder.png'
    );

    // Quantity state
    const [quantity, setQuantity] = useState(1);

    // Variants state (for physical products)
    const [selectedVariant, setSelectedVariant] = useState(null);

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = () => {
        return addToCart(
            product.id,
            quantity,
            selectedVariant
        );
    };

    const handleBuyNow = () => {
        console.log('Buy now:', {
            product_id: product.id,
            quantity,
            variant: selectedVariant
        });
    };

    return {
        activeImage,
        setActiveImage,
        quantity,
        handleQuantityChange,
        selectedVariant,
        setSelectedVariant,
        handleAddToCart,
        handleBuyNow
    };
};
