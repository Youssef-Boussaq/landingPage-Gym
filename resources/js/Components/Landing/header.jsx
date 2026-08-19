import React from 'react';

import {
    Search,
    Heart,
    User,
} from 'lucide-react';

import {
    Link,
    usePage,
} from '@inertiajs/react';

import HeaderLogo from '../Logo';
import CartButton from '../Store/Cart/CartButton';
import NotificationBell from '@/Components/Notification/NotificationBell';


export default function Header({ user, onOpenCart }) {

    /*
    |--------------------------------------------------------------------------
    | Inertia Props
    |--------------------------------------------------------------------------
    */

    const { props } = usePage();

    const auth = props?.auth;
    const cart = props?.cart ?? {};

    /*
    |--------------------------------------------------------------------------
    | User
    |--------------------------------------------------------------------------
    |
    | We use auth.user as the main source.
    | Fallback to the user prop if needed.
    |
    */

    const currentUser = auth?.user ?? user ?? null;

    /*
    |--------------------------------------------------------------------------
    | Cart
    |--------------------------------------------------------------------------
    */

    const cartCount = Number(cart?.count ?? 0);

    /*
    |--------------------------------------------------------------------------
    | Current URL
    |--------------------------------------------------------------------------
    */

    const currentPath = String(
        window.location?.pathname ?? ''
    );

    const isStoreActive = currentPath.startsWith('/store');

    /*
    |--------------------------------------------------------------------------
    | Navigation
    |--------------------------------------------------------------------------
    */

    const navLinks = [
        {
            name: 'Programs',
            href: '/#programs',
        },
        {
            name: 'Testimonials',
            href: '/#testimonials',
        },
        {
            name: 'Store',
            href: '/store',
        },
    ];

    return (
        <header
            className="
                group absolute inset-x-0 top-0 z-30
                hidden w-full
                bg-gradient-to-b
                from-black/80
                via-black/40
                to-transparent
                py-4
                transition-all
                duration-300
                hover:bg-white
                md:block
            "
        >
            <div
                className="
                    mx-auto
                    flex max-w-7xl
                    items-center
                    justify-between
                    px-6
                    lg:px-8
                "
            >

                {/* ======================================================
                    LOGO
                ====================================================== */}

                <HeaderLogo />


                {/* ======================================================
                    NAVIGATION
                ====================================================== */}

                <nav className="flex items-center gap-8">

                    {navLinks.map((link) => {

                        const active =
                            link.name === 'Store'
                                ? isStoreActive
                                : false;

                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`
                                    text-sm
                                    font-medium
                                    transition-colors
                                    duration-300

                                    ${active
                                        ? 'text-[#9de500]'
                                        : `
                                                text-white/90
                                                group-hover:text-slate-700
                                                hover:text-[#82be00]
                                            `
                                    }
                                `}
                            >
                                {link.name}
                            </Link>
                        );
                    })}

                </nav>


                {/* ======================================================
                    ACTIONS
                ====================================================== */}

                <div className="flex items-center gap-3">

                    {/* --------------------------------------------------
                        Search
                    -------------------------------------------------- */}

                    <button
                        type="button"
                        aria-label="Search"
                        className="
                            rounded-full
                            border border-white/30
                            bg-white/10
                            p-3
                            text-white
                            transition

                            hover:border-white
                            hover:bg-white/20

                            group-hover:text-slate-700
                        "
                    >
                        <Search className="h-4 w-4" />
                    </button>


                    {/* --------------------------------------------------
                        Wishlist
                    -------------------------------------------------- */}

                    <button
                        type="button"
                        aria-label="Wishlist"
                        className="
                            rounded-full
                            border border-white/30
                            bg-white/10
                            p-3
                            text-white
                            transition

                            hover:border-white
                            hover:bg-white/20

                            group-hover:text-slate-700
                        "
                    >
                        <Heart className="h-4 w-4" />
                    </button>


                    {/* --------------------------------------------------
                        User
                    -------------------------------------------------- */}

                    <Link
                        href={
                            currentUser
                                ? '/profile'
                                : '/login'
                        }
                        aria-label={
                            currentUser
                                ? 'Profile'
                                : 'Login'
                        }
                        className="
                            rounded-full
                            border border-white/30
                            bg-white/10
                            p-3
                            text-white
                            transition

                            hover:border-white
                            hover:bg-white/20

                            group-hover:text-slate-700
                        "
                    >
                        <User className="h-4 w-4" />
                    </Link>


                    {/* --------------------------------------------------
                        Notifications
                    -------------------------------------------------- */}





                    {/* --------------------------------------------------
                        Cart
                    -------------------------------------------------- */}

                    <CartButton
                        onClick={onOpenCart}
                    />
                    <NotificationBell variant="dark" />

                </div>
            </div>
        </header>
    );
}