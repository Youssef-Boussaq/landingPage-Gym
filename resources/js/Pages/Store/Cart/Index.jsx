import React from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Footer from '@/Components/Landing/Footer';

export default function CartIndex() {
    return (
        <PublicLayout>
            <Head title="Panier" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                        <div className="px-6 py-8 sm:p-10">
                            <h1 className="text-3xl font-black font-archivo text-slate-900">
                                Panier
                            </h1>
                            <p className="mt-4 text-gray-600 font-inter">
                                Votre panier est vide pour l’instant. Utilisez cette page comme modèle simple pour le front-end.
                            </p>

                            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                                <p className="text-sm text-slate-600">
                                    Aucun article dans le panier. Ajoutez des produits pour voir le contenu ici.
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
