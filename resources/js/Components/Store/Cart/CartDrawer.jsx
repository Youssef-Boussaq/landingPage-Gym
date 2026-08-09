import React from 'react';
import { X, ShoppingBag } from 'lucide-react';

export default function CartDrawer({
    isOpen,
    onClose,
    items = {},
    count = 0,
}) {

    const cartItems = Object.values(items);

    const subtotal = cartItems.reduce(
        (total, item) =>
            total +
            Number(item.price) *
            Number(item.quantity),
        0
    );

    return (
        <>
            {/* Overlay */}
            <div
                onClick={onClose}
                className={`
                    fixed
                    inset-0
                    z-[90]
                    bg-black/40
                    backdrop-blur-[2px]
                    transition-opacity
                    duration-300

                    ${isOpen
                        ? 'visible opacity-100'
                        : 'pointer-events-none invisible opacity-0'
                    }
                `}
            />

            {/* Drawer */}
            <aside
                className={`
                    fixed
                    right-0
                    top-0
                    z-[100]

                    flex
                    h-screen
                    w-full
                    max-w-md
                    flex-col

                    bg-white
                    shadow-2xl

                    transition-transform
                    duration-300
                    ease-in-out

                    ${isOpen
                        ? 'translate-x-0'
                        : 'translate-x-full'
                    }
                `}
            >

                {/* Header */}
                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-between
                        border-b
                        border-slate-200
                        px-6
                        py-5
                    "
                >

                    <div>

                        <h2
                            className="
                                font-archivo
                                text-xl
                                font-black
                                text-slate-900
                            "
                        >
                            Mon panier
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            {count} article{count > 1 ? 's' : ''}
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-full
                            bg-slate-100
                            transition
                            hover:bg-slate-200
                        "
                    >
                        <X className="h-5 w-5" />
                    </button>

                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">

                    {count === 0 ? (

                        <div
                            className="
                                flex
                                h-full
                                flex-col
                                items-center
                                justify-center
                                px-8
                                text-center
                            "
                        >
                            <ShoppingBag
                                className="
                                    h-12
                                    w-12
                                    text-slate-300
                                "
                            />

                            <h3
                                className="
                                    mt-4
                                    font-bold
                                    text-slate-900
                                "
                            >
                                Votre panier est vide
                            </h3>

                        </div>

                    ) : (

                        cartItems.map((item) => (

                            <div
                                key={`${item.id}-${item.variant_id ?? 'default'}`}
                                className="
                                    border-b
                                    border-slate-100
                                    px-6
                                    py-5
                                "
                            >

                                <div className="flex justify-between gap-4">

                                    <div>

                                        <h3 className="text-sm font-semibold">
                                            {item.title}
                                        </h3>

                                        <p className="mt-1 text-xs text-slate-500">
                                            Quantité : {item.quantity}
                                        </p>

                                    </div>

                                    <p className="font-bold">
                                        {(
                                            Number(item.price) *
                                            Number(item.quantity)
                                        ).toFixed(2)}{' '}
                                        DH
                                    </p>

                                </div>

                            </div>

                        ))

                    )}

                </div>

                {/* Footer */}
                {count > 0 && (

                    <div
                        className="
                            shrink-0
                            border-t
                            border-slate-200
                            bg-white
                            px-6
                            py-5
                        "
                    >

                        <div className="flex justify-between">

                            <span className="text-sm text-slate-500">
                                Sous-total
                            </span>

                            <span className="font-black">
                                {subtotal.toFixed(2)} DH
                            </span>

                        </div>

                        <button
                            type="button"
                            className="
                                mt-5
                                w-full
                                rounded-full
                                bg-black
                                px-5
                                py-4
                                text-sm
                                font-bold
                                text-white
                                transition
                                hover:bg-slate-800
                            "
                        >
                            PASSER LA COMMANDE
                        </button>

                    </div>
                )}

            </aside>
        </>
    );
}