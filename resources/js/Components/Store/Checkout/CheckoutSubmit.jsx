import React from 'react';

export default function CheckoutSubmit({
    processing,
}) {
    return (
        <button
            type="submit"
            disabled={processing}
            className="mt-6 w-full rounded-xl bg-slate-900 px-6 py-4 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
            {processing
                ? 'Processing...'
                : 'Place Order'}
        </button>
    );
}