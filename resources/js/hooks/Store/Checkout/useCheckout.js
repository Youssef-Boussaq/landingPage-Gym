
import { useForm } from '@inertiajs/react';

export default function useCheckout(checkoutMode = 'cart', isDigital = false, user = null) {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
    } = useForm({
        checkout_mode: checkoutMode,

        customer_name: user?.name || '',
        customer_email: user?.email || '',
        customer_phone: '',

        shipping_address: isDigital ? 'Commande numérique (Livraison par email)' : '',
        city: isDigital ? 'En ligne' : '',
        postal_code: '',

        payment_method: 'stripe',
    });

    const submit = (event) => {
        event.preventDefault();

        const payload = { ...data };

        if (isDigital) {
            payload.payment_method = 'stripe';
            if (!payload.shipping_address) {
                payload.shipping_address = 'Commande numérique (Livraison par email)';
            }
            if (!payload.city) {
                payload.city = 'En ligne';
            }
        }

        // Keep form data synchronized
        if (user?.name && !payload.customer_name) {
            payload.customer_name = user.name;
        }
        if (user?.email && !payload.customer_email) {
            payload.customer_email = user.email;
        }

        post(route('checkout.store'), {
            data: payload,
            preserveScroll: true,
        });
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

