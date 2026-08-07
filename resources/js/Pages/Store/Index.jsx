import React, { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Footer from '@/Components/Landing/Footer';
import ProductCarousel from '@/Components/Store/ProductCarousel';
import StoreFilterSidebar from '@/Components/Store/StoreFilterSidebar';
import { ArrowRight, ShoppingBag, SlidersHorizontal } from 'lucide-react';


export default function StoreIndex({
    categories = [],
    selectedCategory = null,
    products = [],
    filters = {}
}) {
    // État pour l'ouverture/fermeture des filtres (Mobile & Toggle Desktop)
    const [isFilterOpen, setIsFilterOpen] = useState(true);

    // Regroupement des produits par identifiant de catégorie pour optimiser les performances (O(N))
    const productsByCategoryMap = useMemo(() => {
        const map = {};
        products.forEach((product) => {
            // Prise en compte si la relation est un tableau (categories) ou un objet (category)
            const cats = product.categories || (product.category ? [product.category] : []);
            cats.forEach((cat) => {
                if (!map[cat.id]) {
                    map[cat.id] = [];
                }
                map[cat.id].push(product);
            });
        });
        return map;
    }, [products]);

    // Gestion de la sélection/dé-sélection de catégorie avec Inertia.js
    const handleCategorySelect = (slug) => {
        const queryParams = (selectedCategory === slug || !slug) ? {} : { category: slug };
        router.get(route('store.index'), queryParams, {
            preserveState: true,
            preserveScroll: true,
            only: ['products', 'selectedCategory', 'filters']
        });
    };

    return (
        <PublicLayout >
            <Head title="Boutique" />

            <div className="py-6 sm:py-12 bg-slate-50/50 min-h-screen mt-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* BARRE SUPÉRIEURE AVEC BOUTON TOGGLE ET COMPTEUR */}
                    <div className="flex items-center justify-between border-b border-slate-200/80 pb-5">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-black transition-all active:scale-95 ${isFilterOpen
                                ? 'bg-primary text-slate-950 shadow-md shadow-primary/20'
                                : 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-100'
                                }`}
                        >
                            <SlidersHorizontal className="w-4 h-4 text-slate-950" />
                            <span>{isFilterOpen ? 'Masquer les filtres' : 'Filtrer les produits'}</span>
                        </button>

                        <div className="text-xs font-bold text-slate-500">
                            <span className="text-slate-900 font-extrabold">{products?.length || 0}</span> produits trouvés
                        </div>
                    </div>

                    {/* GRILLE PRINCIPALE */}
                    <div className="flex flex-col lg:flex-row gap-8 items-start">

                        {/* COMPOSANT FILTRE LATÉRAL */}
                        <StoreFilterSidebar
                            categories={categories}
                            selectedCategory={selectedCategory}
                            isOpen={isFilterOpen}
                            onClose={() => setIsFilterOpen(false)}
                            currentFilters={filters}
                        />

                        {/* CONTENU PRINCIPAL DES PRODUITS */}
                        <div className="flex-1 min-w-0">
                            {products.length === 0 ? (
                                /* CAS : Aucun produit ne correspond aux filtres */
                                <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-3xl border border-slate-200/60 text-center shadow-sm max-w-lg mx-auto mt-6">
                                    <ShoppingBag className="w-12 h-12 text-primary drop-shadow-sm mb-4" />
                                    <h3 className="text-lg font-bold text-slate-800">Aucun produit trouvé</h3>
                                    <p className="text-sm text-slate-500 mt-2 max-w-sm">
                                        {selectedCategory
                                            ? "Il n'y a pas de produits disponibles dans cette catégorie pour le moment."
                                            : "Aucun produit ne correspond à vos critères de recherche actuels."}
                                    </p>
                                    {selectedCategory && (
                                        <button
                                            onClick={() => handleCategorySelect(null)}
                                            className="mt-6 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold transition-all shadow-md active:scale-95"
                                        >
                                            Voir tous les produits
                                        </button>
                                    )}
                                </div>
                            ) : selectedCategory ? (
                                /* CAS 1 : Une catégorie spécifique est sélectionnée */
                                <section className="space-y-4">
                                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 capitalize">
                                        {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                                    </h2>
                                    <ProductCarousel products={products} isFilterOpen={isFilterOpen} />
                                </section>
                            ) : (
                                /* CAS 2 : "Tous les produits" -> Découpage par catégorie */
                                <div className="space-y-8 sm:space-y-12">
                                    {categories.map((category) => {
                                        const categoryProducts = productsByCategoryMap[category.id] || [];
                                        if (categoryProducts.length === 0) return null;

                                        return (
                                            <section key={category.id} className="space-y-3 sm:space-y-4">
                                                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5 sm:pb-3">
                                                    <div className="flex items-center gap-2">
                                                        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                                                            {category.name}
                                                        </h2>
                                                        <span className="text-[10px] sm:text-xs font-bold text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded-full">
                                                            {categoryProducts.length}
                                                        </span>
                                                    </div>

                                                    <button
                                                        onClick={() => handleCategorySelect(category.slug)}
                                                        className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-950 transition-colors"
                                                    >
                                                        Voir tout
                                                        <ArrowRight className="w-3.5 h-3.5 text-primary" />
                                                    </button>
                                                </div>

                                                {/* Carrousel dédié à la catégorie */}
                                                {/* Remplacer vos appels à ProductCarousel par : */}
                                                <ProductCarousel products={products} isFilterOpen={isFilterOpen} />
                                            </section>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                    </div>

                </div>
            </div>

            <Footer />
        </PublicLayout>
    );
}