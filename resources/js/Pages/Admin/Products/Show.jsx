import AdminBreadcrumbs from '@/Components/Admin/AdminBreadcrumbs';
import AdminProductPreview from '@/Components/Admin/AdminProductPreview';
import AdminStatusBadge from '@/Components/Admin/AdminStatusBadge';
import AdminLayout from '@/Layouts/AdminLayout';
import { formatMoney } from '@/helpers/format';
import { Link, router } from '@inertiajs/react';

export default function ProductShow({ product }) {
    return (
        <AdminLayout title={product.title}>
            <AdminBreadcrumbs
                items={[
                    { label: 'Admin', href: route('admin.dashboard') },
                    { label: 'Products', href: route('admin.products.index') },
                    { label: product.title },
                ]}
            />
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h1 className="font-archivo text-2xl uppercase text-slate-900">{product.title}</h1>
                <div className="flex gap-2">
                    <Link href={route('admin.products.edit', product.id)} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-[var(--color-primary)]">
                        Éditer
                    </Link>
                    {product.is_active && (
                        <button
                            type="button"
                            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold"
                            onClick={() => router.patch(route('admin.products.deactivate', product.id))}
                        >
                            Désactiver
                        </button>
                    )}
                </div>
            </div>

            <div className="grid gap-8 xl:grid-cols-[320px_minmax(0,1fr)]">
                <AdminProductPreview product={product} />
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <dl className="space-y-3 text-sm">
                        <div className="flex justify-between"><dt className="text-slate-500">Slug</dt><dd>{product.slug}</dd></div>
                        <div className="flex justify-between"><dt className="text-slate-500">Type</dt><dd>{product.type}</dd></div>
                        <div className="flex justify-between"><dt className="text-slate-500">Prix</dt><dd>{formatMoney(product.price)}</dd></div>
                        <div className="flex justify-between"><dt className="text-slate-500">Promo</dt><dd>{product.sale_price ? formatMoney(product.sale_price) : '—'}</dd></div>
                        <div className="flex justify-between"><dt className="text-slate-500">Stock</dt><dd>{product.manage_stock ? product.stock_quantity : 'Non géré'}</dd></div>
                        <div className="flex justify-between"><dt className="text-slate-500">Statut</dt><dd><AdminStatusBadge status={product.is_active ? 'active' : 'inactive'} /></dd></div>
                        {product.type === 'digital' && (
                            <>
                                <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
                                    <dt className="text-slate-500">Fichier numérique</dt>
                                    <dd className="font-medium text-slate-900">
                                        {product.digital_file_name ? (
                                            <a
                                                href={`/storage/${product.digital_file_path}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                {product.digital_file_name} ({product.formatted_file_size || 'Fichier'})
                                            </a>
                                        ) : 'Aucun fichier uploadé'}
                                    </dd>
                                </div>
                                {product.digital_download_link && (
                                    <div className="flex justify-between items-center">
                                        <dt className="text-slate-500">Lien externe</dt>
                                        <dd className="font-medium text-blue-600 truncate max-w-xs">
                                            <a href={product.digital_download_link} target="_blank" rel="noreferrer" className="hover:underline">
                                                {product.digital_download_link}
                                            </a>
                                        </dd>
                                    </div>
                                )}
                            </>
                        )}
                    </dl>
                </div>
            </div>
        </AdminLayout>
    );
}
