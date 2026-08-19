import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronRight, ArrowRight, Layers, Sparkles } from 'lucide-react';

export default function MobileMenu({ categories = [], onNavigate }) {
    const [activeCategory, setActiveCategory] = useState(
        categories.length > 0 ? categories[0] : null
    );

    if (!categories.length) return null;

    const currentCategory = activeCategory || categories[0];

    return (
        <div className="flex w-full min-h-[360px] rounded-2xl border border-slate-200/80 bg-white text-slate-900 shadow-xl dark:border-slate-800 dark:bg-slate-950 dark:text-white overflow-hidden font-sans">
            {/* =========================================================
                COLONNE GAUCHE : CATÉGORIES PRINCIPALES
            ========================================================== */}
            <div className="w-1/2 border-r border-slate-100 bg-slate-50/50 p-2 space-y-1 dark:border-slate-800/80 dark:bg-slate-900/40">
                <div className="px-2 py-1.5 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                        <Layers className="w-3 h-3 text-[#9de500]" />
                        Catégories
                    </span>
                </div>

                {categories.map((category) => {
                    const isActive = currentCategory?.id === category.id;

                    return (
                        <button
                            key={category.id}
                            type="button"
                            onClick={() => setActiveCategory(category)}
                            onMouseEnter={() => setActiveCategory(category)}
                            className={`
                                group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs sm:text-sm font-semibold transition-all duration-200
                                ${isActive
                                    ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white'
                                    : 'text-slate-600 hover:bg-slate-100/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200'
                                }
                            `}
                        >
                            <span className="flex items-center gap-2 truncate">
                                <span
                                    className={`h-3 w-1 rounded-full bg-[#9de500] transition-all duration-200 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                                        }`}
                                />
                                <span className="truncate">{category.name}</span>
                            </span>

                            <ChevronRight
                                className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isActive
                                        ? 'translate-x-0.5 text-[#9de500]'
                                        : 'text-slate-400 opacity-60 group-hover:opacity-100'
                                    }`}
                            />
                        </button>
                    );
                })}
            </div>

            {/* =========================================================
                COLONNE DROITE : SOUS-CATÉGORIES
            ========================================================== */}
            <div className="w-1/2 p-3 flex flex-col justify-between">
                <div>
                    <div className="px-2 py-1.5 mb-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#9de500]" />
                            {currentCategory?.name}
                        </span>
                    </div>

                    <div className="space-y-1">
                        {currentCategory?.children && currentCategory.children.length > 0 ? (
                            currentCategory.children.map((subItem) => (
                                <Link
                                    key={subItem.id || subItem.name}
                                    href={route('store.index', {
                                        category: subItem.slug ?? currentCategory.slug,
                                    })}
                                    onClick={() => onNavigate && onNavigate()}
                                    className="
                                        group flex items-center justify-between w-full rounded-xl px-3 py-2
                                        text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300
                                        hover:bg-slate-100/80 hover:text-slate-950 dark:hover:bg-slate-800/60 dark:hover:text-white
                                        transition-all duration-150
                                    "
                                >
                                    <span className="truncate">{subItem.name}</span>
                                    <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 text-slate-950 dark:text-white shrink-0" />
                                </Link>
                            ))
                        ) : (
                            <p className="px-3 py-2 text-xs text-slate-400 italic">
                                Aucune sous-catégorie
                            </p>
                        )}
                    </div>
                </div>

                {/* Bouton d'action globale vers la catégorie sélectionnée */}
                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
                    <Link
                        href={route('store.index', {
                            category: currentCategory.slug,
                        })}
                        onClick={() => onNavigate && onNavigate()}
                        className="
                            flex items-center justify-between w-full rounded-xl px-3 py-2.5
                            text-xs font-bold text-slate-950 bg-[#9de500]
                            hover:bg-[#8bd100] active:scale-[0.98]
                            transition-all duration-150 shadow-sm
                        "
                    >
                        <span className="truncate">Tout voir dans {currentCategory.name}</span>
                        <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                    </Link>
                </div>
            </div>
        </div>
    );
}