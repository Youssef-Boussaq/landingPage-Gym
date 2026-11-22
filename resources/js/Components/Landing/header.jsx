import React, { useState } from 'react';
import { Search, User, Shield, Menu } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import HeaderLogo from '../Logo';
import CartButton from '../Store/Cart/CartButton';
import NotificationBell from '@/Components/Notification/NotificationBell';
import MobileNavDrawer from '@/Components/Navigation/MobileNavDrawer';

export default function Header({ user, onOpenCart }) {
    const { props } = usePage();
    const auth = props?.auth;
    const currentUser = auth?.user ?? user ?? null;
    const currentPath = String(window.location?.pathname ?? '');
    const isStoreActive = currentPath.startsWith('/store');

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const navLinks = [
        { name: 'SHOP', href: '/store' },
        { name: 'PROGRAMMES', href: '/#programs' },
        { name: 'SERVICES', href: '/#services' },
        { name: 'TRANSFORMATIONS', href: '/#testimonials' },
        { name: 'CONTACT', href: '/#contact' },
    ];

    const actionIconClass =
        'p-1.5 sm:p-2 text-black hover:opacity-60 transition-opacity duration-150 flex items-center justify-center';

    return (
        <header className="fixed top-0 inset-x-0 z-50 w-full bg-white shadow-none font-favorit">
            {/* Announcement Bar */}
            <div className="w-full bg-black py-1.5 px-3 text-center">
                <p className="truncate text-[9px] sm:text-[10px] font-normal tracking-[0.05em] text-white uppercase">
                    LIVRAISON GRATUITE SUR TOUTES LES COMMANDES DÈS 250 DH • RETOURS 14 JOURS
                </p>
            </div>

            {/* Top Navigation Bar: Hairline 1px bottom border in #000000 */}
            <div className="w-full border-b border-black bg-white">
                <div className="mx-auto flex h-14 sm:h-16 max-w-[1440px] items-center justify-between px-3 sm:px-8">
                    
                    {/* LEFT: Mobile Hamburger OR Desktop Category Links */}
                    <div className="flex items-center">
                        {/* Mobile Hamburger Button */}
                        <button
                            type="button"
                            onClick={() => setIsDrawerOpen(true)}
                            aria-label="Ouvrir le menu de navigation"
                            className="flex h-10 w-10 items-center justify-center -ml-1 text-black hover:opacity-60 transition md:hidden"
                        >
                            <Menu className="h-5 w-5 stroke-[1.8]" />
                        </button>

                        {/* Desktop Links */}
                        <nav className="hidden md:flex items-center gap-5 lg:gap-7">
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
                    </div>

                    {/* CENTER: Wordmark Logo */}
                    <div className="text-center">
                        <HeaderLogo />
                    </div>

                    {/* RIGHT: Icon cluster */}
                    <div className="flex items-center gap-1 sm:gap-2.5">
                        {/* Search icon (hidden on small mobile, accessible via drawer) */}
                        <Link
                            href="/store"
                            aria-label="Recherche"
                            className={`hidden sm:flex ${actionIconClass}`}
                        >
                            <Search className="h-4 w-4 stroke-[1.5]" />
                        </Link>

                        {/* Admin or Profile Icon */}
                        {currentUser?.role === 'admin' ? (
                            <Link
                                href="/admin"
                                aria-label="Tableau de bord Admin"
                                title="Administration Fit Youness"
                                className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1 text-black bg-[#f0efe7] border border-black text-[11px] font-bold uppercase tracking-[0.05em] hover:bg-black hover:text-white transition-colors"
                            >
                                <Shield className="h-3.5 w-3.5 stroke-[2]" />
                                <span className="hidden md:inline">Admin</span>
                            </Link>
                        ) : currentUser ? (
                            <Link
                                href="/profile"
                                aria-label="Mon Profil"
                                title="Mon Profil Client"
                                className={actionIconClass}
                            >
                                <User className="h-4 w-4 stroke-[1.5]" />
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                aria-label="Connexion"
                                title="Se connecter"
                                className={actionIconClass}
                            >
                                <User className="h-4 w-4 stroke-[1.5]" />
                            </Link>
                        )}

                        {/* Notification Bell */}
                        <div className="relative flex items-center justify-center">
                            <NotificationBell variant="light" />
                        </div>

                        {/* Cart Button */}
                        <div className="flex items-center">
                            <CartButton onClick={onOpenCart} />
                        </div>
                    </div>

                </div>
            </div>

            {/* Slide-over Mobile Navigation Drawer */}
            <MobileNavDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                user={currentUser}
                navLinks={navLinks}
            />
        </header>
    );
}
