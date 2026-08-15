import React from 'react';

export default function PaymentMethod({
    value,
    onChange,
    error,
}) {
    return (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">

            <h2 className="mb-5 text-xl font-semibold text-slate-900">
                Payment Method
            </h2>

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
                            Pay with Stripe
                        </p>

                        <p className="text-sm text-slate-500">
                            Secure payment by card
                        </p>
                    </div>

                </label>

                {/* Cash */}

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
                            Cash on Delivery
                        </p>

                        <p className="text-sm text-slate-500">
                            Pay when your order arrives
                        </p>
                    </div>

                </label>

            </div>

            {error && (
                <p className="mt-2 text-sm text-red-500">
                    {error}
                </p>
            )}

        </section>
    );
}