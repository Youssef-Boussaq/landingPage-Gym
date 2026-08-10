import React from 'react';

export default function CartSummary({ items = [] }) {

    const subtotal = items.reduce(
        (total, item) =>
            total +
            Number(item.price) *
            Number(item.quantity),
        0
    );

    return (
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
            {/* Subtotal */}
            <div className="flex justify-between">
                <span className="text-sm text-slate-500">
                    Sous-total
                </span>

                <span className="font-black text-slate-900">
                    {subtotal.toFixed(2)} DH
                </span>
            </div>

            {/* Checkout */}
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
    );
}