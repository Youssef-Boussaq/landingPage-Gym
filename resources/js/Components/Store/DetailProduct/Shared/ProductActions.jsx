import React from 'react';

export default function ProductActions({
    onAddToCart,
    onBuyNow,
    isOutOfStock = false,
}) {
    return (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row font-favorit">
            <button
                type="button"
                onClick={onAddToCart}
                disabled={isOutOfStock}
                className="ghost-cta-btn flex-1 py-3.5 text-center text-[12px] font-medium uppercase tracking-[0.025em] disabled:opacity-40"
            >
                Ajouter au panier
            </button>

            <button
                type="button"
                onClick={onBuyNow}
                disabled={isOutOfStock}
                className="filled-action-btn flex-1 py-3.5 text-center text-[12px] font-medium uppercase tracking-[0.025em] disabled:opacity-40"
            >
                Acheter maintenant
            </button>
        </div>
    );
}