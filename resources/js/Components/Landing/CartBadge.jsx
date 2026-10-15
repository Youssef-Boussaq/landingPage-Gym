import React from 'react';

export default function CartBadge({ count }) {
    const cartCount = Number(count ?? 0);

    if (cartCount <= 0) return null;

    return (
        <span className="absolute -top-1.5 -right-1.5 z-20 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[10px] font-bold leading-none text-slate-900 shadow-sm pointer-events-none">
            {cartCount > 99 ? '99+' : cartCount}
        </span>
    );
}