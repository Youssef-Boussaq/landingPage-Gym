import React from 'react';
import { Trash2 } from 'lucide-react';
import ProductQuantity from '../DetailProduct/Shared/ProductQuantity';

export default function CartItem({
    item,
    onQuantityChange,
    onDelete,
}) {
    const total = Number(item.price) * Number(item.quantity);

    return (
        <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex gap-4">

                {/* Image */}
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    {item.image ? (
                        <img
                            src={`/storage/${item.image}`}
                            alt={item.title}
                            className="h-full w-full object-cover"
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

                        <h3 className="truncate text-sm font-semibold text-slate-900">
                            {item.title}
                        </h3>

                        {/* Delete */}
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

                    {/* Quantity */}
                    <div className="mt-3">
                        <ProductQuantity
                            quantity={Number(item.quantity)}
                            max={Number(item.stock_quantity ?? 99)}
                            onQuantityChange={(newQuantity) =>
                                onQuantityChange(item, newQuantity)
                            }
                        />
                    </div>
                </div>

                {/* Total */}
                <div className="shrink-0">
                    <p className="text-sm font-bold text-slate-900">
                        {total.toFixed(2)} DH
                    </p>
                </div>

            </div>
        </div>
    );
}