import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function MegaMenu({ category }) {
    const children = category?.children ?? [];

    if (!children.length) {
        return null;
    }

    return (
        <div
            className="
                absolute top-full left-1/2 -translate-x-1/2 mt-1
                w-[360px] xl:w-[420px]
                rounded-2xl border border-slate-200/80
                bg-white/95 backdrop-blur-md
                p-3 shadow-2xl shadow-slate-900/10
                z-50 overflow-hidden
                animate-in fade-in slide-in-from-top-2 duration-200
            "
        >
            {/* Header de la catégorie */}
            <div className="flex items-center justify-between px-3 pt-2 pb-2 mb-1 border-b border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[var(--color-primary)]" />
                    {category.name}
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                    {children.length} sous-catégories
                </span>
            </div>

            {/* Liste des sous-catégories (Niveau 2) */}
            <div className="space-y-1 py-1">
                {children.map((child) => (
                    <Link
                        key={child.id}
                        href={route('store.index', {
                            category: child.slug,
                        })}
                        className="
                            group flex items-center justify-between w-full
                            rounded-xl px-3.5 py-2.5
                            text-sm font-semibold text-slate-700
                            hover:bg-slate-100/70 hover:text-slate-950
                            transition-all duration-200 ease-out
                        "
                    >
                        <span className="flex items-center gap-2">
                            {/* Puce d'accentuation discrète au survol */}
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)] opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200" />
                            {child.name}
                        </span>

                        <ArrowRight className="h-4 w-4 text-slate-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-slate-950" />
                    </Link>
                ))}
            </div>

            {/* Pied du menu : Lien vers toute la catégorie */}
            <div className="mt-2 pt-2 border-t border-slate-100">
                <Link
                    href={route('store.index', {
                        category: category.slug,
                    })}
                    className="
                        flex items-center justify-between w-full
                        rounded-xl px-3.5 py-2.5
                        text-xs font-bold text-slate-900 bg-slate-50
                        hover:bg-[var(--color-primary)] hover:text-slate-950
                        transition-all duration-200 group
                    "
                >
                    <span>Tout voir dans {category.name}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-slate-950 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>
        </div>
    );
}