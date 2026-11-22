import React, { useEffect, useState } from 'react';
import { X, ShoppingBag } from 'lucide-react';

import CartItem from './CartItem';
import CartSummary from './CartSummary';

import {
    updateCartQuantity,
    removeFromCart,
} from '../../../services/cartService';

export default function CartDrawer({
    isOpen,
    onClose,
    items = {},
    count = 0,
}) {
    const [cartItems, setCartItems] = useState(
        () => Object.values(items ?? {})
    );

    useEffect(() => {
        setCartItems(Object.values(items ?? {}));
    }, [items]);

    const handleQuantityChange = (item, newQuantity) => {
        const previousQuantity = Number(item.quantity);

        setCartItems((currentItems) =>
            currentItems.map((currentItem) =>
                currentItem.id === item.id
                    ? {
                        ...currentItem,
                        quantity: newQuantity,
                    }
                    : currentItem
            )
        );

        updateCartQuantity(
            item.id,
            newQuantity,
            item.variant_id,
            {
                onSuccess: () => {
                    // Laravel accepted the quantity.
                },

                onError: (errors) => {
                    setCartItems((currentItems) =>
                        currentItems.map((currentItem) =>
                            currentItem.id === item.id
                                ? {
                                    ...currentItem,
                                    quantity: previousQuantity,
                                }
                                : currentItem
                        )
                    );

                    const message =
                        errors?.quantity ||
                        errors?.cart ||
                        'Impossible de mettre à jour la quantité.';

                    // Temporary user-facing feedback
                    window.alert(message);
                },
            }
        );
    };

    const handleDelete = (item) => {
        removeFromCart(
            item.id,
            item.variant_id,
            {
                onSuccess: () => {
                    setCartItems((currentItems) =>
                        currentItems.filter(
                            (currentItem) =>
                                currentItem.id !== item.id
                        )
                    );
                },
            }
        );
    };

    return (
        <>
            {/* Overlay */}
            <div
                onClick={onClose}
                className={`fixed inset-0 z-[90] bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen
                    ? 'visible opacity-100'
                    : 'pointer-events-none invisible opacity-0'
                    }`}
            />

            {/* Drawer */}
            <aside
                className={`fixed right-0 top-0 z-[100] flex h-screen w-full max-w-md flex-col bg-white border-l border-[#000000] transition-transform duration-300 ease-in-out font-favorit ${isOpen
                    ? 'translate-x-0'
                    : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-[#000000] px-6 py-4">
                    <div>
                        <h2 className="text-[16px] font-bold uppercase tracking-[0.025em] text-[#000000]">
                            Mon panier
                        </h2>

                        <p className="mt-0.5 text-[11px] text-[#666666]">
                            {count} article{count > 1 ? 's' : ''}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fermer le panier"
                        className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-[#e5e7eb] hover:border-[#000000] transition-colors"
                    >
                        <X className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {count === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center px-8 text-center">
                            <ShoppingBag className="h-10 w-10 text-[#cccccc]" strokeWidth={1.5} />

                            <h3 className="mt-4 text-[14px] font-medium text-[#000000] uppercase tracking-[0.025em]">
                                Votre panier est vide
                            </h3>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <CartItem
                                key={`${item.id}-${item.variant_id ?? 'default'}`}
                                item={item}
                                onQuantityChange={handleQuantityChange}
                                onDelete={handleDelete}
                            />
                        ))
                    )}
                </div>

                {/* Footer */}
                {count > 0 && (
                    <CartSummary items={cartItems} />
                )}
            </aside>
        </>
    );
}