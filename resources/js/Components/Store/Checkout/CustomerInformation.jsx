import { useForm } from '@inertiajs/react';

export function useCheckout() {

    const form = useForm({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        shipping_address: '',
        city: '',
        postal_code: '',
        payment_method: 'cash',
    });

    const submit = (event) => {
        event.preventDefault();

        form.post(route('checkout.store'));
    };

    return {
        data: form.data,
        setData: form.setData,
        errors: form.errors,
        processing: form.processing,
        submit,
    };
}