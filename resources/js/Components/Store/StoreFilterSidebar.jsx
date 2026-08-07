import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import {
    SlidersHorizontal, Flame, Sparkles,
    RotateCcw, Package, Download, X, Loader2
} from 'lucide-react';
import MenuCategory from '@/Components/Category/MenuCatgory';

export default function StoreFilterSidebar({
    categories = [],
    selectedCategory = null,
    currentFilters = {},
    isOpen = false,
    onClose
}) {
    const safeFilters = currentFilters || {};

    // 1️⃣ États locaux synchronisés
    const [priceRange, setPriceRange] = useState(safeFilters.max_price || safeFilters.price || 150);
    const [productType, setProductType] = useState(safeFilters.type || 'all');
    const [isTrending, setIsTrending] = useState(!!safeFilters.trending);
    const [isTopSeller, setIsTopSeller] = useState(!!safeFilters.top_seller);
    const [isPending, setIsPending] = useState(false);

    // 🔄 Synchronisation automatique si les filtres changent depuis l'URL / serveur
    useEffect(() => {
        setPriceRange(safeFilters.max_price || safeFilters.price || 150);
        setProductType(safeFilters.type || 'all');
        setIsTrending(!!safeFilters.trending);
        setIsTopSeller(!!safeFilters.top_seller);
    }, [currentFilters]);

    // 💡 Fonction d'envoi immédiat vers Inertia
    const applyFilters = (overrides = {}) => {
        const category = 'category' in overrides ? overrides.category : selectedCategory;
        const max_price = 'max_price' in overrides ? overrides.max_price : priceRange;
        const type = 'type' in overrides ? overrides.type : productType;
        const trending = 'trending' in overrides ? overrides.trending : isTrending;
        const top_seller = 'top_seller' in overrides ? overrides.top_seller : isTopSeller;

        router.get(
            route('store.index'),
            {
                category: category || undefined,
                max_price: max_price,
                type: type !== 'all' ? type : undefined,
                trending: trending ? 1 : undefined,
                top_seller: top_seller ? 1 : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['products', 'selectedCategory', 'filters'],
                onStart: () => setIsPending(true),
                onFinish: () => setIsPending(false),
            }
        );
    };

    // 🎯 Action instantanée sur le Slider (au changement ou au relâchement)
    const handlePriceChange = (e) => {
        const newPrice = Number(e.target.value);
        setPriceRange(newPrice);
        applyFilters({ max_price: newPrice });
    };

    // 🎯 Action au clic sur Catégorie
    const handleCategoryClick = (slug) => {
        const nextCategory = selectedCategory === slug ? null : slug;
        applyFilters({ category: nextCategory });
    };

    // 🎯 Action au clic sur Tendances
    const handleTrendingToggle = () => {
        const nextState = !isTrending;
        setIsTrending(nextState);
        applyFilters({ trending: nextState });
    };

    // 🎯 Action au clic sur Top Ventes
    const handleTopSellerToggle = () => {
        const nextState = !isTopSeller;
        setIsTopSeller(nextState);
        applyFilters({ top_seller: nextState });
    };

    // 🎯 Action au clic sur Type de produit
    const handleTypeChange = (newType) => {
        setProductType(newType);
        applyFilters({ type: newType });
    };

    // 🔄 Réinitialisation instantanée
    const handleReset = () => {
        setPriceRange(150);
        setProductType('all');
        setIsTrending(false);
        setIsTopSeller(false);

        router.get(
            route('store.index'),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                onStart: () => setIsPending(true),
                onFinish: () => setIsPending(false),
            }
        );
    };

    return (
        <>
            {/* Backdrop Mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`
                fixed inset-y-0 left-0 z-50 w-[280px] sm:w-[320px] bg-white shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-in-out
                lg:relative lg:transform-none lg:w-[280px] lg:shrink-0 lg:rounded-3xl lg:border lg:border-slate-200/80 lg:shadow-sm lg:sticky lg:top-6 lg:h-max lg:z-10
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:block'}
                ${!isOpen ? 'hidden lg:block' : ''}
            `}>
                <div className="p-5 space-y-6">

                    {/* EN-TÊTE DE LA SIDEBAR */}
                    <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-xl bg-slate-900 text-primary relative flex items-center justify-center">
                                {isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                ) : (
                                    <SlidersHorizontal className="w-4 h-4" />
                                )}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-base font-black text-slate-900">Filtres</h3>
                                    {isPending && (
                                        <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 animate-pulse">
                                            Chargement...
                                        </span>
                                    )}
                                </div>
                                <p className="text-[11px] text-slate-500 font-medium">Affinez vos résultats</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={onClose}
                                title="Fermer"
                                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors text-xs font-bold flex items-center gap-1 lg:hidden"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>

                            <button
                                onClick={handleReset}
                                disabled={isPending}
                                title="Réinitialiser"
                                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors text-xs font-bold flex items-center gap-1 disabled:opacity-50"
                            >
                                <RotateCcw className={`w-3.5 h-3.5 ${isPending ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* CORPS DES FILTRES */}
                    <div className={`space-y-5 transition-opacity duration-200 ${isPending ? 'opacity-70 pointer-events-none' : 'opacity-100'}`}>

                        {/* CATÉGORIES */}
                        <div className="flex items-center gap-2.5 mb-4">
                            <span className="text-xs font-bold text-slate-700 shrink-0">
                                Catégories :
                            </span>

                            <MenuCategory
                                categories={categories}
                                selectedCategory={selectedCategory}
                                onSelect={(slug) => handleCategoryClick(slug)}
                            />
                        </div>

                        <span className="text-[11px] font-black tracking-wider uppercase text-slate-400">
                            Filtres Avancés
                        </span>

                        {/* BADGES & TENDANCES */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700">Badges & Tendances</label>

                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={handleTrendingToggle}
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
                                    onClick={handleTopSellerToggle}
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
                                    onClick={() => handleTypeChange('all')}
                                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${productType === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                                >
                                    Tous
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleTypeChange('physical')}
                                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${productType === 'physical' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                                >
                                    <Package className="w-3 h-3" />
                                    <span>Physique</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleTypeChange('digital')}
                                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${productType === 'digital' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                                >
                                    <Download className="w-3 h-3" />
                                    <span>Digital</span>
                                </button>
                            </div>
                        </div>

                        {/* PRIX MAXIMUM (SANS DELAI) */}
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
                                onChange={handlePriceChange}
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
        </>
    );
}