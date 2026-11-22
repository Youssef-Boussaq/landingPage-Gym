import React from 'react';
import { Zap, ShieldCheck } from 'lucide-react';

export default function OrderSummary({ cart = [], isDigital = false }) {
    const subtotal = cart.reduce(
        (total, item) =>
            total +
            Number(item.price ?? 0) * Number(item.quantity ?? 0),
        0
    );

    const shipping = isDigital ? 0 : (subtotal > 250 ? 0 : 35);
    const totalAmount = subtotal + shipping;

    return (
        <aside className="border border-[#e5e7eb] bg-white p-6 sm:p-8 rounded-none font-favorit">
            <div className="mb-6 border-b border-[#e5e7eb] pb-4 flex items-center justify-between">
                <h2 className="text-[14px] font-bold uppercase tracking-[0.025em] text-[#000000]">
                    Récapitulatif
                </h2>
                <span className="text-[11px] text-[#666666] uppercase tracking-[0.05em]">
                    {cart.length} produit(s)
                </span>
            </div>

            <div className="space-y-4">
                {cart.map((item) => {
                    const itemTotal =
                        Number(item.price ?? 0) *
                        Number(item.quantity ?? 0);

                    return (
                        <div
                            key={item.key}
                            className="flex gap-4 border-b border-[#e5e7eb] pb-4 last:border-b-0"
                        >
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-none border border-[#e5e7eb] bg-[#f0efe7]">
                                {item.image ? (
                                    <img
                                        src={
                                            item.image.startsWith('/storage/')
                                                ? item.image
                                                : `/storage/${item.image}`
                                        }
                                        alt={item.name}
                                        className="h-full w-full object-contain"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-xs text-[#999999]">
                                        No image
                                    </div>
                                )}

                                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-none bg-[#000000] px-1 text-[10px] font-bold text-white">
                                    {item.quantity}
                                </span>
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex justify-between gap-2">
                                    <div>
                                        <h3 className="text-[13px] font-medium uppercase tracking-[0.025em] text-[#000000] line-clamp-1">
                                            {item.name}
                                        </h3>
                                        <p className="text-[11px] text-[#666666] mt-0.5">
                                            {Number(item.price).toFixed(2)} DH / unité
                                        </p>
                                    </div>

                                    <p className="text-[13px] font-bold text-[#000000]">
                                        {itemTotal.toFixed(2)} DH
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Delivery / Digital Badge */}
            {isDigital ? (
                <div className="my-6 border border-[#000000] bg-[#f0efe7] p-3.5 rounded-none">
                    <div className="flex items-center gap-2">
                        <Zap size={14} className="text-[#000000]" />
                        <p className="text-[12px] font-bold uppercase tracking-[0.025em] text-[#000000]">
                            Livraison numérique instantanée
                        </p>
                    </div>
                    <p className="text-[11px] text-[#666666] mt-1 leading-relaxed">
                        Accès & téléchargements envoyés immédiatement après validation du paiement.
                    </p>
                </div>
            ) : (
                <div className="my-6 border border-[#e5e7eb] bg-[#f0efe7] p-3.5 rounded-none text-[12px]">
                    <p className="font-bold uppercase tracking-[0.025em] text-[#000000]">
                        {shipping === 0 ? 'Livraison gratuite offerte' : 'Livraison standard : 35 DH'}
                    </p>
                    <p className="text-[11px] text-[#666666] mt-0.5">
                        Expédié sous 24h à 48h partout au Maroc.
                    </p>
                </div>
            )}

            {/* Totals */}
            <div className="space-y-2 border-t border-[#e5e7eb] pt-4 text-[13px]">
                <div className="flex justify-between">
                    <span className="text-[#666666] uppercase tracking-[0.025em]">Sous-total</span>
                    <span className="font-medium text-[#000000]">{subtotal.toFixed(2)} DH</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-[#666666] uppercase tracking-[0.025em]">Livraison</span>
                    <span className="font-medium text-[#000000]">
                        {shipping === 0 ? 'Offerte' : `${shipping.toFixed(2)} DH`}
                    </span>
                </div>

                <div className="mt-3 flex justify-between border-t border-[#000000] pt-3 text-[14px]">
                    <span className="font-bold uppercase tracking-[0.025em] text-[#000000]">Total</span>
                    <span className="text-xl font-bold text-[#000000]">{totalAmount.toFixed(2)} DH</span>
                </div>
            </div>
        </aside>
    );
}