import React from 'react';

export default function ProductActions({ onAddToCart, onBuyNow, isOutOfStock = false }) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row mt-6">
            <button
                onClick={onAddToCart}
                disabled={isOutOfStock}
                className="flex-1 rounded-xl bg-slate-900 px-8 py-4 text-center font-bold text-white transition-all hover:bg-slate-800 disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0 font-archivo tracking-wide"
            >
                Ajouter au panier
            </button>
            <button
                onClick={onBuyNow}
                disabled={isOutOfStock}
                className="flex-1 rounded-xl bg-[var(--color-primary)] px-8 py-4 text-center font-bold text-slate-900 transition-all hover:bg-[var(--color-primary-hover)] disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0 font-archivo tracking-wide shadow-lg shadow-[var(--color-primary)]/30"
            >
                Acheter maintenant
            </button>
        </div>
    );
}
