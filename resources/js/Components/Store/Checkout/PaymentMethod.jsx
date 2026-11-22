import React from 'react';
import { CreditCard, Banknote, ShieldCheck } from 'lucide-react';

export default function PaymentMethod({
    value,
    onChange,
    error,
    isDigital = false,
}) {
    // If digital, enforce stripe
    React.useEffect(() => {
        if (isDigital && value !== 'stripe') {
            onChange('stripe');
        }
    }, [isDigital, value]);

    return (
        <section className="mt-6 border border-[#e5e7eb] bg-white p-6 sm:p-8 rounded-none font-favorit">
            <div className="mb-6 flex items-center justify-between border-b border-[#e5e7eb] pb-4">
                <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-[4px] bg-[#000000] text-xs font-bold text-white">
                        {isDigital ? '2' : '3'}
                    </span>
                    <h2 className="text-[14px] font-bold uppercase tracking-[0.025em] text-[#000000]">
                        Mode de paiement
                    </h2>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#666666]">
                    <ShieldCheck size={14} className="text-[#000000]" />
                    <span>Cryptage SSL 256-bit</span>
                </div>
            </div>

            {isDigital && (
                <div className="mb-5 border border-[#000000] bg-[#f0efe7] p-3.5 text-[12px] text-[#000000] rounded-none">
                    <span className="font-bold">E-Product :</span> Le règlement par carte bancaire via Stripe est requis afin de générer instantanément vos liens de téléchargement sécurisés.
                </div>
            )}

            <div className="space-y-3">
                {/* Stripe */}
                <label
                    className={`flex cursor-pointer items-center justify-between border p-4 transition-all rounded-none ${
                        value === 'stripe'
                            ? 'border-2 border-[#000000] bg-white'
                            : 'border-[#e5e7eb] bg-[#f0efe7]/40 hover:border-[#000000]'
                    }`}
                >
                    <div className="flex items-center gap-3.5">
                        <input
                            type="radio"
                            name="payment_method"
                            value="stripe"
                            checked={value === 'stripe'}
                            onChange={(e) => onChange(e.target.value)}
                            className="text-[#000000] focus:ring-[#000000]"
                        />

                        <div>
                            <p className="text-[13px] font-bold uppercase tracking-[0.025em] text-[#000000]">
                                Carte bancaire (Stripe)
                            </p>
                            <p className="text-[11px] text-[#666666] mt-0.5">
                                Visa, Mastercard, American Express — Paiement 100% sécurisé
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[#000000]">
                        <CreditCard size={18} strokeWidth={1.5} />
                    </div>
                </label>

                {/* Cash on Delivery - only for physical products */}
                {!isDigital && (
                    <label
                        className={`flex cursor-pointer items-center justify-between border p-4 transition-all rounded-none ${
                            value === 'cash'
                                ? 'border-2 border-[#000000] bg-white'
                                : 'border-[#e5e7eb] bg-[#f0efe7]/40 hover:border-[#000000]'
                        }`}
                    >
                        <div className="flex items-center gap-3.5">
                            <input
                                type="radio"
                                name="payment_method"
                                value="cash"
                                checked={value === 'cash'}
                                onChange={(e) => onChange(e.target.value)}
                                className="text-[#000000] focus:ring-[#000000]"
                            />

                            <div>
                                <p className="text-[13px] font-bold uppercase tracking-[0.025em] text-[#000000]">
                                    Paiement à la livraison (Cash)
                                </p>
                                <p className="text-[11px] text-[#666666] mt-0.5">
                                    Réglez en espèces à la réception de votre colis
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-[#000000]">
                            <Banknote size={18} strokeWidth={1.5} />
                        </div>
                    </label>
                )}
            </div>

            {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        </section>
    );
}
