import React from 'react';
import { Minus, Plus } from 'lucide-react';

export default function ProductQuantity({ quantity, onQuantityChange, max = 99 }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white font-inter">
                Quantité
            </label>
            <div className="flex items-center w-max rounded-2xl border border-slate-200/80 bg-slate-100/50 dark:border-slate-800 dark:bg-slate-900/50 backdrop-blur-md p-1 transition-all">
                <button
                    type="button"
                    onClick={() => onQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    aria-label="Diminuer la quantité"
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent disabled:active:scale-100 transition-all"
                >
                    <Minus className="h-4 w-4" strokeWidth={2.5} />
                </button>

                <input
                    type="number"
                    min="1"
                    max={max}
                    value={quantity}
                    onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
                    className="h-10 w-14 border-0 bg-transparent p-0 text-center text-base font-extrabold text-slate-900 dark:text-white focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />

                <button
                    type="button"
                    onClick={() => onQuantityChange(quantity + 1)}
                    disabled={quantity >= max}
                    aria-label="Augmenter la quantité"
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent disabled:active:scale-100 transition-all"
                >
                    <Plus className="h-4 w-4" strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
}