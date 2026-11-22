
import { useForm } from '@inertiajs/react';

export default function useCheckout(checkoutMode = 'cart', isDigital = false) {
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

        shipping_address: isDigital ? 'Commande numérique (Livraison par email)' : '',
        city: isDigital ? 'En ligne' : '',
        postal_code: '',

        payment_method: 'stripe',
    });

    const submit = (event) => {
        event.preventDefault();

        if (isDigital) {
            data.payment_method = 'stripe';
            if (!data.shipping_address) {
                data.shipping_address = 'Commande numérique (Livraison par email)';
            }
            if (!data.city) {
                data.city = 'En ligne';
            }
        }

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

