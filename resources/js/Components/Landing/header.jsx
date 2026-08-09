
import {
    Dumbbell,
    Search,
    Heart,
    User,
    ShoppingBag,
} from 'lucide-react';

import { Link, usePage } from '@inertiajs/react';

import CartBadge from './CartBadge';

export default function Header({ user, onOpenCart }) {
    const { props } = usePage();

    const cartCount = Number(props?.cart?.count ?? 0);



    const currentPath = String(window.location?.pathname ?? '');

    const isCartActive = currentPath.startsWith('/store/cart');
    const isStoreActive = currentPath.startsWith('/store');
    console.log('CURRENT PATH:', currentPath);
    console.log('CART:', props?.cart);
    console.log('CART COUNT:', cartCount);

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
                group absolute inset-x-0 top-0 z-30 hidden w-full
                bg-gradient-to-b from-black/80 via-black/40
                to-transparent
                py-4
                transition-all duration-300
                hover:bg-white
                md:block
            "
        >
            <div
                className="
                    mx-auto flex max-w-7xl
                    items-center justify-between
                    px-6 lg:px-8
                "
            >

                {/* Logo */}
                <Link
                    href="/"
                    className="
                        flex items-center gap-2
                        text-xl font-extrabold uppercase
                        tracking-wider text-white
                        transition-colors duration-300
                        group-hover:text-slate-900
                    "
                >
                    <Dumbbell className="h-6 w-6 text-[#9de500]" />

                    <span>
                        Fit Youness
                    </span>
                </Link>


                {/* Navigation */}
                <nav className="flex items-center gap-8">

                    {navLinks.map((link) => {

                        const active =
                            link.name === 'Store'
                                ? isStoreActive
                                : currentPath.includes(
                                    link.href.replace('/#', '')
                                );

                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`
                                    text-sm font-medium
                                    transition-colors duration-300

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


                {/* Actions */}
                <div className="flex items-center gap-3 text-white">

                    {/* Search */}
                    <button
                        type="button"
                        className="
                            rounded-full
                            border border-white/30
                            bg-white/10
                            p-3
                            transition
                            hover:border-white
                            hover:bg-white/20
                        "
                    >
                        <Search className="h-4 w-4" />
                    </button>


                    {/* Wishlist */}
                    <button
                        type="button"
                        className="
                            rounded-full
                            border border-white/30
                            bg-white/10
                            p-3
                            transition
                            hover:border-white
                            hover:bg-white/20
                        "
                    >
                        <Heart className="h-4 w-4" />
                    </button>


                    {/* User */}
                    <Link
                        href={user ? '/dashboard' : '/login'}
                        className="
                            rounded-full
                            border border-white/30
                            bg-white/10
                            p-3
                            transition
                            hover:border-white
                            hover:bg-white/20
                        "
                    >
                        <User className="h-4 w-4" />
                    </Link>


                    <button
                        type="button"
                        onClick={onOpenCart}
                        className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:border-white hover:bg-white/20"
                    >
                        <ShoppingBag className="h-4 w-4" />
                        <CartBadge count={cartCount} />
                    </button>





                </div>
            </div>
        </header>
    );
}

