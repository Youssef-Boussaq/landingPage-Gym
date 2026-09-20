import React from 'react';
import { Trash2, AlertTriangle, XCircle } from 'lucide-react';
import ProductQuantity from '../DetailProduct/Shared/ProductQuantity';

export default function CartItem({
    item,
    onQuantityChange,
    onDelete,
}) {
    const total =
        Number(item.price) * Number(item.quantity);

    const manageStock    = Boolean(item.manage_stock);
    const stockAvailable = item.stock_available !== false; // true by default
    const stockAdjusted  = Boolean(item.stock_adjusted);

    const availableStock = manageStock
        ? Number(item.available_stock ?? 0)
        : 99;

    return (
        <div className="border-b border-slate-100 px-6 py-5">

            {/* ── Stock adjusted warning ── */}
            {stockAdjusted && (
                <div className="mb-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                    <span>
                        La quantité a été ajustée automatiquement.{' '}
                        <strong>Stock disponible : {availableStock}.</strong>
                    </span>
                </div>
            )}

            {/* ── Out of stock warning ── */}
            {!stockAvailable && (
                <div className="mb-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                    <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
                    <span>Ce produit n&apos;est plus disponible.</span>
                </div>
            )}

            <div className="flex gap-4">

                {/* Image */}
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    {item.image ? (
                        <img
                            src={`/storage/${item.image}`}
                            alt={item.title}
                            className={`h-full w-full object-cover ${!stockAvailable ? 'opacity-40' : ''}`}
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                            No image
                        </div>
                    )}
                </div>

                {/* Product info */}
                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">

                        <h3 className={`truncate text-sm font-semibold ${!stockAvailable ? 'text-slate-400' : 'text-slate-900'}`}>
                            {item.title}
                        </h3>

                        <button
                            type="button"
                            onClick={() => onDelete(item)}
                            className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                            aria-label="Supprimer le produit"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                        {Number(item.price).toFixed(2)} DH
                    </p>

                    {/* Quantity — hidden when out of stock */}
                    {stockAvailable && (
                        <div className="mt-3">
                            <ProductQuantity
                                quantity={Number(item.quantity)}
                                max={availableStock}
                                availableStock={availableStock}
                                manageStock={manageStock}
                                onQuantityChange={(newQuantity) =>
                                    onQuantityChange(item, newQuantity)
                                }
                            />
                        </div>
                    )}
                </div>

                {/* Total */}
                <div className="shrink-0">
                    <p className={`text-sm font-bold ${!stockAvailable ? 'text-slate-300 line-through' : 'text-slate-900'}`}>
                        {total.toFixed(2)} DH
                    </p>
                </div>

            </div>
        </div>
    );
}