import { ShoppingBag } from 'lucide-react';

import CartBadge from './CartBadge';

export default function CartButton({
    onClick,
    count = 0,
    variant = 'light',
    className = '',
}) {
    const baseStyles =
        'relative flex shrink-0 items-center justify-center rounded-full p-2.5 active:scale-95 transition-transform duration-200';

    const variants = {
        light:
            'text-slate-700 hover:text-lime-600 hover:bg-lime-400/10',
        glass:
            'border border-white/30 bg-white/10 text-white hover:border-white hover:bg-white/20',
    };

    return (
        <button
            type="button"
            onClick={onClick}
            aria-label="Panier"
            className={`${baseStyles} ${variants[variant] ?? variants.light} ${className}`}
        >
            <ShoppingBag
                aria-hidden="true"
                className="h-5 w-5"
            />

            <CartBadge count={count} />
        </button>
    );
}
