import React from 'react';
import { FileText } from 'lucide-react';

export default function ProductDescription({ description }) {
    if (!description) return null;

    return (
        <div className="space-y-4 pt-6 border-t border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">
                    <FileText className="w-4 h-4 text-[#9de500]" />
                </div>
                <h2 className="text-lg sm:text-xl font-black font-archivo text-slate-900 dark:text-white">
                    Détails du produit
                </h2>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none font-inter text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                <p className="whitespace-pre-line">{description}</p>
            </div>
        </div>
    );
}