import React from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Footer from '@/Components/Landing/Footer';

export default function ProductShow({ product = {} }) {
    return (
        <PublicLayout>
            <Head title={product.title || 'Produit'} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <img
                                src={product.images?.[0]?.url || '/images/placeholder.png'}
                                alt={product.images?.[0]?.alt_text || product.title}
                                className="h-96 w-full rounded-3xl object-cover"
                            />
                        </div>

                        <div className="space-y-6">
                            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h1 className="text-3xl font-black font-archivo text-slate-900">
                                    {product.title || 'Produit'}
                                </h1>
                                <div className="mt-3 text-slate-600">
                                    {product.categories?.map((category) => category.name).join(', ')}
                                </div>
                                <div className="mt-4 text-3xl font-black text-slate-900">
                                    {product.price} €
                                </div>
                            </div>

                            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h2 className="text-xl font-semibold font-inter text-slate-900">Description</h2>
                                <p className="mt-3 text-slate-600">
                                    {product.description || 'Aucune description disponible.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </PublicLayout>
    );
}
