import React from 'react';

export default function DigitalFileInfo({ format, size, pages }) {
    return (
        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <h3 className="font-semibold text-slate-900 font-inter mb-3">
                Détails du fichier
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 font-inter">
                <li className="flex justify-between">
                    <span className="text-slate-500">Format</span>
                    <span className="font-medium text-slate-900">{format}</span>
                </li>
                <li className="flex justify-between">
                    <span className="text-slate-500">Taille</span>
                    <span className="font-medium text-slate-900">{size}</span>
                </li>
                {pages && (
                    <li className="flex justify-between">
                        <span className="text-slate-500">Pages</span>
                        <span className="font-medium text-slate-900">{pages}</span>
                    </li>
                )}
                <li className="flex justify-between">
                    <span className="text-slate-500">Accès</span>
                    <span className="font-medium text-slate-900 text-green-600">Immédiat</span>
                </li>
            </ul>
        </div>
    );
}
