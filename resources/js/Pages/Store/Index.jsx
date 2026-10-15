import React from 'react';
import { Head } from '@inertiajs/react';
import { Flame, Trophy, Zap, ArrowRight } from 'lucide-react';

import StoreLayout from '@/Layouts/StoreLayout';
import Footer from '@/Components/Landing/Footer';
import EmptyProducts from '@/Components/Store/EmptyProducts';
import CategoryShowcase from '@/Components/Store/CategoryShowcase';
import CategorySection from '@/Components/Store/CategorySection';
import PromotionBanner from '@/Components/Store/PromotionBanner';

/* -------------------------------------------------------------------------- */
/* COMPOSANT D'EN-TÊTE DE SECTION (Avec Animations & Descriptions)           */
/* -------------------------------------------------------------------------- */
function SectionHeader({ icon: Icon, title, description, badge, isHot }) {
    return (
        <div className="group relative mb-8 flex flex-col gap-2 rounded-2xl transition-all duration-300">
            {/* Effet de lueur d'arrière-plan au survol */}
            <div className="absolute -inset-x-4 -inset-y-3 -z-10 rounded-3xl bg-gradient-to-r from-[var(--color-primary)]/10 via-[var(--color-primary)]/5 to-transparent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                    {/* Badge Icône Animé */}
                    <div className="relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-slate-900 text-[var(--color-primary)] shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 dark:bg-slate-800">
                        <Icon className={`h-6 w-6 sm:h-7 sm:w-7 transition-transform duration-300 group-hover:scale-110 ${isHot ? 'animate-pulse' : ''}`} />
                        <span className="absolute -inset-1 -z-10 rounded-2xl bg-[var(--color-primary)]/20 blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>

                    {/* Titre & Badge */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                            <h2 className="font-archivo text-2xl sm:text-3xl tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-[var(--color-primary)] dark:text-white">
                                {title}
                            </h2>

                            {badge && (
                                <span className="inline-flex items-center rounded-full bg-[var(--color-primary)]/15 px-3 py-1 text-xs font-bold text-slate-900 dark:text-[var(--color-primary)] border border-[var(--color-primary)]/30 shadow-xs">
                                    {badge}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Petite ligne/barre décorative sous le titre */}
                <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-400 group-hover:text-[var(--color-primary)] transition-colors duration-300">
                    <span>Explorer</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
            </div>

            {/* Description du bloc */}
            <p className="font-inter text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl pl-1 sm:pl-18">
                {description}
            </p>

            {/* Ligne d'accentuation animée */}
            <div className="mt-2 h-0.5 w-full bg-slate-200/60 dark:bg-slate-800/80 overflow-hidden rounded-full">
                <div className="h-full w-24 bg-[var(--color-primary)] transition-all duration-500 group-hover:w-full" />
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* PAGE PRINCIPALE                                                            */
/* -------------------------------------------------------------------------- */
export default function StoreIndex({
    categories = [],
    products = [],
    selectedCategory = null,
    trendingProducts = [],
    bestSellers = [],
    offers = [],
    storePromotion,
}) {
    const isCategoryPage = Boolean(selectedCategory);
    console.log("categories", categories);

    return (
        <StoreLayout>
            <Head title="Boutique" />

            <PromotionBanner promotion={storePromotion} />
            <div className="w-full min-h-screen font-inter py-6 mt-14 sm:mt-16 sm:py-12 text-slate-900 dark:text-slate-100">
                <main className="w-full mt-4 sm:mt-8">
                    {products.length === 0 ? (
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <EmptyProducts />
                        </div>
                    ) : (
                        <div className="space-y-16 sm:space-y-24">
                            {isCategoryPage ? (
                                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                    <CategorySection
                                        categoryName={selectedCategory}
                                        count={products.length}
                                        products={products}
                                    />
                                </div>
                            ) : (
                                <>
                                    {/* Vitrines des catégories */}
                                    <div className="space-y-16 sm:space-y-24">
                                        {categories.map((category) => {
                                            const categoryProducts = (
                                                category.children ?? []
                                            ).flatMap((child) => child.products ?? []);

                                            if (categoryProducts.length === 0) return null;

                                            return (
                                                <CategoryShowcase
                                                    key={category.id}
                                                    category={category}
                                                    products={categoryProducts}
                                                />
                                            );
                                        })}
                                    </div>

                                    {/* Sections en vedette (Tendances, Best Sellers, Offres) */}
                                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-28">

                                        {/* SECTION 1: TENDANCES */}
                                        {trendingProducts.length > 0 && (
                                            <div>
                                                <SectionHeader
                                                    icon={Flame}
                                                    title="Tendances"
                                                    badge="🔥 En ce moment"
                                                    description="Découvrez les pépites les plus recherchées du moment et adoptées par la communauté."
                                                    isHot={true}
                                                />
                                                <CategorySection
                                                    count={trendingProducts.length}
                                                    products={trendingProducts}
                                                />
                                            </div>
                                        )}

                                        {/* SECTION 2: MEILLEURES VENTES */}
                                        {bestSellers.length > 0 && (
                                            <div>
                                                <SectionHeader
                                                    icon={Trophy}
                                                    title="Meilleures Ventes"
                                                    badge="Top Choix"
                                                    description="Nos produits incontournables, testés, approuvés et plébiscités par nos clients."
                                                />
                                                <CategorySection
                                                    count={bestSellers.length}
                                                    products={bestSellers}
                                                />
                                            </div>
                                        )}

                                        {/* SECTION 3: OFFRES SPÉCIALES */}
                                        {offers.length > 0 && (
                                            <div>
                                                <SectionHeader
                                                    icon={Zap}
                                                    title="Offres Spéciales"
                                                    badge="Prix Exclusifs"
                                                    description="Profitez de réductions exceptionnelles et de tarifs avantageux sur une sélection limitée."
                                                />
                                                <CategorySection
                                                    count={offers.length}
                                                    products={offers}
                                                />
                                            </div>
                                        )}

                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </main>
            </div>

            <Footer />
        </StoreLayout>
    );
}