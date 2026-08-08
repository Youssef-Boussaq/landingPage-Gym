import { useState } from 'react';
import { router } from '@inertiajs/react';

/**
 * Regroupe les produits par identifiant de catégorie.
 * @param {Array} products 
 * @returns {Object} Map des produits indexés par ID de catégorie
 */
export function groupProductsByCategory(products = []) {
    return products.reduce((map, product) => {
        // Gère le cas d'une liste de catégories (many-to-many) ou d'une catégorie unique (one-to-many)
        const cats = product.categories || (product.category ? [product.category] : []);

        cats.forEach((cat) => {
            if (!cat?.id) return;
            
            if (!map[cat.id]) {
                map[cat.id] = [];
            }
            map[cat.id].push(product);
        });

        return map;
    }, {});
}

/**
 * Hook de gestion des filtres du magasin via Inertia.js (URL-driven)
 */
export function useStoreFilters(initialFilters = {}, selectedCategory = null) {
    const [isPending, setIsPending] = useState(false);

    /**
     * Applique de nouveaux filtres en nettoyant les valeurs vides
     */
    const applyFilters = (newFilters) => {
        const queryParams = Object.fromEntries(
            Object.entries(newFilters).filter(
                ([_, value]) => value !== null && value !== undefined && value !== ''
            )
        );

        router.get(
            route('store.index'),
            queryParams,
            {
                preserveState: true,
                preserveScroll: true,
                only: ['products', 'selectedCategory', 'filters'],
                onStart: () => setIsPending(true),
                onFinish: () => setIsPending(false),
            }
        );
    };

    /**
     * Sélectionne ou désélectionne une catégorie (Toggle)
     */
    const handleCategorySelect = (categorySlug) => {
        const newCategory = selectedCategory === categorySlug ? null : categorySlug;

        applyFilters({
            ...initialFilters,
            category: newCategory || undefined,
        });
    };

    /**
     * Réinitialise tous les filtres
     */
    const resetFilters = () => {
        router.get(
            route('store.index'),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                only: ['products', 'selectedCategory', 'filters'],
                onStart: () => setIsPending(true),
                onFinish: () => setIsPending(false),
            }
        );
    };

    return {
        isPending,
        handleCategorySelect,
        applyFilters,
        resetFilters,
    };
}