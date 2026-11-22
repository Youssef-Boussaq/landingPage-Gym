import React from 'react';

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
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">

            <h2 className="mb-5 text-xl font-semibold text-slate-900">
                Mode de paiement
            </h2>

            {isDigital && (
                <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50/70 p-3.5 text-xs text-blue-800">
                    <span className="font-bold">Information produit digital :</span> Le règlement par carte bancaire via Stripe est obligatoire pour valider la commande et débloquer immédiatement vos accès.
                </div>
            )}

            <div className="space-y-3">

                {/* Stripe */}

                <label
                    className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${value === 'stripe'
                            ? 'border-slate-900 bg-slate-50'
                            : 'border-slate-200'
                        }`}
                >

                    <input
                        type="radio"
                        name="payment_method"
                        value="stripe"
                        checked={value === 'stripe'}
                        onChange={(e) =>
                            onChange(e.target.value)
                        }
                    />

                    <div>
                        <p className="font-semibold text-slate-900">
                            Payer par carte avec Stripe
                        </p>

                        <p className="text-sm text-slate-500">
                            Paiement 100% sécurisé par carte bancaire (Visa, Mastercard)
                        </p>
                    </div>

                </label>

                {/* Cash - only for physical products */}
                {!isDigital && (
                    <label
                        className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${value === 'cash'
                                ? 'border-slate-900 bg-slate-50'
                                : 'border-slate-200'
                            }`}
                    >

                        <input
                            type="radio"
                            name="payment_method"
                            value="cash"
                            checked={value === 'cash'}
                            onChange={(e) =>
                                onChange(e.target.value)
                            }
                        />

                        <div>
                            <p className="font-semibold text-slate-900">
                                Paiement à la livraison (Cash)
                            </p>

                            <p className="text-sm text-slate-500">
                                Payez en espèces lors de la réception de votre commande
                            </p>
                        </div>

                    </label>
                )}

            </div>

            {error && (
                <p className="mt-2 text-sm text-red-500">
                    {error}
                </p>
            )}

        </section>
    );
}