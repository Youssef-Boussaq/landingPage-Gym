import React from 'react';
import { Link } from '@inertiajs/react';

export default function Header() {
    return (
        <header className="bg-white shadow">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold">Ma Boutique</Link>
                <nav>
                    <Link href="/store" className="mr-4">Boutique</Link>
                    <Link href="/cart">Panier</Link>
                </nav>
            </div>
        </header>
    );
}
