import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StoreLayout from '@/Layouts/StoreLayout';
import Footer from '@/Components/Landing/Footer';
import EmptyProducts from '@/Components/Store/EmptyProducts';
import CategorySection from '@/Components/Store/CategorySection';
import PromotionBanner from '@/Components/Store/PromotionBanner';
import ProductCard from '@/Components/Store/ProductCard';

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

    return (
        <StoreLayout>
            <Head title="Store — Lookbook" />

            <PromotionBanner promotion={storePromotion} />

            <div className="w-full min-h-screen bg-white text-black font-sans pb-24">
                
                {/* CATEGORY TAB FILTER (Adanola spec: 12px weight 500, active: #000000 bg + white text + 0px radius) */}
                <div className="w-full border-b border-stone-200 bg-white">
                    <div className="mx-auto max-w-[1440px] px-4 sm:px-8 py-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                        <Link
                            href={route('store.index')}
                            className={`px-3.5 py-1.5 text-[12px] font-medium uppercase tracking-[0.025em] transition-colors rounded-none ${
                                !selectedCategory
                                    ? 'bg-black text-white'
                                    : 'bg-transparent text-black hover:bg-stone-100'
                            }`}
                        >
                            TOUS LES PRODUITS
                        </Link>
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={route('store.index', { category: cat.slug })}
                                className={`px-3.5 py-1.5 text-[12px] font-medium uppercase tracking-[0.025em] transition-colors rounded-none whitespace-nowrap ${
                                    selectedCategory === cat.slug
                                        ? 'bg-black text-white'
                                        : 'bg-transparent text-black hover:bg-stone-100'
                                }`}
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                </div>

                <main className="mx-auto max-w-[1440px] px-4 sm:px-8 pt-8">
                    {products.length === 0 ? (
                        <EmptyProducts />
                    ) : isCategoryPage ? (
                        /* Category Filtered Grid */
                        <div>
                            <div className="flex items-baseline justify-between border-b border-black pb-3 mb-8">
                                <h1 className="text-[20px] font-bold uppercase tracking-[0.025em] text-black">
                                    {selectedCategory}
                                </h1>
                                <span className="text-[12px] text-stone-500">
                                    {products.length} {products.length > 1 ? 'articles' : 'article'}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* Main Lookbook Layout */
                        <div className="space-y-16">
                            
                            {/* SECTION: ALL / TRENDING PRODUCTS GRID (4-column desktop grid) */}
                            <div>
                                <div className="flex items-baseline justify-between border-b border-black pb-3 mb-8">
                                    <h2 className="text-[20px] font-bold uppercase tracking-[0.025em] text-black">
                                        New & Trending
                                    </h2>
                                    <span className="text-[12px] text-stone-500">
                                        Collection Récente
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                                    {products.slice(0, 8).map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            </div>

                            {/* SPLIT EDITORIAL SECTION (Two lifestyle photos side-by-side, 50% each) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 py-6">
                                <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden">
                                    <img
                                        src="/images/4.webp"
                                        onError={(e) => { e.currentTarget.src = '/images/placeholder.png'; }}
                                        alt="Editorial Lookbook activewear"
                                        className="h-full w-full object-cover rounded-none"
                                    />
                                    <div className="absolute inset-0 bg-black/10" />
                                    <div className="absolute bottom-6 left-6 text-white">
                                        <p className="text-[10px] font-semibold tracking-[0.1em] uppercase">STAPLES</p>
                                        <p className="text-[20px] font-normal tracking-[0.025em]">Conçu pour le mouvement</p>
                                    </div>
                                </div>
                                <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden">
                                    <img
                                        src="/images/3.webp"
                                        onError={(e) => { e.currentTarget.src = '/images/placeholder.png'; }}
                                        alt="Editorial Lookbook lifestyle"
                                        className="h-full w-full object-cover rounded-none"
                                    />
                                    <div className="absolute inset-0 bg-black/10" />
                                    <div className="absolute bottom-6 left-6 text-white">
                                        <p className="text-[10px] font-semibold tracking-[0.1em] uppercase">PERFORMANCE</p>
                                        <p className="text-[20px] font-normal tracking-[0.025em]">Sobriété & Précision</p>
                                    </div>
                                </div>
                            </div>

                            {/* SECTION: BEST SELLERS */}
                            {bestSellers.length > 0 && (
                                <CategorySection
                                    categoryName="Best Sellers"
                                    count={bestSellers.length}
                                    products={bestSellers}
                                />
                            )}

                            {/* SECTION: REMAINING CATALOG / OFFERS */}
                            {products.length > 8 && (
                                <div>
                                    <div className="flex items-baseline justify-between border-b border-black pb-3 mb-8">
                                        <h2 className="text-[20px] font-bold uppercase tracking-[0.025em] text-black">
                                            Toute la collection
                                        </h2>
                                        <span className="text-[12px] text-stone-500">
                                            {products.length} articles
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                                        {products.slice(8).map((product) => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {offers.length > 0 && (
                                <CategorySection
                                    categoryName="Offres Spéciales"
                                    count={offers.length}
                                    products={offers}
                                />
                            )}

                        </div>
                    )}
                </main>
            </div>

            <Footer />
        </StoreLayout>
    );
}
