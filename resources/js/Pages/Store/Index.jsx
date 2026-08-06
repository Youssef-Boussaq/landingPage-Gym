import React from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Footer from '@/Components/Landing/Footer';
import CategoryToggle from '@/Components/Store/CategoryToggle';
import ProductCarousel from '@/Components/Store/ProductCarousel';
import StoreHeader from '@/Components/Store/StoreHeader';

export default function StoreIndex({ categories = [], selectedCategory = null, products = [] }) {
    return (
        <PublicLayout>
            <Head title="Boutique" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
                    <StoreHeader />

                    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-xl font-semibold font-inter text-slate-900">
                                    Filtrer par catégorie
                                </h2>
                                <p className="mt-2 text-sm text-slate-600">
                                    Sélectionnez une catégorie pour afficher uniquement ses produits.
                                </p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <CategoryToggle categories={categories} selectedCategory={selectedCategory} />
                        </div>
                    </section>

                    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-xl font-semibold font-inter text-slate-900">
                                    Produits
                                </h2>
                                <p className="mt-2 text-sm text-slate-600">
                                    Tous les produits des catégories sont affichés ici. Cliquez sur un filtre pour afficher une catégorie.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <ProductCarousel products={products} />
                        </div>
                    </section>
                </div>
            </div>

            <Footer />
        </PublicLayout>
    );
}
