import React from 'react';

export default function ProductQuantity({ quantity, onQuantityChange, max = 99 }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-900 font-inter">Quantité</label>
            <div className="flex items-center w-max rounded-xl border border-slate-200 bg-white shadow-sm">
                <button
                    type="button"
                    onClick={() => onQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="flex h-12 w-12 items-center justify-center rounded-l-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 transition-colors"
                >
                    <span className="text-xl font-medium">−</span>
                </button>
                <input
                    type="number"
                    min="1"
                    max={max}
                    value={quantity}
                    onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
                    className="h-12 w-16 border-0 bg-transparent p-0 text-center text-lg font-semibold text-slate-900 focus:ring-0"
                />
                <button
                    type="button"
                    onClick={() => onQuantityChange(quantity + 1)}
                    disabled={quantity >= max}
                    className="flex h-12 w-12 items-center justify-center rounded-r-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 transition-colors"
                >
                    <span className="text-xl font-medium">+</span>
                </button>
            </div>
        </div>
    );
}
