import { ShoppingBag } from 'lucide-react';
import CartBadge from './CartBadge';

export default function CartButton({
    onClick,
    count = 0,
    className = '',
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label="Panier"
            className={`relative flex shrink-0 items-center justify-center p-2 text-black hover:opacity-60 transition-opacity duration-150 ${className}`}
        >
            <ShoppingBag
                aria-hidden="true"
                className="h-4 w-4 stroke-[1.5]"
            />
            <CartBadge count={count} />
        </button>
    );
}
