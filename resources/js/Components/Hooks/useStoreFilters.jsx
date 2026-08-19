import { useState } from 'react';
import { router } from '@inertiajs/react';

export function useStoreFilters(initialFilters = {}) {
    const [isPending, setIsPending] = useState(false);

    /**
     * Remove empty values from filters.
     */
    const cleanFilters = (filters) => {
        return Object.fromEntries(
            Object.entries(filters).filter(
                ([_, value]) =>
                    value !== null &&
                    value !== undefined &&
                    value !== ''
            )
        );
    };

    /**
     * Apply filters through Inertia.
     */
    const applyFilters = (newFilters = {}) => {
        const queryParams = cleanFilters({
            ...initialFilters,
            ...newFilters,
        });

        router.get(
            route('store.index'),
            queryParams,
            {
                preserveState: true,
                preserveScroll: true,

                only: [
                    'products',
                    'filters',
                ],

                onStart: () => setIsPending(true),

                onFinish: () => setIsPending(false),
            }
        );
    };

    /**
     * Toggle Trending filter.
     */
    const toggleTrending = () => {
        applyFilters({
            trending: initialFilters.trending ? null : 1,
        });
    };

    /**
     * Toggle Top Seller filter.
     */
    const toggleTopSeller = () => {
        applyFilters({
            top_seller: initialFilters.top_seller ? null : 1,
        });
    };

    /**
     * Change product type.
     *
     * Example:
     * physical
     * digital
     * all
     */
    const changeType = (type) => {
        applyFilters({
            type: type === 'all' ? null : type,
        });
    };

    /**
     * Change maximum price.
     */
    const changeMaxPrice = (maxPrice) => {
        applyFilters({
            max_price: maxPrice,
        });
    };

    /**
     * Reset all store filters.
     */
    const resetFilters = () => {
        router.get(
            route('store.index'),
            {},
            {
                preserveState: true,
                preserveScroll: true,

                only: [
                    'products',
                    'filters',
                ],

                onStart: () => setIsPending(true),

                onFinish: () => setIsPending(false),
            }
        );
    };

    return {
        isPending,

        applyFilters,

        toggleTrending,
        toggleTopSeller,

        changeType,
        changeMaxPrice,

        resetFilters,
    };
}