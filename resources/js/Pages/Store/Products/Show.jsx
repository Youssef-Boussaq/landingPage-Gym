import React from 'react';
import { Head } from '@inertiajs/react';
import Header from '@/Components/Store/Header';
import Footer from '@/Components/Store/Footer';

export default function ProductShow({ product = {} }) {
    return (
        <>
            <Head title={product.name || 'Produit'} />
            <Header />
            <main className="container mx-auto py-8">
                <h1 className="text-2xl font-bold mb-4">{product.name || 'Produit (placeholder)'}</h1>
                <p>{product.description || 'Description du produit'}</p>
            </main>
            <Footer />
        </>
    );
}
