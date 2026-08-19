import React from 'react';
import { ShoppingCart } from 'lucide-react';

export default function CartIcon({
    className = 'h-5 w-5',
}) {
    return (
        <ShoppingCart
            className={className}
            aria-hidden="true"
        />
    );
}