import React from 'react';

export default function ProductDescription({ description }) {
    if (!description) return null;
    
    return (
        <div className="mt-8 pt-8 border-t border-slate-100">
            <h2 className="text-xl font-bold font-archivo text-slate-900 mb-4">
                Détails du produit
            </h2>
            <div className="prose prose-slate max-w-none font-inter text-slate-600 leading-relaxed">
                <p>{description}</p>
            </div>
        </div>
    );
}
