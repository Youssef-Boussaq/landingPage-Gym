import React from 'react';

export default function ProductBreadcrumb({ productName }) {
    return (
        <nav
            className="flex text-sm text-slate-500 font-inter mb-8"
            aria-label="Breadcrumb"
        >
            <ol className="inline-flex items-center space-x-1 md:space-x-3">

                <li className="inline-flex items-center">
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="hover:text-[var(--color-primary)] transition-colors"
                    >
                        Boutique
                    </button>
                </li>

                <li>
                    <div className="flex items-center">
                        <span className="mx-2 text-slate-400">/</span>

                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="hover:text-[var(--color-primary)] transition-colors"
                        >
                            Produits
                        </button>
                    </div>
                </li>

                <li aria-current="page">
                    <div className="flex items-center">
                        <span className="mx-2 text-slate-400">/</span>

                        <span className="text-slate-900 font-medium truncate max-w-[200px] sm:max-w-xs">
                            {productName}
                        </span>
                    </div>
                </li>

            </ol>
        </nav>
    );
}