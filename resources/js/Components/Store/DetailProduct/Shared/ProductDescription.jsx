
import React from 'react';
import { FileText } from 'lucide-react';

export default function ProductDescription({ description }) {
    if (!description) return null;

    return (
        <div className="space-y-5 border-t border-slate-200/80 pt-6">
            {/* Header */}
            <div className="flex items-center gap-2.5">
                <div
                    className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-slate-100
                        text-slate-900
                    "
                >
                    <FileText className="h-4 w-4 text-[var(--color-primary)]" />
                </div>

                <h2
                    className="
                        font-archivo
                        text-lg
                        font-black
                        text-slate-900

                        sm:text-xl
                    "
                >
                    Détails du produit
                </h2>
            </div>

            {/* HTML Description */}
            <div
                className="
                    prose
                    prose-slate
                    max-w-none

                    font-inter
                    text-sm
                    leading-7
                    text-slate-600

                    sm:text-base

                    prose-headings:font-archivo
                    prose-headings:font-black
                    prose-headings:text-slate-900

                    prose-p:my-3
                    prose-p:text-slate-600

                    prose-strong:font-bold
                    prose-strong:text-slate-900

                    prose-a:font-semibold
                    prose-a:text-[var(--color-primary-dark,var(--color-primary))]
                    prose-a:no-underline
                    hover:prose-a:underline

                    prose-ul:my-4
                    prose-ol:my-4

                    prose-li:my-1

                    prose-li::marker:text-[var(--color-primary)]

                    prose-blockquote:border-l-[3px]
                    prose-blockquote:border-[var(--color-primary)]
                    prose-blockquote:bg-slate-50
                    prose-blockquote:px-4
                    prose-blockquote:py-2
                    prose-blockquote:text-slate-600

                    prose-code:rounded
                    prose-code:bg-slate-100
                    prose-code:px-1.5
                    prose-code:py-0.5
                    prose-code:text-slate-800

                    prose-img:rounded-2xl
                    prose-img:shadow-sm
                "
                dangerouslySetInnerHTML={{
                    __html: description,
                }}
            />
        </div>
    );
}
