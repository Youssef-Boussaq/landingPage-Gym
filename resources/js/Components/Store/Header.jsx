import React, { useState } from 'react';

import { ShoppingBag } from 'lucide-react';

import { usePage } from '@inertiajs/react';

import DesktopNavigation from '@/Components/Store/Navigation/DesktopNavigation';
import MobileMenu from '@/Components/Store/Navigation/MobileMenu';
import CartBadge from '@/Components/Store/Cart/CartBadge';
import NotificationBell from '@/Components/Notification/NotificationBell';

import HeaderLogo from '../Logo';


export default function Header({ onOpenCart }) {

    /*
    |--------------------------------------------------------------------------
    | Inertia Props
    |--------------------------------------------------------------------------
    */

    const {
        categories = [],
        cart = {},
    } = usePage().props;


    /*
    |--------------------------------------------------------------------------
    | Cart
    |--------------------------------------------------------------------------
    */

    const cartCount = Number(
        cart?.count ?? 0
    );


    /*
    |--------------------------------------------------------------------------
    | Mobile Menu
    |--------------------------------------------------------------------------
    */

    const [
        isMobileMenuOpen,
        setIsMobileMenuOpen,
    ] = useState(false);


    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((current) => !current);
    };


    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };


    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <header
            className="
                sticky
                top-0
                z-40
                border-b
                border-slate-200
                bg-white
            "
        >

            <div
                className="
                    mx-auto
                    max-w-7xl
                    px-4
                    lg:px-6
                "
            >

                <div
                    className="
                        flex
                        h-20
                        items-center
                        justify-between
                    "
                >

                    {/* ==================================================
                        LEFT
                    ================================================== */}

                    <div className="flex items-center gap-3">

                        {/* Mobile menu button */}

                        <button
                            type="button"
                            onClick={toggleMobileMenu}
                            aria-label={
                                isMobileMenuOpen
                                    ? 'Close menu'
                                    : 'Open menu'
                            }
                            aria-expanded={isMobileMenuOpen}
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-full
                                text-slate-600
                                transition
                                hover:bg-slate-100
                                hover:text-slate-950
                                lg:hidden
                            "
                        >
                            <span className="text-xl">
                                {isMobileMenuOpen ? '✕' : '☰'}
                            </span>
                        </button>


                        {/* Logo */}

                        <HeaderLogo />

                    </div>


                    {/* ==================================================
                        DESKTOP NAVIGATION
                    ================================================== */}

                    <div className="hidden lg:flex">
                        <DesktopNavigation
                            categories={categories}
                        />
                    </div>


                    {/* ==================================================
                        ACTIONS
                    ================================================== */}

                    <div className="flex items-center gap-2">

                        {/* ------------------------------------------------
                            Notifications
                        ------------------------------------------------ */}

                        <NotificationBell />


                        {/* ------------------------------------------------
                            Cart
                        ------------------------------------------------ */}

                        <button
                            type="button"
                            onClick={onOpenCart}
                            aria-label="Panier"
                            className="
                                relative
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-full
                                text-slate-600
                                transition
                                hover:bg-slate-100
                                hover:text-slate-950
                            "
                        >

                            <ShoppingBag className="h-5 w-5" />

                            <CartBadge
                                count={cartCount}
                            />

                        </button>

                    </div>

                </div>


                {/* ======================================================
                    MOBILE NAVIGATION
                ====================================================== */}

                {isMobileMenuOpen && (
                    <div
                        className="
                            border-t
                            border-slate-200
                            py-4
                            lg:hidden
                        "
                    >
                        <MobileMenu
                            categories={categories}
                            onNavigate={closeMobileMenu}
                        />
                    </div>
                )}

            </div>

        </header>
    );
}