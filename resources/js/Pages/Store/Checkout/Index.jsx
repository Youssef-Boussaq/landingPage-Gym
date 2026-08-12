import React from 'react';

import CheckoutForm from '@/Components/Store/Checkout/CheckoutForm';
import OrderSummary from '@/Components/Store/Checkout/OrderSummary';

export default function Index({
    cart,
    isAuthenticated,
    user,
}) {
    return (
        <div className="mx-auto max-w-7xl px-4 py-10">

            <h1 className="mb-8 text-3xl font-bold">
                Checkout
            </h1>

            <div className="grid gap-8 lg:grid-cols-3">

                <div className="lg:col-span-2">
                    <CheckoutForm
                        isAuthenticated={isAuthenticated}
                        user={user}
                    />
                </div>

                <OrderSummary cart={cart} />

            </div>

        </div>
    );
}