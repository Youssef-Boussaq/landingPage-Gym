import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

export default function CartSummary({ items, onClose }) {
    const subtotal = items.reduce((total, item) => {
        return total + (
            Number(item.price ?? 0) *
            Number(item.quantity ?? 0)
        );
    }, 0);

    return (
        <div
            className="
                shrink-0
                border-t border-slate-100
                bg-white
                px-6 py-5
            "
        >

            {/* Order summary */}
            <div className="space-y-3">

                <div className="flex justify-between text-sm">
                    <span className="text-slate-600">
                        Sub Total
                    </span>

                    <span className="font-medium text-slate-900">
                        US${subtotal.toFixed(2)}
                    </span>
                </div>


                <div className="flex justify-between text-sm">
                    <span className="text-slate-600">
                        Standard Shipping
                    </span>

                    <span className="font-medium text-slate-900">
                        Free
                    </span>
                </div>


                <div
                    className="
                        flex justify-between
                        border-t border-slate-100
                        pt-3
                    "
                >
                    <span className="font-bold text-slate-900">
                        Total
                    </span>

                    <span className="font-black text-slate-900">
                        US${subtotal.toFixed(2)}
                    </span>
                </div>

            </div>


            {/* Checkout */}
            <Link
                href="/checkout"
                className="
                    mt-5
                    flex w-full
                    items-center justify-center
                    gap-2
                    rounded-full
                    bg-black
                    px-6 py-4
                    text-sm
                    font-bold
                    text-white
                    transition
                    hover:bg-slate-800
                "
            >
                CHECKOUT SECURELY

                <ArrowRight className="h-4 w-4" />
            </Link>


            {/* Full cart */}
            <Link
                href="/store/cart"
                onClick={onClose}
                className="
                    mt-3
                    flex w-full
                    items-center justify-center
                    text-xs
                    font-semibold
                    text-slate-500
                    underline
                    underline-offset-4
                    transition
                    hover:text-slate-900
                "
            >
                View full cart
            </Link>

        </div>
    );
}