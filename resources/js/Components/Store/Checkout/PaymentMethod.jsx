import React from 'react';

export default function PaymentMethod({
    value,
    onChange,
    error,
}) {
    return (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">

            <h2 className="mb-6 text-xl font-semibold text-slate-900">
                Payment Method
            </h2>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4">

                <input
                    type="radio"
                    name="payment_method"
                    value="cash"
                    checked={value === 'cash'}
                    onChange={(e) => onChange(e.target.value)}
                />

                <div>
                    <p className="font-medium text-slate-900">
                        Cash on Delivery
                    </p>

                    <p className="text-sm text-slate-500">
                        Pay when your order arrives.
                    </p>
                </div>

            </label>

            {error && (
                <p className="mt-2 text-sm text-red-500">
                    {error}
                </p>
            )}

        </section>
    );
}