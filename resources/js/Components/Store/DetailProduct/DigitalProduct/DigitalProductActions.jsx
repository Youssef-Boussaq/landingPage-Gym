import React from 'react';

export default function DigitalProductActions({ onBuyNow }) {
    return (
        <div className="mt-6 font-favorit">
            <button
                onClick={onBuyNow}
                className="filled-action-btn w-full py-3.5 text-center text-[12px] font-medium uppercase tracking-[0.025em]"
            >
                Acheter et télécharger
            </button>
            <p className="text-center text-[12px] text-[#666666] mt-3 font-favorit leading-[1.4] tracking-[0.025em]">
                Le lien de téléchargement vous sera envoyé par email immédiatement après l'achat.
            </p>
        </div>
    );
}
