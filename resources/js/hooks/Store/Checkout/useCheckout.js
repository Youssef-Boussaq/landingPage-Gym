
import { useForm } from '@inertiajs/react';

export default function useCheckout(checkoutMode = 'cart') {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
    } = useForm({
        checkout_mode: checkoutMode,

        customer_name: '',
        customer_email: '',
        customer_phone: '',

        shipping_address: '',
        city: '',
        postal_code: '',

        payment_method: 'stripe',
    });

    const submit = (event) => {
        event.preventDefault();

        post(route('checkout.store'));
    };

    return {
        data,
        setData,
        errors,
        processing,
        reset,
        submit,
    };
}

