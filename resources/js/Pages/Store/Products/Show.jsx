import React from 'react';
import { Head } from '@inertiajs/react';
import StoreLayout from '@/Layouts/StoreLayout';
import Footer from '@/Components/Landing/Footer';
import ProductDetail from '@/Components/Store/DetailProduct/ProductDetail';

export default function ProductShow({ product = {} }) {
    return (
        <StoreLayout>
            <Head title={product.title || 'Produit'} />

            <ProductDetail product={product} />

            <Footer />
        </StoreLayout>
    );
}
