import React from 'react';
import { Link } from '@inertiajs/react';

export default function HeaderLogo() {
    return (
        <Link
            href="/"
            className="inline-flex items-center py-1 transition-opacity duration-200 hover:opacity-75"
        >
            <span className="font-sans text-xl sm:text-2xl font-bold uppercase tracking-[0.075em] text-black">
                ADANOLA
            </span>
        </Link>
    );
}
