
import {
    ShoppingBag,
    User,
    Bell,
} from 'lucide-react';

import {
    Link,
    usePage,
} from '@inertiajs/react';

import CartBadge from './CartBadge';

export default function MobileHeader({ user, onOpenCart }) {
    const { cart = {} } = usePage().props;

    const cartCount = Number(cart?.count ?? 0);

    return (
        <header
            className="
                fixed inset-x-0 top-0 z-40
                flex items-center justify-between
                bg-transparent
                px-5 py-4
                md:hidden
            "
        >

            {/* LEFT SIDE */}
            <div className="flex items-center gap-4">

                {/* User */}
                <Link
                    href={user ? '/profile' : '/login'}
                    className="
                        transition-transform duration-300
                        hover:-translate-y-1
                        active:scale-95
                    "
                >
                    {user?.avatar ? (
                        <img
                            src={user.avatar}
                            alt={user.name || 'Avatar'}
                            className="
                                h-9 w-9
                                rounded-full
                                border border-white/30
                                object-cover
                            "
                        />
                    ) : (
                        <User
                            className="
                                h-5 w-5
                                text-primary
                                drop-shadow-md
                            "
                        />
                    )}
                </Link>


                {/* Cart */}
                <button
                    type="button"
                    onClick={onOpenCart}
                    className="
        relative
        rounded-full
        border border-white/30
        bg-white/10
        p-3
        transition
        hover:border-white
        hover:bg-white/20
    "
                >
                    <ShoppingBag className="h-4 w-4" />

                    <CartBadge count={cartCount} />
                </button>
            </div>


            {/* RIGHT SIDE */}
            <div className="flex items-center gap-4">

                {/* Notifications */}
                <button
                    type="button"
                    className="
                        relative
                        transition-transform duration-300
                        hover:-translate-y-1
                        active:scale-95
                    "
                >
                    <Bell
                        className="
                            h-5 w-5
                            text-primary
                            drop-shadow-md
                        "
                    />

                    <span
                        className="
                            absolute
                            right-0
                            top-0
                            h-2 w-2
                            rounded-full
                            bg-red-600
                        "
                    />
                </button>

            </div>
        </header>
    );
}

