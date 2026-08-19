

/**
 * Regroupe les produits par identifiant de catégorie.
 * @param {Array} products 
 * @returns {Object} Map des produits indexés par ID de catégorie
 */
export default function groupProductsByCategory(products = []) {
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