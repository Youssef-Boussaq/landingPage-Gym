import { usePage } from '@inertiajs/react';

import { CartProvider, useCart } from '@/context/CartContext';

import Header from '@/Components/Store/Header';
import CartDrawer from '@/Components/Store/Cart/CartDrawer';
import NotificationToast from '@/Components/Notification/NotificationToast';

function StoreLayoutContent({ children }) {
    const { auth } = usePage().props;

    const user = auth?.user ?? null;

    const {
        isCartOpen,
        cartItems,
        cartCount,
        openCart,
        closeCart,
    } = useCart();

    return (
        <div className="min-h-screen bg-white">
            <Header
                user={user}
                onOpenCart={openCart}
            />

            <main>
                {children}
            </main>

            <CartDrawer
                isOpen={isCartOpen}
                items={cartItems}
                count={cartCount}
                onClose={closeCart}
            />

            <NotificationToast />

        </div>
    );
}

export default function StoreLayout({ children }) {
    return (
        <CartProvider>
            <StoreLayoutContent>
                {children}
            </StoreLayoutContent>
        </CartProvider>
    );
}