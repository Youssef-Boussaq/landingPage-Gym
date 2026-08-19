import React from 'react';

import {
    User,
} from 'lucide-react';

import {
    Link,
    usePage,
} from '@inertiajs/react';

import CartButton from '../Store/Cart/CartButton';
import NotificationBell from '../Notification/NotificationBell';


export default function MobileHeader({
    user,
    onOpenCart,
}) {

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
    */

    const currentUser = auth?.user ?? user ?? null;

    /*
    |--------------------------------------------------------------------------
    | Cart
    |--------------------------------------------------------------------------
    */

    const cartCount = Number(cart?.count ?? 0);

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

                bg-transparent

                px-5
                py-4

                md:hidden
            "
        >

            {/* ==========================================================
                LEFT SIDE
            ========================================================== */}

            <div className="flex items-center gap-4">

                {/* ------------------------------------------------------
                    User
                ------------------------------------------------------ */}

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
                        transition-transform
                        duration-300
                        hover:-translate-y-1
                        active:scale-95
                    "
                >

                    {currentUser?.avatar ? (

                        <img
                            src={currentUser.avatar}
                            alt={
                                currentUser.name ||
                                'Avatar'
                            }
                            className="
                                h-9
                                w-9
                                rounded-full
                                border
                                border-white/30
                                object-cover
                            "
                        />

                    ) : (

                        <User
                            className="
                                h-5
                                w-5
                                text-primary
                                drop-shadow-md
                            "
                        />

                    )}

                </Link>


                {/* ------------------------------------------------------
                    Cart
                ------------------------------------------------------ */}

                <CartButton
                    onClick={onOpenCart}
                />

            </div>


            {/* ==========================================================
                RIGHT SIDE
            ========================================================== */}

            <div className="flex items-center gap-4">

                {/* ------------------------------------------------------
                    Notifications
                ------------------------------------------------------ */}

                <NotificationBell variant="dark" />

            </div>

        </header>
    );
}