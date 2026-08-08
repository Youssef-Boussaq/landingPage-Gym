import React from 'react';
import { ShoppingBag } from 'lucide-react';

export default function EmptyProducts({ selectedCategory, onReset }) {
    return (
        <div className="flex flex-col items-center justify-center py-10 px-4 sm:py-16 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/60 text-center shadow-xs max-w-lg mx-auto mt-4 sm:mt-6">
            <ShoppingBag className="w-9 h-9 sm:w-12 sm:h-12 text-primary drop-shadow-xs mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-bold text-slate-800">Aucun produit trouvé</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 sm:mt-2 max-w-sm">
                {selectedCategory
                    ? "Il n'y a pas de produits disponibles dans cette catégorie pour le moment."
                    : "Aucun produit ne correspond à vos critères de recherche actuels."}
            </p>
            {selectedCategory && (
                <button
                    type="button"
                    onClick={onReset}
                    className="mt-4 sm:mt-6 px-4 py-2 sm:px-5 sm:py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-[11px] sm:text-xs font-bold transition-all shadow-md active:scale-95"
                >
                    Voir tous les produits
                </button>
            )}
        </div>
    );
}