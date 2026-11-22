import React, { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import {
    X,
    Search,
    ChevronRight,
    User,
    Shield,
    LogOut,
    ShoppingBag,
    Dumbbell,
    Layers,
    Sparkles,
    Phone,
} from 'lucide-react';

export default function MobileNavDrawer({
    isOpen,
    onClose,
    user = null,
    categories = [],
    navLinks = [
        { name: 'SHOP', href: '/store' },
        { name: 'PROGRAMMES', href: '/#programs' },
        { name: 'SERVICES', href: '/#services' },
        { name: 'TRANSFORMATIONS', href: '/#testimonials' },
        { name: 'CONTACT', href: '/#contact' },
    ],
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoriesExpanded, setCategoriesExpanded] = useState(false);

    // Prevent body scrolling when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            onClose();
            router.visit(`/store?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] font-favorit">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Slide-over panel */}
            <aside
                role="dialog"
                aria-modal="true"
                aria-label="Menu de navigation mobile"
                className="fixed top-0 left-0 bottom-0 flex w-[85vw] max-w-sm flex-col bg-white border-r border-black shadow-2xl transition-transform duration-300 ease-out"
            >
                {/* Header */}
                <div className="flex h-14 sm:h-16 items-center justify-between border-b border-black px-5 bg-white">
                    <Link
                        href="/"
                        onClick={onClose}
                        className="text-base sm:text-lg font-black uppercase tracking-[0.08em] text-black"
                    >
                        FIT YOUNESS
                    </Link>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fermer le menu"
                        className="flex h-10 w-10 items-center justify-center -mr-2 text-black hover:opacity-60 transition"
                    >
                        <X className="h-5 w-5 stroke-[2]" />
                    </button>
                </div>

                {/* Drawer Content */}
                <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
                    {/* Search Bar */}
                    <form onSubmit={handleSearchSubmit} className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Rechercher un produit ou guide..."
                            className="w-full rounded-none border border-black bg-[#f0efe7]/40 py-2.5 pl-3.5 pr-10 text-xs text-black placeholder:text-[#888888] focus:border-black focus:outline-none focus:ring-0"
                        />
                        <button
                            type="submit"
                            aria-label="Lancer la recherche"
                            className="absolute right-0 top-0 flex h-full w-10 items-center justify-center text-black hover:opacity-60"
                        >
                            <Search className="h-4 w-4 stroke-[1.5]" />
                        </button>
                    </form>

                    {/* Main Navigation Links */}
                    <nav className="space-y-1 border-t border-black/10 pt-4">
                        <span className="block text-[10px] font-bold uppercase tracking-[0.1em] text-[#888888] mb-2 px-1">
                            Navigation
                        </span>

                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={onClose}
                                className="flex items-center justify-between py-3 px-1 text-sm font-bold uppercase tracking-[0.05em] text-black border-b border-[#e5e7eb] hover:pl-2 transition-all duration-150"
                            >
                                <span>{link.name}</span>
                                <ChevronRight className="h-4 w-4 text-[#888888]" />
                            </Link>
                        ))}

                        {/* Optional Categories Accordion */}
                        {categories.length > 0 && (
                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={() => setCategoriesExpanded((prev) => !prev)}
                                    className="flex w-full items-center justify-between py-3 px-1 text-sm font-bold uppercase tracking-[0.05em] text-black border-b border-[#e5e7eb]"
                                >
                                    <span className="flex items-center gap-2">
                                        <Layers className="h-4 w-4 text-black" />
                                        Rayons de la boutique
                                    </span>
                                    <span className="text-xs">{categoriesExpanded ? '−' : '+'}</span>
                                </button>

                                {categoriesExpanded && (
                                    <div className="bg-[#f0efe7]/60 p-2 space-y-1 border-b border-[#e5e7eb]">
                                        <Link
                                            href="/store"
                                            onClick={onClose}
                                            className="block py-2 px-3 text-xs font-semibold uppercase tracking-wider text-black hover:bg-white transition"
                                        >
                                            Tous les produits
                                        </Link>
                                        {categories.map((cat) => (
                                            <Link
                                                key={cat.id}
                                                href={`/store?category=${cat.id}`}
                                                onClick={onClose}
                                                className="block py-2 px-3 text-xs font-medium uppercase tracking-wider text-[#444444] hover:bg-white hover:text-black transition"
                                            >
                                                {cat.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </nav>

                    {/* User Account / Identity Section */}
                    <div className="border-t border-black/10 pt-4 space-y-2">
                        <span className="block text-[10px] font-bold uppercase tracking-[0.1em] text-[#888888] mb-2 px-1">
                            Espace Personnel
                        </span>

                        {user?.role === 'admin' ? (
                            <div className="space-y-2">
                                <Link
                                    href="/admin"
                                    onClick={onClose}
                                    className="flex items-center justify-between bg-black p-3 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition"
                                >
                                    <span className="flex items-center gap-2">
                                        <Shield className="h-4 w-4" />
                                        Panneau d'administration
                                    </span>
                                    <ChevronRight className="h-4 w-4" />
                                </Link>

                                <Link
                                    href="/profile"
                                    onClick={onClose}
                                    className="flex items-center justify-between border border-black p-3 text-black text-xs font-bold uppercase tracking-wider hover:bg-[#f0efe7] transition"
                                >
                                    <span className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Mon Profil ({user.name})
                                    </span>
                                    <ChevronRight className="h-4 w-4 text-[#888888]" />
                                </Link>
                            </div>
                        ) : user ? (
                            <div className="space-y-2">
                                <Link
                                    href="/profile"
                                    onClick={onClose}
                                    className="flex items-center justify-between border border-black bg-[#f0efe7] p-3 text-black text-xs font-bold uppercase tracking-wider hover:bg-white transition"
                                >
                                    <span className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Mon Profil ({user.name})
                                    </span>
                                    <ChevronRight className="h-4 w-4 text-[#888888]" />
                                </Link>

                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    onClick={onClose}
                                    className="flex w-full items-center justify-center gap-2 py-2.5 text-xs font-semibold uppercase tracking-wider text-rose-700 hover:underline"
                                >
                                    <LogOut className="h-3.5 w-3.5" />
                                    <span>Se déconnecter</span>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2 pt-1">
                                <Link
                                    href="/login"
                                    onClick={onClose}
                                    className="flex items-center justify-center bg-black py-2.5 px-3 text-center text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition"
                                >
                                    Connexion
                                </Link>

                                <Link
                                    href="/register"
                                    onClick={onClose}
                                    className="flex items-center justify-center border border-black bg-white py-2.5 px-3 text-center text-xs font-bold uppercase tracking-wider text-black hover:bg-[#f0efe7] transition"
                                >
                                    Inscription
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Drawer Footer */}
                <div className="border-t border-black bg-[#f0efe7] p-4 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-black">
                        LIVRAISON GRATUITE DÈS 250 DH
                    </p>
                    <p className="mt-1 text-[10px] text-[#666666] tracking-[0.025em]">
                        Coaching haute performance • Support 7j/7
                    </p>
                </div>
            </aside>
        </div>
    );
}
