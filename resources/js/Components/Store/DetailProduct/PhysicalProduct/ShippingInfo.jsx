import React from 'react';

export default function ShippingInfo() {
    return (
        <div className="mt-6 rounded-2xl bg-slate-50 p-4 border border-slate-100 flex items-start gap-4">
            <div className="flex-shrink-0 text-slate-400 mt-0.5">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
            </div>
            <div>
                <h4 className="font-semibold text-slate-900 text-sm font-inter">
                    Livraison gratuite
                </h4>
                <p className="text-sm text-slate-500 font-inter mt-1">
                    Livraison estimée sous 3 à 5 jours ouvrés. Retours acceptés sous 30 jours.
                </p>
            </div>
        </div>
    );
}
