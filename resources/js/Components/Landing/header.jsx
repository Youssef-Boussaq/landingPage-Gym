import React from 'react';
import { Search, Heart, User } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import HeaderLogo from '../Logo';
import CartButton from '../Store/Cart/CartButton';
import NotificationBell from '@/Components/Notification/NotificationBell';

export default function Header({ user, onOpenCart }) {
    /*
    |--------------------------------------------------------------------------
    | Inertia Props & Auth
    |--------------------------------------------------------------------------
    */
    const { props } = usePage();
    const auth = props?.auth;
    const cart = props?.cart ?? {};

    const currentUser = auth?.user ?? user ?? null;
    const currentPath = String(window.location?.pathname ?? '');
    const isStoreActive = currentPath.startsWith('/store');

    /*
    |--------------------------------------------------------------------------
    | Navigation Links
    |--------------------------------------------------------------------------
    */
    const navLinks = [
        { name: 'Programs', href: '/#programs' },
        { name: 'Testimonials', href: '/#testimonials' },
        { name: 'Store', href: '/store' },
    ];

    /*
    |--------------------------------------------------------------------------
    | Minimal Ghost Icon Button Style
    |--------------------------------------------------------------------------
    */
    const actionIconClass =
        'p-2.5 rounded-full text-slate-700 hover:text-lime-600 hover:bg-lime-400/10 active:scale-95 transition-all duration-200 flex items-center justify-center';

    return (
        <header className="hidden md:block fixed top-0 inset-x-0 z-50 w-full bg-white/0 border-b border-transparent hover:bg-white hover:border-slate-200/80 transition-all duration-300 group">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5">

                {/* LOGO */}
                <HeaderLogo />

                {/* NAVIGATION */}
                <nav className="flex items-center gap-8">
                    {navLinks.map((link) => {
                        const active = link.name === 'Store' ? isStoreActive : false;

                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-sm font-semibold transition-colors duration-200 ${active
                                        ? 'text-lime-600 font-bold'
                                        : 'text-slate-700 hover:text-black'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* ACTIONS */}
                <div className="flex items-center gap-1 sm:gap-2">
                    {/* Search */}
                    <button
                        type="button"
                        aria-label="Search"
                        className={actionIconClass}
                    >
                        <Search className="h-5 w-5" />
                    </button>

                    {/* Wishlist */}
                    <button
                        type="button"
                        aria-label="Wishlist"
                        className={actionIconClass}
                    >
                        <Heart className="h-5 w-5" />
                    </button>

                    {/* Profile / Auth */}
                    <Link
                        href={currentUser ? '/profile' : '/login'}
                        aria-label={currentUser ? 'Profile' : 'Login'}
                        className={actionIconClass}
                    >
                        <User className="h-5 w-5" />
                    </Link>

                    {/* Notification Bell */}
                    <div className={actionIconClass}>
                        <NotificationBell variant="light" />
                    </div>

                    {/* Cart Button */}
                    <div className={actionIconClass}>
                        <CartButton onClick={onOpenCart} />
                    </div>
                </div>

            </div>
        </header>
    );
}