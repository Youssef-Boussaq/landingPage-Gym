import React from 'react';
import { Head } from '@inertiajs/react';
import Header from '@/Components/Store/Header';
import Footer from '@/Components/Store/Footer';

export default function CartIndex() {
    return (
        <>
            <Head title="Panier" />
            <Header />
            <main className="container mx-auto py-8">
                <h1 className="text-2xl font-bold mb-4">Votre panier</h1>
                <p>Panier vide (placeholder)</p>
            </main>
            <Footer />
        </>
    );
}
