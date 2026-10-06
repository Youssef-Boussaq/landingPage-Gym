import {
    Box,
    ImageOff,
    Package,
    ShoppingBag,
} from 'lucide-react';

function formatPrice(value) {
    return new Intl.NumberFormat('fr-MA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(value || 0));
}

function ProductImage({ image, title }) {
    if (!image) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-300">
                <ImageOff className="h-7 w-7" />
            </div>
        );
    }

    return (
        <img
            src={image}
            alt={title}
            className="h-full w-full object-cover"
        />
    );
}

function ItemRow({ item }) {
    const product = item.product;

    const title = product?.title || 'Produit supprimé';

    const quantity = Number(item.quantity || 0);
    const unitPrice = Number(item.unit_price || 0);
    const subtotal = Number(item.subtotal || unitPrice * quantity);

    const deleted = !product;

    return (
        <div className="group px-5 py-4 transition hover:bg-slate-50/70 sm:px-6">
            <div className="flex gap-4">
                {/* Image */}
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 sm:h-24 sm:w-24">
                    <ProductImage
                        image={product?.image}
                        title={title}
                    />
                </div>

                {/* Main */}
                <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3
                                    className={`truncate text-sm font-bold ${deleted
                                            ? 'text-slate-400'
                                            : 'text-slate-800'
                                        }`}
                                >
                                    {title}
                                </h3>

                                {deleted && (
                                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-red-500">
                                        Supprimé
                                    </span>
                                )}
                            </div>

                            {product?.id && (
                                <p className="mt-1 text-[11px] text-slate-400">
                                    Produit #{product.id}
                                </p>
                            )}
                        </div>

                        {/* Total desktop */}
                        <div className="hidden shrink-0 text-right sm:block">
                            <p className="text-sm font-black text-slate-900">
                                {formatPrice(subtotal)} DH
                            </p>

                            <p className="mt-1 text-[10px] text-slate-400">
                                Total article
                            </p>
                        </div>
                    </div>

                    {/* Price / quantity */}
                    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Prix
                            </span>

                            <span className="text-xs font-semibold text-slate-700">
                                {formatPrice(unitPrice)} DH
                            </span>
                        </div>

                        <div className="h-3 w-px bg-slate-200" />

                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Quantité
                            </span>

                            <span className="inline-flex min-w-7 items-center justify-center rounded-lg bg-slate-100 px-2 py-1 text-xs font-black text-slate-700">
                                {quantity}
                            </span>
                        </div>
                    </div>

                    {/* Mobile total */}
                    <div className="mt-3 flex items-center justify-between sm:hidden">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Total
                        </span>

                        <span className="text-sm font-black text-slate-900">
                            {formatPrice(subtotal)} DH
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function OrderItems({ items = [] }) {
    const totalQuantity = items.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0
    );

    if (!items.length) {
        return (
            <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <ShoppingBag className="h-6 w-6" />
                    </div>

                    <h2 className="mt-4 text-sm font-black text-slate-800">
                        Aucun produit
                    </h2>

                    <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">
                        Cette commande ne contient actuellement aucun article.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            {/* ============================================================
                HEADER
            ============================================================ */}

            <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                        <Package className="h-5 w-5" />
                    </div>

                    <div>
                        <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                            Produits
                        </h2>

                        <p className="mt-0.5 text-xs text-slate-500">
                            Articles de la commande
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                        {items.length}{' '}
                        {items.length > 1 ? 'articles' : 'article'}
                    </span>

                    <span className="hidden rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500 sm:inline-flex">
                        {totalQuantity}{' '}
                        {totalQuantity > 1 ? 'unités' : 'unité'}
                    </span>
                </div>
            </div>

            {/* ============================================================
                ITEMS
            ============================================================ */}

            <div className="divide-y divide-slate-100">
                {items.map((item) => (
                    <ItemRow
                        key={item.id}
                        item={item}
                    />
                ))}
            </div>
        </section>
    );
}