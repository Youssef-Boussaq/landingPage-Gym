import React from 'react';
import { Heart, Minus, Plus } from 'lucide-react';

export default function CartItem({ item }) {
    const quantity = Number(item.quantity ?? 1);

    const price = Number(item.price ?? 0);

    return (
        <div className="flex gap-4 py-5">

            {/* Image placeholder */}
            <div
                className="
                    h-24 w-20
                    shrink-0
                    overflow-hidden
                    rounded-lg
                    bg-slate-100
                "
            >
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.title}
                        className="
                            h-full w-full
                            object-cover
                        "
                    />
                ) : (
                    <div
                        className="
                            flex h-full w-full
                            items-center justify-center
                            text-xs text-slate-400
                        "
                    >
                        No image
                    </div>
                )}
            </div>


            {/* Information */}
            <div className="min-w-0 flex-1">

                <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">

                        <h3
                            className="
                                truncate
                                text-sm
                                font-semibold
                                text-slate-900
                            "
                        >
                            {item.title}
                        </h3>

                        {item.type && (
                            <p className="mt-1 text-xs text-slate-500">
                                {item.type}
                            </p>
                        )}

                    </div>

                    <button
                        type="button"
                        className="
                            shrink-0
                            text-slate-400
                            transition
                            hover:text-slate-900
                        "
                    >
                        <Heart className="h-4 w-4" />
                    </button>

                </div>


                {/* Price */}
                <p className="mt-3 text-sm font-bold text-slate-900">
                    US${price.toFixed(2)}
                </p>


                {/* Quantity */}
                <div className="mt-3 flex items-center justify-between">

                    <div
                        className="
                            flex items-center
                            rounded-full
                            border border-slate-200
                        "
                    >
                        <button
                            type="button"
                            disabled={quantity <= 1}
                            className="
                                flex h-7 w-7
                                items-center justify-center
                                text-slate-500
                                transition
                                hover:text-slate-900
                                disabled:cursor-not-allowed
                                disabled:opacity-30
                            "
                        >
                            <Minus className="h-3 w-3" />
                        </button>

                        <span
                            className="
                                min-w-7
                                text-center
                                text-xs
                                font-semibold
                                text-slate-900
                            "
                        >
                            {quantity}
                        </span>

                        <button
                            type="button"
                            className="
                                flex h-7 w-7
                                items-center justify-center
                                text-slate-500
                                transition
                                hover:text-slate-900
                            "
                        >
                            <Plus className="h-3 w-3" />
                        </button>
                    </div>

                </div>

            </div>

        </div>
    );
}