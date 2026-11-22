import React from 'react';
import CustomerInformation from './CustomerInformation';
import ShippingInformation from './ShippingInformation';
import PaymentMethod from './PaymentMethod';
import CheckoutSubmit from './CheckoutSubmit';
import useCheckout from '../../../hooks/Store/Checkout/useCheckout';

export default function CheckoutForm({
    isAuthenticated,
    user,
    checkoutMode = 'cart',
    isDigital = false,
}) {
    const checkout = useCheckout(checkoutMode, isDigital);

    return (
        <form onSubmit={checkout.submit}>
            <CustomerInformation
                isAuthenticated={isAuthenticated}
                user={user}
                data={checkout.data}
                setData={checkout.setData}
                errors={checkout.errors}
                isDigital={isDigital}
            />

            {!isDigital && (
                <ShippingInformation
                    data={checkout.data}
                    setData={checkout.setData}
                    errors={checkout.errors}
                />
            )}

            <PaymentMethod
                value={checkout.data.payment_method}
                onChange={(value) =>
                    checkout.setData(
                        'payment_method',
                        value
                    )
                }
                error={checkout.errors.payment_method}
                isDigital={isDigital}
            />

            <CheckoutSubmit
                processing={checkout.processing}
            />
        </form>
    );
}
