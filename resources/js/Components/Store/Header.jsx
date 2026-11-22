import React, { useState } from 'react';
import { ShoppingBag, Search, Heart, User } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import DesktopNavigation from '@/Components/Store/Navigation/DesktopNavigation';
import MobileMenu from '@/Components/Store/Navigation/MobileMenu';
import CartBadge from '@/Components/Store/Cart/CartBadge';
import NotificationBell from '@/Components/Notification/NotificationBell';
import HeaderLogo from '../Logo';

export default function Header({ onOpenCart }) {
    const { categories = [], cart = {}, auth } = usePage().props;
    const cartCount = Number(cart?.count ?? 0);
    const currentUser = auth?.user ?? null;

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((current) => !current);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-40 bg-white">
            {/* Announcement Bar: #000000 background, 9px white text */}
            <div className="w-full bg-black py-1.5 px-4 text-center">
                <p className="text-[9px] sm:text-[10px] font-normal tracking-[0.05em] text-white uppercase">
                    LIVRAISON GRATUITE SUR TOUTES LES COMMANDES DÈS 250 DH • RETOURS SOUS 14 JOURS
                </p>
            </div>

            {/* Main Header Container with Hairline 1px bottom border in #000000 */}
            <div className="w-full border-b border-black bg-white">
                <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 sm:px-8 py-3">
                    
                    {/* LEFT: Category Links & Mobile Trigger */}
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={toggleMobileMenu}
                            aria-label={isMobileMenuOpen ? 'Fermer menu' : 'Ouvrir menu'}
                            className="flex h-8 w-8 items-center justify-center text-black lg:hidden"
                        >
                            <span className="text-lg">
                                {isMobileMenuOpen ? '✕' : '☰'}
                            </span>
                        </button>

                        <div className="hidden lg:flex">
                            <DesktopNavigation categories={categories} />
                        </div>
                    </div>

                    {/* CENTER: Wordmark */}
                    <div className="flex-1 lg:flex-initial text-center">
                        <HeaderLogo />
                    </div>

                    {/* RIGHT: Icon Cluster */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link
                            href="/store"
                            aria-label="Recherche"
                            className="p-1.5 text-black hover:opacity-60 transition-opacity"
                        >
                            <Search className="h-4 w-4 stroke-[1.5]" />
                        </Link>

                        <button
                            type="button"
                            aria-label="Favoris"
                            className="p-1.5 text-black hover:opacity-60 transition-opacity"
                        >
                            <Heart className="h-4 w-4 stroke-[1.5]" />
                        </button>

                        <Link
                            href={currentUser ? '/profile' : '/login'}
                            aria-label={currentUser ? 'Profil' : 'Connexion'}
                            className="p-1.5 text-black hover:opacity-60 transition-opacity"
                        >
                            <User className="h-4 w-4 stroke-[1.5]" />
                        </Link>

                        <div className="p-1.5 text-black hover:opacity-60 transition-opacity">
                            <NotificationBell variant="light" />
                        </div>

                        <button
                            type="button"
                            onClick={onOpenCart}
                            aria-label="Panier"
                            className="relative flex items-center justify-center p-1.5 text-black hover:opacity-60 transition-opacity"
                        >
                            <ShoppingBag className="h-4 w-4 stroke-[1.5]" />
                            <CartBadge count={cartCount} />
                        </button>
                    </div>

                </div>

                {/* MOBILE MENU */}
                {isMobileMenuOpen && (
                    <div className="border-t border-black py-4 px-4 bg-white lg:hidden">
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
