import React from 'react';

import CustomerInformation from './CustomerInformation';
import ShippingInformation from './ShippingInformation';
import PaymentMethod from './PaymentMethod';
import CheckoutSubmit from './CheckoutSubmit';

import useCheckout from '../../../hooks/Store/Checkout/useCheckout';

export default function CheckoutForm({
    isAuthenticated,
    user,
}) {
    const checkout = useCheckout();

    return (
        <form onSubmit={checkout.submit}>

            <CustomerInformation
                isAuthenticated={isAuthenticated}
                user={user}
                data={checkout.data}
                setData={checkout.setData}
                errors={checkout.errors}
            />

            <ShippingInformation
                data={checkout.data}
                setData={checkout.setData}
                errors={checkout.errors}
            />

            <PaymentMethod
                value={checkout.data.payment_method}
                onChange={(value) =>
                    checkout.setData(
                        'payment_method',
                        value
                    )
                }
                error={checkout.errors.payment_method}
            />

            <CheckoutSubmit
                processing={checkout.processing}
            />

        </form>
    );
}