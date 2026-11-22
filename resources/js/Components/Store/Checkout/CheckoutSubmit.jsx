import React from 'react';
import { Lock } from 'lucide-react';

export default function CheckoutSubmit({
    processing,
}) {
    return (
        <div className="mt-8 font-favorit">
            <button
                type="submit"
                disabled={processing}
                className="filled-action-btn w-full py-4 text-center text-[12px] font-bold uppercase tracking-[0.05em] flex items-center justify-center gap-2 disabled:opacity-40"
            >
                <Lock size={14} strokeWidth={1.5} />
                <span>{processing ? 'Traitement de la commande...' : 'Confirmer et payer la commande'}</span>
            </button>
            <p className="mt-2 text-center text-[11px] text-[#666666] tracking-[0.025em]">
                Transactions chiffrées & traitées en toute sécurité via Stripe.
            </p>
        </div>
    );
}