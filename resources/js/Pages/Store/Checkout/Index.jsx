import React from 'react';
import CheckoutForm from '@/Components/Store/Checkout/CheckoutForm';
import OrderSummary from '@/Components/Store/Checkout/OrderSummary';

export default function Index({
    cart,
    isAuthenticated,
    user,
    checkoutMode = 'cart',
    isDigital = false,
}) {
    return (
        <div className="mx-auto max-w-7xl px-4 py-10">
            <h1 className="mb-8 text-3xl font-bold">
                Commander
            </h1>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <CheckoutForm
                        isAuthenticated={isAuthenticated}
                        user={user}
                        checkoutMode={checkoutMode}
                        isDigital={isDigital}
                    />
                </div>

                <OrderSummary
                    cart={cart}
                    isDigital={isDigital}
                />
            </div>
        </div>
    );
}
