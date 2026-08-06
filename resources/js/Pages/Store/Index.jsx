import React from 'react';
import { Head } from '@inertiajs/react';

import Hero from '@/Components/Store/Hero';
import Footer from '@/Components/Store/Footer';

export default function StoreIndex() {
    return (
        <>
            <Head title="Boutique" />
        
            <main className="min-h-screen">
                <Hero />

                <section className="container mx-auto py-8" id="store">
                    <h2 className="text-2xl font-bold mb-4">Nos produits</h2>
                    <p>Grille de produits (placeholder)</p>
                </section>
            </main>
            
        </>
    );
}
