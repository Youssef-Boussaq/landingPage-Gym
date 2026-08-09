import React from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Footer from '@/Components/Landing/Footer';
import ProductDetail from '@/Components/Store/DetailProduct/ProductDetail';

export default function ProductShow({ product = {} }) {
    return (
        <PublicLayout>
            <Head title={product.title || 'Produit'} />

            <ProductDetail product={product} />

            <Footer />
        </PublicLayout>
    );
}
