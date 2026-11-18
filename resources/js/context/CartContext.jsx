import { createContext, useContext, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { addToCart } from '@/services/cartService';

const CartContext = createContext(null);

export function CartProvider({ children }) {

    const { cart = {} } = usePage().props;

    const [isCartOpen, setIsCartOpen] = useState(false);

    const cartItems = cart?.items ?? {};
    const cartCount = Number(cart?.count ?? 0);

    const openCart = () => {
        setIsCartOpen(true);
    };

    const closeCart = () => {
        setIsCartOpen(false);
    };

    const addProductToCart = ({
        productId,
        quantity = 1,
        variant = null,
    }) => {

        return addToCart(
            productId,
            quantity,
            variant,
            {
                onSuccess: () => {
                    openCart();
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

