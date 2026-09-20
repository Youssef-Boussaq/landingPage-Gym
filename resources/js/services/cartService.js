import { router } from '@inertiajs/react';

export function addToCart(
    productId,
    quantity = 1,
    variant = null,
    options = {}
) {
    return router.post(
        route('cart.add'),
        {
            product_id: Number(productId),
            quantity: Number(quantity),
            variant_id: variant?.id ?? null,
        },
        {
            preserveScroll: true,

            ...options,

            onSuccess: (page) => {
                options.onSuccess?.(page);
            },

            onError: (errors) => {
                options.onError?.(errors);
            },
        }
    );
}

export function updateCartQuantity(
    productId,
    quantity,
    variantId = null,
    options = {}
) {
    return router.patch(
        route('cart.update'),
        {
            product_id: Number(productId),
            quantity: Number(quantity),
            variant_id: variantId
                ? Number(variantId)
                : null,
        },
        {
            preserveScroll: true,

            ...options,

            onSuccess: (page) => {
                options.onSuccess?.(page);
            },

            onError: (errors) => {
                options.onError?.(errors);
            },
        }
    );
}

export function removeFromCart(
    productId,
    variantId = null,
    options = {}
) {
    return router.delete(
        route('cart.remove'),
        {
            data: {
                product_id: Number(productId),
                variant_id: variantId
                    ? Number(variantId)
                    : null,
            },

            preserveScroll: true,

            ...options,

            onSuccess: (page) => {
                options.onSuccess?.(page);
            },

            onError: (errors) => {
                options.onError?.(errors);
            },
        }
    );
}