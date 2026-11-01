import React from 'react';
import { Link } from '@inertiajs/react';
import { Dumbbell } from 'lucide-react';

export default function HeaderLogo() {
    return (
        <Link
            href="/"
            className="group relative inline-flex items-center gap-3 py-1 transition-all duration-300"
        >
            {/* Icône sans fond avec rotation et effet lumineux au survol */}
            <Dumbbell className="h-7 w-7 text-[var(--color-primary)] transition-all duration-500 ease-out group-hover:-rotate-45 group-hover:scale-115 drop-shadow-[0_0_10px_color-mix(in_srgb,var(--color-primary)_40%,transparent)]" />

            {/* Texte avec typographie Archivo Black et soulignement animé */}
            <div className="flex flex-col">
                <span className="font-archivo text-xl sm:text-2xl uppercase tracking-wider text-slate-900 dark:text-white">
                    FIT <span className="text-[var(--color-primary)] transition-opacity duration-300 group-hover:opacity-90">YOUSSSEF</span>
                </span>

                {/* Ligne d'accentuation fluide sous le texte */}
                <span className="h-0.5 w-0 bg-[var(--color-primary)] transition-all duration-300 group-hover:w-full rounded-full" />
            </div>
        </Link>
    );
}