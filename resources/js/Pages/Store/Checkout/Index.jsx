import React from 'react';
import CheckoutForm from '@/Components/Store/Checkout/CheckoutForm';
import OrderSummary from '@/Components/Store/Checkout/OrderSummary';
import StoreLayout from '@/Layouts/StoreLayout';

export default function Index({
    cart,
    isAuthenticated,
    user,
    checkoutMode = 'cart',
    isDigital = false,
}) {
    return (
        <StoreLayout title="Commander">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-12 font-favorit">
                <div className="mb-10">
                    <span className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#666666]">
                        {isDigital ? 'Commande numérique' : 'Finaliser la commande'}
                    </span>
                    <h1 className="text-3xl font-normal uppercase tracking-[0.025em] text-[#000000] mt-1">
                        Paiement sécurisé
                    </h1>
                </div>

                <div className="grid gap-12 lg:grid-cols-12 items-start">
                    <div className="lg:col-span-7">
                        <CheckoutForm
                            isAuthenticated={isAuthenticated}
                            user={user}
                            checkoutMode={checkoutMode}
                            isDigital={isDigital}
                        />
                    </div>

                    <div className="lg:col-span-5">
                        <OrderSummary
                            cart={cart}
                            isDigital={isDigital}
                        />
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
