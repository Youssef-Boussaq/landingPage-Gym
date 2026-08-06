import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Store/Header';
import Footer from '@/Components/Store/Footer';

export default function ProductsIndex({ products = [] }) {
    return (
        <>
            <Head title="Produits" />
            <Header />
            <main className="container mx-auto py-8">
                <h1 className="text-2xl font-bold mb-4">Liste des produits</h1>
                <ul>
                    {products.length === 0 && <li>Aucun produit (placeholder)</li>}
                </ul>
            </main>
            <Footer />
        </>
    );
}
