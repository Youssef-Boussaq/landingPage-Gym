import { usePage } from '@inertiajs/react';

import Navbar from '@/Components/Landing/Navbar';
import Header from '@/Components/Landing/Header';
import MobileHeader from '@/Components/Landing/MobileHeader';

import CartDrawer from '@/Components/Store/Cart/CartDrawer';


import {
    CartProvider,
    useCart,
} from '@/context/CartContext';


function PublicLayoutContent({ children }) {

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
        <div  >

            < Navbar />

            <Header
                user={user}
                onOpenCart={openCart}
            />

            <MobileHeader
                user={user}
                onOpenCart={openCart}
            />


            {children}

            <CartDrawer
                isOpen={isCartOpen}
                items={cartItems}
                count={cartCount}
                onClose={closeCart}
            />



        </div >
    );
}


export default function PublicLayout({ children }) {

    return (
        <CartProvider>

            <PublicLayoutContent>
                {children}
            </PublicLayoutContent>

        </CartProvider>
    );
}