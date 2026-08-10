import React from 'react';
import { X, ShoppingBag } from 'lucide-react';

import CartItem from './CartItem';
import CartSummary from './CartSummary';
import { useState ,useEffect} from 'react';

import { updateCartQuantity } from '../../../services/cartService';

export default function CartDrawer({ isOpen, onClose, items = {}, count = 0 }) {
  const [cartItems, setCartItems] = useState(() => Object.values(items ?? {}));
  useEffect(() => {
    setCartItems(Object.values(items ?? {}));
}, [items]);

    const handleQuantityChange = (item, newQuantity) => {
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
        item.variant_id
    );
};

    return (
        <>
            {/* Overlay */}
            <div
                onClick={onClose}
                className={`fixed inset-0 z-[90] bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
                    isOpen
                        ? 'visible opacity-100'
                        : 'pointer-events-none invisible opacity-0'
                } `}
            />

            {/* Drawer */}
            <aside
                className={`fixed right-0 top-0 z-[100] flex h-screen w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                } `}
            >
                {/* Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-5">
                    <div>
                        <h2 className="font-archivo text-xl font-black text-slate-900">
                            Mon panier
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            {count} article{count > 1 ? 's' : ''}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 transition hover:bg-slate-200"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {count === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center px-8 text-center">
                            <ShoppingBag className="h-12 w-12 text-slate-300" />

                            <h3 className="mt-4 font-bold text-slate-900">
                                Votre panier est vide
                            </h3>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onQuantityChange={handleQuantityChange}
                            />
                        ))
                    )}
                </div>

                {/* Footer */}
                {count > 0 && <CartSummary items={cartItems} />}
            </aside>
        </>
    );
}
