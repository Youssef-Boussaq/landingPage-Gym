import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StoreLayout from '@/Layouts/StoreLayout';
import Footer from '@/Components/Landing/Footer';

export default function ProductsIndex({ products = [] }) {
    return (
        <StoreLayout>
            <Head title="Produits" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                        <div className="px-6 py-8 sm:p-10">
                            <h1 className="text-3xl font-black font-archivo text-slate-900">
                                Produits
                            </h1>
                            <p className="mt-4 text-gray-600 font-inter">
                                Liste des produits disponibles dans la boutique.
                            </p>
                            <ul className="mt-8 space-y-4">
                                {products.length === 0 ? (
                                    <li className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-700">
                                        Aucun produit disponible pour l'instant.
                                    </li>
                                ) : (
                                    products.map((product) => (
                                        <li key={product.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                                            <Link href={`/store/products/${product.id}`} className="font-semibold text-slate-900">
                                                {product.name}
                                            </Link>
                                            <p className="mt-1 text-slate-600">{product.description}</p>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </StoreLayout>
    );
}
