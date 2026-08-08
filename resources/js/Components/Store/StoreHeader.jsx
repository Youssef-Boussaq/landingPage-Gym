import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

export default function StoreHeader({ isFilterOpen, onToggleFilter, totalProducts = 0 }) {
    return (
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 sm:pb-5">
            <button
                type="button"
                onClick={onToggleFilter}
                className={`flex items-center gap-1.5 sm:gap-2.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-black transition-all active:scale-95 ${
                    isFilterOpen
                        ? 'bg-primary text-slate-950 shadow-md shadow-primary/20'
                        : 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-100'
                }`}
            >
                <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950" />
                <span>{isFilterOpen ? 'Masquer filtres' : 'Filtrer produits'}</span>
            </button>

            <div className="text-[11px] sm:text-xs font-bold text-slate-500">
                <span className="text-slate-900 font-extrabold">{totalProducts}</span> produits
            </div>
        </div>
    );
}