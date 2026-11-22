import React from 'react';
import { SlidersHorizontal, RotateCcw, X, Loader2 } from 'lucide-react';

export default function FilterHeader({ isPending, onClose, onReset }) {
    return (
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
            <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-slate-900 text-primary flex items-center justify-center">
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <SlidersHorizontal className="w-4 h-4" />}
                </div>
                <div>
                    <h3 className="text-base font-black text-slate-900">Filtres</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Affinez vos résultats</p>
                </div>
            </div>

            <div className="flex items-center gap-1">
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fermer les filtres"
                        className="p-2 text-slate-400 hover:text-slate-900 rounded-lg lg:hidden"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}
                <button
                    type="button"
                    onClick={onReset}
                    disabled={isPending}
                    aria-label="Réinitialiser les filtres"
                    className="p-2 text-slate-400 hover:text-slate-900 rounded-lg disabled:opacity-50"
                >
                    <RotateCcw className={`w-3.5 h-3.5 ${isPending ? 'animate-spin' : ''}`} />
                </button>
            </div>
        </div>
    );
}