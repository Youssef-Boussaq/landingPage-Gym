import React from 'react';
import { Link } from '@inertiajs/react';

export default function HeaderLogo() {
    return (
        <Link
            href="/"
            className="inline-flex items-center py-1 transition-opacity duration-200 hover:opacity-75"
        >
            <span className="font-sans text-xl sm:text-2xl font-black uppercase tracking-[0.08em] text-black">
                FIT YOUNESS
            </span>
        </Link>
    );
}
