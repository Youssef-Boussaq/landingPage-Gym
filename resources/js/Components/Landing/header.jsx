import React from 'react';
import { Search, Heart, User } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import HeaderLogo from '../Logo';
import CartButton from '../Store/Cart/CartButton';
import NotificationBell from '@/Components/Notification/NotificationBell';

export default function Header({ user, onOpenCart }) {
    const { props } = usePage();
    const auth = props?.auth;
    const currentUser = auth?.user ?? user ?? null;
    const currentPath = String(window.location?.pathname ?? '');
    const isStoreActive = currentPath.startsWith('/store');

    const navLinks = [
        { name: 'SHOP', href: '/store' },
        { name: 'PROGRAMMES', href: '/#programs' },
        { name: 'SERVICES', href: '/#services' },
        { name: 'TRANSFORMATIONS', href: '/#testimonials' },
    ];

    const actionIconClass =
        'p-2 text-black hover:opacity-60 transition-opacity duration-150 flex items-center justify-center';

    return (
        <header className="fixed top-0 inset-x-0 z-50 w-full bg-white shadow-none">
            {/* Announcement Bar: #000000 background, 9px white text */}
            <div className="w-full bg-black py-1.5 px-4 text-center">
                <p className="text-[9px] sm:text-[10px] font-normal tracking-[0.05em] text-white uppercase">
                    LIVRAISON GRATUITE SUR TOUTES LES COMMANDES DÈS 250 DH • RETOURS 14 JOURS
                </p>
            </div>

            {/* Top Navigation Bar: Hairline 1px bottom border in #000000 */}
            <div className="w-full border-b border-black bg-white">
                <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 sm:px-8 py-3">
                    
                    {/* LEFT: Category Links */}
                    <nav className="hidden md:flex items-center gap-7">
                        {navLinks.map((link) => {
                            const active = link.name === 'SHOP' ? isStoreActive : false;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`text-[12px] font-medium tracking-[0.025em] transition-opacity duration-150 uppercase ${
                                        active ? 'text-black font-bold' : 'text-black hover:opacity-60'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* CENTER: Wordmark */}
                    <div className="flex-1 md:flex-initial text-center md:text-center">
                        <HeaderLogo />
                    </div>

                    {/* RIGHT: Icon cluster */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/store"
                            aria-label="Recherche"
                            className={actionIconClass}
                        >
                            <Search className="h-4 w-4 stroke-[1.5]" />
                        </Link>

                        <button
                            type="button"
                            aria-label="Favoris"
                            className={actionIconClass}
                        >
                            <Heart className="h-4 w-4 stroke-[1.5]" />
                        </button>

                        <Link
                            href={currentUser ? '/profile' : '/login'}
                            aria-label={currentUser ? 'Profil' : 'Connexion'}
                            className={actionIconClass}
                        >
                            <User className="h-4 w-4 stroke-[1.5]" />
                        </Link>

                        <div className={actionIconClass}>
                            <NotificationBell variant="light" />
                        </div>

                        <div className="flex items-center">
                            <CartButton onClick={onOpenCart} />
                        </div>
                    </div>

                </div>
            </div>
        </header>
    );
}
