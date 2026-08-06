import { Link } from '@inertiajs/react';
import SectionTitle from '@/Components/Store/SectionTitle';

export default function StoreHeader() {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <SectionTitle
                    title="Boutique"
                    description="Tous les produits par catégorie, avec filtre et carousel."
                />
                <div className="flex items-center gap-3">
                    <Link
                        href={route('store.cart.index')}
                        className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
                        Voir le panier
                    </Link>
                </div>
            </div>
        </div>
    );
}
