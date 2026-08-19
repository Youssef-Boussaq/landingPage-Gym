import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import CartBadge from './CartBadge';

export default function CartButton({ onClick, variant = 'glass', className = '' }) {
    const { cart } = usePage().props;
    const count = Number(cart?.count ?? 0);

    const baseStyles = "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition";

    const variants = {
        glass: "border border-white/30 bg-white/10 text-white hover:border-white hover:bg-white/20",
        light: "text-slate-600 hover:bg-slate-100 hover:text-slate-950 border border-transparent",
    };

    return (
        <button
            type="button"
            onClick={onClick}
            aria-label="Panier"
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            <ShoppingBag className="h-4 w-4" />
            <CartBadge count={count} />
        </button>
    );
}