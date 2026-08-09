import React from 'react';

export default function ProductVariants({ variants = [], selectedVariant, onVariantSelect }) {
    if (!variants || variants.length === 0) return null;

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 font-inter">
                Sélectionnez une option
            </h3>
            <div className="flex flex-wrap gap-3">
                {variants.map((variant, index) => (
                    <button
                        key={index}
                        onClick={() => onVariantSelect(variant)}
                        className={`rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
                            selectedVariant?.id === variant.id
                                ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                    >
                        {variant.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
