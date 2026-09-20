<?php

namespace App\Services\Cart;

use App\Models\Product;
use Illuminate\Support\Collection;

/**
 * CartSynchronizer
 *
 * Responsabilité unique :
 * Lire session('cart'), charger les produits depuis la DB,
 * corriger les quantités obsolètes, persister la session,
 * et retourner le cart enrichi avec les flags UI.
 *
 * ─ NE touche JAMAIS session('buy_now').
 * ─ N'effectue AUCUNE validation de checkout (c'est le rôle de CartCalculator).
 * ─ Source de vérité : Product::getAvailableStockAttribute()
 *   (défini dans Product model : max(0, stock_quantity - reserved_quantity))
 */
class CartSynchronizer
{
    /**
     * Synchronise le panier avec le stock réel de la DB.
     *
     * @return array{
     *   cart: array<int|string, array<string, mixed>>,
     *   session_changed: bool,
     * }
     */
    public function synchronize(): array
    {
        $sessionCart = session()->get('cart', []);

        if (empty($sessionCart)) {
            return ['cart' => [], 'session_changed' => false];
        }

        // ── 1. Charger tous les produits en une seule requête ────────────────
        $productIds = collect($sessionCart)
            ->map(fn ($item) => (int) ($item['id'] ?? 0))
            ->filter()
            ->unique()
            ->values()
            ->all();

        /** @var Collection<int, Product> $products */
        $products = Product::query()
            ->whereIn('id', $productIds)
            ->get()
            ->keyBy('id');

        // ── 2. Parcourir et synchroniser ────────────────────────────────────
        $sessionChanged = false;
        $enrichedCart   = [];
        $sessionCart    = [];          // version propre pour la session

        foreach (session()->get('cart', []) as $productId => $item) {
            $product = $products->get((int) ($item['id'] ?? $productId));

            // Produit supprimé ou désactivé
            if (!$product || !$product->is_active) {
                $enrichedCart[$productId] = array_merge($item, [
                    'stock_available' => false,
                    'available_stock' => 0,
                    'stock_adjusted'  => false,
                ]);
                // On garde l'item en session pour que l'utilisateur puisse
                // le supprimer manuellement depuis le drawer.
                $sessionCart[$productId] = $this->sessionKeys($item);
                continue;
            }

            $manageStock = (bool) $product->manage_stock;

            // Stock non géré : aucune limitation de quantité
            if (!$manageStock) {
                $enrichedCart[$productId] = array_merge($item, [
                    'manage_stock'      => false,
                    'available_stock'   => null,
                    'stock_available'   => true,
                    'stock_adjusted'    => false,
                ]);
                $sessionCart[$productId] = $this->sessionKeys($item);
                continue;
            }

            // ── Stock géré ────────────────────────────────────────────────────
            // $product->available_stock utilise l'accessor défini dans Product :
            // max(0, stock_quantity - reserved_quantity)
            $availableStock = $product->available_stock;
            $currentQty     = (int) ($item['quantity'] ?? 1);

            $stockAvailable = $availableStock > 0;
            $adjusted       = false;
            $newQty         = $currentQty;

            if ($availableStock > 0 && $currentQty > $availableStock) {
                // Quantité obsolète → on la réduit au maximum disponible
                $newQty         = $availableStock;
                $adjusted       = true;
                $sessionChanged = true;
            }

            $enrichedCart[$productId] = array_merge($item, [
                'quantity'        => $newQty,
                'manage_stock'    => true,
                'available_stock' => $availableStock,
                'stock_available' => $stockAvailable,
                'stock_adjusted'  => $adjusted,
            ]);

            $sessionCart[$productId] = $this->sessionKeys(
                array_merge($item, ['quantity' => $newQty])
            );
        }

        // ── 3. Persister les corrections (sans toucher à 'buy_now') ─────────
        if ($sessionChanged) {
            session()->put('cart', $sessionCart);
        }

        return [
            'cart'            => $enrichedCart,
            'session_changed' => $sessionChanged,
        ];
    }

    /**
     * Extrait uniquement les clés nécessaires à la session.
     * Les flags UI (stock_adjusted, stock_available…) ne vont PAS en session.
     *
     * @param  array<string, mixed> $item
     * @return array<string, mixed>
     */
    private function sessionKeys(array $item): array
    {
        return array_intersect_key($item, array_flip([
            'id',
            'title',
            'price',
            'quantity',
            'type',
            'variant_id',
            'image',
        ]));
    }
}
