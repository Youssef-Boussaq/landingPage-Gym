

import { User } from 'lucide-react';
import { Link } from '@inertiajs/react';

import CartButton from '../Store/Cart/CartButton';
import NotificationBell from '../Notification/NotificationBell';

export default function MobileHeader({
    user,
    cartCount = 0,
    onOpenCart,
}) {
    const profileHref = user ? '/profile' : '/login';
    const profileLabel = user ? 'Profile' : 'Login';

    return (
        <header
            className="
                fixed
                inset-x-0
                top-0
                z-40
                flex
                items-center
                justify-between
                bg-white/90
                backdrop-blur-md
                border-b
                border-black/5
                px-5
                py-4
                md:hidden
            "
        >
            {/* LEFT */}
            <div className="flex items-center gap-4">
                <Link
                    href={profileHref}
                    aria-label={profileLabel}
                    className="
                        transition-transform
                        duration-300
                        hover:-translate-y-1
                        active:scale-95
                    "
                >
                    {user?.avatar ? (
                        <img
                            src={user.avatar}
                            alt={user.name || 'Avatar'}
                            width="36"
                            height="36"
                            decoding="async"
                            className="
                                h-9
                                w-9
                                rounded-full
                                border
                                border-black/10
                                object-cover
                            "
                        />
                    ) : (
                        <User
                            aria-hidden="true"
                            className="
                                h-5
                                w-5
                                text-primary
                                drop-shadow-md
                            "
                        />
                    )}
                </Link>

                <CartButton
                    onClick={onOpenCart}
                    count={cartCount}
                />
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4">
                <NotificationBell variant="dark" />
            </div>
        </header>
    );

}