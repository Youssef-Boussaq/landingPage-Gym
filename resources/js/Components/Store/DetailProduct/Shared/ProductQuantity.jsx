import React, { useEffect, useState } from 'react';
import { Minus, Plus } from 'lucide-react';

export default function ProductQuantity({
    quantity,
    onQuantityChange,
    max = 99,
    availableStock,
    manageStock = false,
}) {
    const [message, setMessage] = useState('');

    const stock = Number(availableStock ?? max ?? 99);

    const safeMax = manageStock
        ? Math.max(0, stock)
        : Math.max(1, Number(max) || 99);

    const isOutOfStock = manageStock && safeMax <= 0;
    const isAtMax = manageStock && quantity >= safeMax;

    useEffect(() => {
        if (!manageStock) {
            setMessage('');
            return;
        }

        if (isOutOfStock) {
            setMessage("Ce produit n'est plus disponible.");
            return;
        }

        if (isAtMax) {
            setMessage(
                `Nous avons seulement ${safeMax} produit${safeMax > 1 ? 's' : ''} disponible${safeMax > 1 ? 's' : ''}.`
            );
            return;
        }

        setMessage('');
    }, [
        quantity,
        safeMax,
        manageStock,
        isOutOfStock,
        isAtMax,
    ]);

    const handleIncrease = () => {
        if (!manageStock) {
            onQuantityChange(quantity + 1);
            return;
        }

        if (safeMax <= 0) {
            setMessage("Ce produit n'est plus disponible.");
            return;
        }

        if (quantity >= safeMax) {
            setMessage(
                `Nous avons seulement ${safeMax} produit${safeMax > 1 ? 's' : ''} disponible${safeMax > 1 ? 's' : ''}.`
            );
            return;
        }

        setMessage('');
        onQuantityChange(quantity + 1);
    };

    const handleDecrease = () => {
        if (quantity <= 1) {
            return;
        }

        setMessage('');
        onQuantityChange(quantity - 1);
    };

    const handleInputChange = (e) => {
        const rawValue = e.target.value;

        if (rawValue === '') {
            return;
        }

        let value = Number(rawValue);

        if (!Number.isFinite(value)) {
            return;
        }

        value = Math.floor(value);

        if (value < 1) {
            value = 1;
        }

        if (manageStock) {
            if (safeMax <= 0) {
                setMessage("Ce produit n'est plus disponible.");
                return;
            }

            if (value > safeMax) {
                value = safeMax;

                setMessage(
                    `Nous avons seulement ${safeMax} produit${safeMax > 1 ? 's' : ''} disponible${safeMax > 1 ? 's' : ''}.`
                );
            } else {
                setMessage('');
            }
        }

        onQuantityChange(value);
    };

    return (
        <div className="flex flex-col gap-2">
            <label className="font-inter text-sm font-semibold text-slate-900">
                Quantité
            </label>

            <div className="flex w-max items-center rounded-2xl border border-slate-200/80 bg-slate-100/50 p-1 backdrop-blur-md">

                {/* MINUS */}
                <button
                    type="button"
                    onClick={handleDecrease}
                    disabled={quantity <= 1 || isOutOfStock}
                    aria-label="Diminuer la quantité"
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition-all hover:bg-white hover:text-slate-900 active:scale-95 disabled:opacity-30"
                >
                    <Minus
                        className="h-4 w-4"
                        strokeWidth={2.5}
                    />
                </button>

                {/* INPUT */}
                <input
                    type="number"
                    min="1"
                    max={safeMax > 0 ? safeMax : undefined}
                    value={quantity}
                    disabled={isOutOfStock}
                    onChange={handleInputChange}
                    className="h-10 w-14 border-0 bg-transparent p-0 text-center text-base font-extrabold text-slate-900 focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:opacity-50"
                />

                {/* PLUS */}
                <button
                    type="button"
                    onClick={handleIncrease}
                    disabled={
                        isOutOfStock ||
                        (manageStock && quantity >= safeMax)
                    }
                    aria-label="Augmenter la quantité"
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition-all hover:bg-white hover:text-slate-900 active:scale-95 disabled:opacity-30"
                >
                    <Plus
                        className="h-4 w-4"
                        strokeWidth={2.5}
                    />
                </button>
            </div>

            {message && (
                <p
                    className={`text-xs font-medium ${isOutOfStock
                            ? 'text-red-600'
                            : 'text-amber-600'
                        }`}
                >
                    {message}
                </p>
            )}
        </div>
    );
}