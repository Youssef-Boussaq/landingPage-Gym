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
        <div className="shrink-0 border-t border-[#000000] bg-white px-6 py-5 font-favorit">
            {/* Free Shipping UI */}
            <div className="mb-5 rounded-none border border-[#e5e7eb] bg-[#f0efe7] p-4">
                <div className="flex items-center gap-3">
                    <div className="flex-1">
                        {subtotal > 250 ? (
                            <p className="font-bold text-[12px] uppercase tracking-[0.025em] text-[#000000]">
                                LIVRAISON GRATUITE OFFERTE
                            </p>
                        ) : (
                            <>
                                <p className="font-bold text-[12px] uppercase tracking-[0.025em] text-[#000000]">
                                    LIVRAISON : 35 DH
                                </p>
                                <p className="mt-0.5 text-[11px] text-[#666666]">
                                    Ajoutez encore {amountForFreeShipping.toFixed(2)} DH pour la livraison gratuite.
                                </p>
                            </>
                        )}
                    </div>
                </div>
                {subtotal <= 250 && (
                    <div className="mt-3 h-1 w-full overflow-hidden bg-[#e5e7eb]">
                        <div
                            className="h-full bg-[#000000] transition-all duration-500"
                            style={{ width: `${Math.min((subtotal / 250) * 100, 100)}%` }}
                        />
                    </div>
                )}
            </div>

            {/* Totals */}
            <div className="space-y-2">
                <div className="flex justify-between text-[12px] tracking-[0.025em]">
                    <span className="text-[#666666]">Sous-total</span>
                    <span className="font-medium text-[#000000]">{subtotal.toFixed(2)} DH</span>
                </div>
                <div className="flex justify-between text-[12px] tracking-[0.025em]">
                    <span className="text-[#666666]">Livraison</span>
                    <span className="font-medium text-[#000000]">
                        {shipping === 0 ? 'Offerte' : `${shipping.toFixed(2)} DH`}
                    </span>
                </div>
                <div className="mt-3 flex justify-between border-t border-[#e5e7eb] pt-3">
                    <span className="font-bold text-[13px] uppercase tracking-[0.025em] text-[#000000]">Total</span>
                    <span className="font-bold text-[13px] text-[#000000]">{totalAmount.toFixed(2)} DH</span>
                </div>
            </div>

            {/* Checkout */}
            {hasUnavailable && (
                <p className="mt-4 rounded-none border border-red-300 bg-red-50 px-3 py-2 text-center text-xs text-red-700">
                    Certains produits ne sont plus disponibles. Veuillez les supprimer pour continuer.
                </p>
            )}
            <button
                type="button"
                disabled={hasUnavailable}
                className={`filled-action-btn mt-5 w-full py-3.5 text-center text-[12px] font-medium uppercase tracking-[0.025em] ${
                    hasUnavailable ? 'cursor-not-allowed opacity-40' : ''
                }`}
                onClick={() => !hasUnavailable && router.get(route('checkout.index'))}
            >
                Passer la commande
            </button>
        </div>
    );
}