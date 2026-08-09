import React, { createContext, useContext, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { addToCart } from '@/services/cartService';

const CartContext = createContext(null);

export function CartProvider({ children }) {

    const { cart = {} } = usePage().props;

    const [isCartOpen, setIsCartOpen] = useState(false);

    const cartItems = cart?.items ?? {};
    const cartCount = Number(cart?.count ?? 0);

    const openCart = () => {
        console.log('🔥 OPEN CART');
        setIsCartOpen(true);
    };

    const closeCart = () => {
        console.log('🔥 CLOSE CART');
        setIsCartOpen(false);
    };

    const addProductToCart = ({
        productId,
        quantity = 1,
        variant = null,
    }) => {

        console.log('🔥 ADD PRODUCT');
        console.log('productId:', productId);
        console.log('quantity:', quantity);
        console.log('variant:', variant);

        return addToCart(
            productId,
            quantity,
            variant,
            {
                onSuccess: () => {
                    console.log('🔥 CART ADD SUCCESS');
                    openCart();
                },

                onError: (errors) => {
                    console.log('❌ CART ADD ERROR:', errors);
                },
            }
        );
    };

    return (
        <CartContext.Provider
            value={{
                isCartOpen,
                cartItems,
                cartCount,

                openCart,
                closeCart,

                addProductToCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {

    const context = useContext(CartContext);

    if (!context) {
        throw new Error(
            'useCart must be used inside CartProvider'
        );
    }

    return context;
}

