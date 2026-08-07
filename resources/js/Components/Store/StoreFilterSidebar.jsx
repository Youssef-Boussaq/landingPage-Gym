import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    SlidersHorizontal, Flame, Sparkles,
    RotateCcw, Check, Package, Download
} from 'lucide-react';
import MenuCategory from '@/Components/Category/MenuCatgory';

export default function StoreFilterSidebar({
    categories = [],
    selectedCategory = null,
    currentFilters = {},
    isOpen = true
}) {
    if (!isOpen) return null;

    // 🛡️ Sécurité : fallback sur un objet vide si null/undefined
    const safeFilters = currentFilters || {};

    // États locaux
    const [priceRange, setPriceRange] = useState(safeFilters.max_price || safeFilters.price || 150);
    const [productType, setProductType] = useState(safeFilters.type || 'all');
    const [isTrending, setIsTrending] = useState(!!safeFilters.trending);
    const [isTopSeller, setIsTopSeller] = useState(!!safeFilters.top_seller);

    // Envoi des filtres à Inertia
    const applyFilters = (newCategory = selectedCategory, customPrice = priceRange) => {
        router.get(
            route('store.index'),
            {
                category: newCategory || undefined,
                max_price: customPrice,
                type: productType !== 'all' ? productType : undefined,
                trending: isTrending ? 1 : undefined,
                top_seller: isTopSeller ? 1 : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['products', 'selectedCategory', 'filters']
            }
        );
    };

    // Réinitialisation globale
    const handleReset = () => {
        setPriceRange(150);
        setProductType('all');
        setIsTrending(false);
        setIsTopSeller(false);
        router.get(route('store.index'), {}, { preserveState: true, preserveScroll: true });
    };

    const handleCategoryClick = (slug) => {
        const nextCategory = selectedCategory === slug ? null : slug;
        applyFilters(nextCategory);
    };

    return (
        <aside className="w-full lg:w-[280px] shrink-0 space-y-6 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm sticky top-6">
            <div className="space-y-6">

                {/* EN-TÊTE DES FILTRES */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-slate-900 text-primary">
                            <SlidersHorizontal className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-base font-black text-slate-900">Filtres</h3>
                            <p className="text-[11px] text-slate-500 font-medium">Affinez vos résultats</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Bouton MenuCategory visible sur TOUS les écrans */}
                        <div className="block">
                            <MenuCategory
                                categories={categories}
                                selectedCategory={selectedCategory}
                                onSelect={(slug) => handleCategoryClick(slug)}
                            />
                        </div>

                        {/* Bouton Réinitialiser */}
                        <button
                            onClick={handleReset}
                            title="Réinitialiser"
                            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors text-xs font-bold flex items-center gap-1"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {/* ================= SECTION 2 : FILTRES AVANCÉS (Visible sur TOUS les écrans) ================= */}
                <div className="space-y-5">
                    <span className="text-[11px] font-black tracking-wider uppercase text-slate-400">
                        Filtres Avancés
                    </span>

                    {/* BADGES & TENDANCES */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700">Badges & Tendances</label>

                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsTrending(!isTrending);
                                    applyFilters();
                                }}
                                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-bold border transition-all ${isTrending
                                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-600 shadow-sm'
                                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <Sparkles className={`w-3.5 h-3.5 ${isTrending ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                                <span>Tendances</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setIsTopSeller(!isTopSeller);
                                    applyFilters();
                                }}
                                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-bold border transition-all ${isTopSeller
                                    ? 'bg-rose-500/10 border-rose-500/40 text-rose-600 shadow-sm'
                                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <Flame className={`w-3.5 h-3.5 ${isTopSeller ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`} />
                                <span>Top Ventes</span>
                            </button>
                        </div>
                    </div>

                    {/* TYPE DE PRODUIT */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700">Type de produit</label>

                        <div className="p-1 bg-slate-100 rounded-xl flex items-center gap-1 border border-slate-200/80">
                            <button
                                type="button"
                                onClick={() => { setProductType('all'); applyFilters(); }}
                                className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${productType === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                                    }`}
                            >
                                Tous
                            </button>
                            <button
                                type="button"
                                onClick={() => { setProductType('physical'); applyFilters(); }}
                                className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${productType === 'physical' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                                    }`}
                            >
                                <Package className="w-3 h-3" />
                                <span>Physique</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => { setProductType('digital'); applyFilters(); }}
                                className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${productType === 'digital' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                                    }`}
                            >
                                <Download className="w-3 h-3" />
                                <span>Digital</span>
                            </button>
                        </div>
                    </div>

                    {/* PRIX MAXIMUM (SLIDER) */}
                    <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-700">Prix maximum</label>
                            <span className="px-2 py-0.5 bg-slate-900 text-primary text-xs font-black rounded-md">
                                {priceRange} €
                            </span>
                        </div>

                        <input
                            type="range"
                            min="10"
                            max="500"
                            step="5"
                            value={priceRange}
                            onChange={(e) => setPriceRange(e.target.value)}
                            onMouseUp={() => applyFilters()}
                            onTouchEnd={() => applyFilters()}
                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                        />

                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                            <span>10 €</span>
                            <span>250 €</span>
                            <span>500 €</span>
                        </div>
                    </div>

                </div>

            </div>
        </aside>
    );
}