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
            product_id: productId,
            quantity: quantity,
            variant_id: variant?.id ?? null,
        },
        {
            preserveScroll: true,

            ...options,

            onSuccess: (page) => {
                console.log('🔥 ADD CART SUCCESS');
                console.log('CART:', page.props.cart);
                console.log('CART ITEMS:', page.props.cart?.items);
                console.log('CART COUNT:', page.props.cart?.count);

                options.onSuccess?.(page);
            },

            onError: (errors) => {
                console.error('❌ ADD CART ERROR:', errors);

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
            product_id: productId,
            quantity: quantity,
            variant_id: variantId,
        },
        {
            preserveScroll: true,

            ...options,

            onSuccess: (page) => {
                console.log('🔥 CART UPDATED');
                console.log('CART:', page.props.cart);
                console.log('CART ITEMS:', page.props.cart?.items);
                console.log('CART COUNT:', page.props.cart?.count);

                options.onSuccess?.(page);
            },

            onError: (errors) => {
                console.error('❌ CART UPDATE ERROR:', errors);

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
                variant_id: variantId ? Number(variantId) : null,
            },

            preserveScroll: true,

            onSuccess: (page) => {
                console.log('🗑️ REMOVE SUCCESS');
                console.log('NEW CART:', page.props.cart);

                options.onSuccess?.(page);
            },

            onError: (errors) => {
                console.error('❌ REMOVE ERROR:', errors);

                options.onError?.(errors);
            },
        }
    );
}
