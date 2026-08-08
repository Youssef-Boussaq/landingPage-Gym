import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Footer from '@/Components/Landing/Footer';
import ProductCarousel from '@/Components/Store/ProductCarousel';
import StoreFilterSidebar from '@/Components/Store/StoreFilterSidebar';
import StoreHeader from '@/Components/Store/StoreHeader';
import EmptyProducts from '@/Components/Store/EmptyProducts';
import CategorySection from '@/Components/Store/CategorySection';
import { useStoreFilters } from '@/Components/Hooks/useStoreFilters';
import groupProductsByCategory from '@/utils/groupProductsByCategory';

export default function StoreIndex({
    categories = [],
    selectedCategory = null,
    products = [],
    filters = {}
}) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Filter Hook centralisé
    const { handleCategorySelect, resetFilters } = useStoreFilters(filters, selectedCategory);

    // Groupement via la fonction Utility externe
    const productsByCategoryMap = useMemo(() => {
        return groupProductsByCategory(products);
    }, [products]);

    return (
        <PublicLayout>
            <Head title="Boutique" />

            <div className="py-4 sm:py-12 bg-slate-50/50 min-h-screen mt-14 sm:mt-20">
                <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">

                    {/* 1. STORE HEADER */}
                    <StoreHeader
                        isFilterOpen={isFilterOpen}
                        onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
                        totalProducts={products?.length || 0}
                    />

                    {/* 2. MAIN LAYOUT */}
                    <div className="flex flex-col lg:flex-row gap-4 sm:gap-8 items-start">

                        {/* SIDEBAR FILTER */}
                        <StoreFilterSidebar
                            categories={categories}
                            selectedCategory={selectedCategory}
                            isOpen={isFilterOpen}
                            onClose={() => setIsFilterOpen(false)}
                            onSelectCategory={handleCategorySelect}
                            onReset={resetFilters}
                        />

                        {/* PRODUCTS DISPLAY */}
                        <div className="flex-1 min-w-0 w-full">
                            {products.length === 0 ? (
                                <EmptyProducts
                                    selectedCategory={selectedCategory}
                                    onReset={resetFilters}
                                />
                            ) : selectedCategory ? (
                                <section className="space-y-3 sm:space-y-4">
                                    <h2 className="text-base sm:text-xl font-extrabold text-slate-900 capitalize px-1">
                                        {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                                    </h2>
                                    <ProductCarousel products={products} isFilterOpen={isFilterOpen} />
                                </section>
                            ) : (
                                <div className="space-y-6 sm:space-y-12">
                                    {categories.map((category) => {
                                        const categoryProducts = productsByCategoryMap[category.id] || [];
                                        if (categoryProducts.length === 0) return null;

                                        return (
                                            <CategorySection
                                                key={category.id}
                                                categoryName={category.name}
                                                count={categoryProducts.length}
                                                products={categoryProducts}
                                                isFilterOpen={isFilterOpen}
                                            />
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