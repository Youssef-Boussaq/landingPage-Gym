import React from 'react';

export default function DigitalProductActions({ onBuyNow }) {
    return (
        <div className="mt-6">
            <button
                onClick={onBuyNow}
                className="w-full rounded-xl bg-[var(--color-primary)] px-8 py-4 text-center font-bold text-slate-900 transition-all hover:bg-[var(--color-primary-hover)] hover:-translate-y-0.5 active:translate-y-0 font-archivo tracking-wide shadow-lg shadow-[var(--color-primary)]/30"
            >
                Acheter et télécharger
            </button>
            <p className="text-center text-xs text-slate-500 mt-3 font-inter">
                Le lien de téléchargement vous sera envoyé par email immédiatement après l'achat.
            </p>
        </div>
    );
}
