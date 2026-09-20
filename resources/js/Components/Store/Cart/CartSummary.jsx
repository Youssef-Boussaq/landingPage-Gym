import React from 'react';
import { router } from '@inertiajs/react';

export default function CartSummary({ items = [] }) {
    const subtotal = items.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0
    );

    const shipping = subtotal > 250 ? 0 : 35;
    const totalAmount = subtotal + shipping;
    const amountForFreeShipping = 250 - subtotal;

    // Bloquer checkout si au moins un produit est en rupture de stock
    const hasUnavailable = items.some(
        (item) => item.stock_available === false
    );

    return (
        <div className="shrink-0 border-t border-slate-200 bg-white px-6 py-5">
            {/* Free Shipping UI */}
            <div className="mb-5 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-xl shadow-sm">
                        {subtotal > 250 ? '🎉' : '🚚'}
                    </div>
                    <div className="flex-1">
                        {subtotal > 250 ? (
                            <p className="font-bold text-green-600">
                                Livraison gratuite offerte !
                            </p>
                        ) : (
                            <>
                                <p className="font-bold text-slate-900">
                                    Livraison 35 DH
                                </p>
                                <p className="mt-0.5 text-xs text-orange-500">
                                    Ajoutez encore {amountForFreeShipping.toFixed(2)} DH pour profiter de la livraison gratuite.
                                </p>
                            </>
                        )}
                    </div>
                </div>
                {subtotal <= 250 && (
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                            className="h-full bg-slate-900 transition-all duration-500"
                            style={{ width: `${Math.min((subtotal / 250) * 100, 100)}%` }}
                        />
                    </div>
                )}
            </div>

            {/* Totals */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Sous-total</span>
                    <span className="font-medium text-slate-900">{subtotal.toFixed(2)} DH</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Livraison</span>
                    <span className="font-medium text-slate-900">
                        {shipping === 0 ? 'Offerte' : `${shipping.toFixed(2)} DH`}
                    </span>
                </div>
                <div className="mt-4 flex justify-between border-t border-slate-200 pt-4">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="font-black text-slate-900">{totalAmount.toFixed(2)} DH</span>
                </div>
            </div>

            {/* Checkout */}
            {hasUnavailable && (
                <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-xs text-red-700">
                    Certains produits ne sont plus disponibles. Veuillez les supprimer pour continuer.
                </p>
            )}
            <button
                type="button"
                disabled={hasUnavailable}
                className={`mt-5 w-full rounded-full px-5 py-4 text-sm font-bold text-white transition ${
                    hasUnavailable
                        ? 'cursor-not-allowed bg-slate-300'
                        : 'bg-black hover:bg-slate-800'
                }`}
                onClick={() => !hasUnavailable && router.get(route('checkout.index'))}
            >
                PASSER LA COMMANDE
            </button>
        </div>
    );
}