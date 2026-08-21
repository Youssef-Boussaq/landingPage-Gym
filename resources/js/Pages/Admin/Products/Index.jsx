import AdminBreadcrumbs from '@/Components/Admin/AdminBreadcrumbs';
import AdminConfirmDialog from '@/Components/Admin/AdminConfirmDialog';
import AdminEmptyState from '@/Components/Admin/AdminEmptyState';
import AdminPagination from '@/Components/Admin/AdminPagination';
import AdminSearchBar, { visitWithQuery } from '@/Components/Admin/AdminSearchBar';
import AdminStatusBadge from '@/Components/Admin/AdminStatusBadge';
import AdminLayout from '@/Layouts/AdminLayout';
import { formatMoney } from '@/helpers/format';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function ProductsIndex({ products, filters, categories, lowStockThreshold }) {
    const [pendingDelete, setPendingDelete] = useState(null);

    const applyFilters = (overrides = {}) => {
        visitWithQuery(route('admin.products.index'), {
            ...filters,
            ...overrides,
        });
    };

    return (
        <AdminLayout title="Produits">
            <AdminBreadcrumbs items={[{ label: 'Admin', href: route('admin.dashboard') }, { label: 'Products' }]} />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="font-archivo text-2xl uppercase text-slate-900">Products</h1>
                <Link
                    href={route('admin.products.create')}
                    className="inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-[#9de500]"
                >
                    Nouveau produit
                </Link>
            </div>

            <div className="mt-5 flex flex-col gap-3 lg:flex-row">
                <AdminSearchBar value={filters.search} placeholder="Titre ou slug…" onSearch={(search) => applyFilters({ search })} />
                <select value={filters.category} onChange={(event) => applyFilters({ category: event.target.value })} className="rounded-xl border-slate-200 text-sm">
                    <option value="">Toutes les catégories</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
                <select value={filters.status} onChange={(event) => applyFilters({ status: event.target.value })} className="rounded-xl border-slate-200 text-sm">
                    <option value="">Actifs / inactifs</option>
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                    <option value="deleted">Corbeille</option>
                </select>
                <select value={filters.stock} onChange={(event) => applyFilters({ stock: event.target.value })} className="rounded-xl border-slate-200 text-sm">
                    <option value="">Stock</option>
                    <option value="in">En stock</option>
                    <option value="low">Faible (&lt; {lowStockThreshold})</option>
                    <option value="out">Rupture</option>
                </select>
            </div>

            <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                {products.data.length === 0 ? (
                    <div className="p-6">
                        <AdminEmptyState title="No products found." />
                    </div>
                ) : (
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-400">
                            <tr>
                                <th className="px-4 py-3">Image</th>
                                <th className="px-4 py-3">Title</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">Sale</th>
                                <th className="px-4 py-3">Stock</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.data.map((product) => (
                                <tr key={product.id} className="border-t border-slate-100">
                                    <td className="px-4 py-3">
                                        <img
                                            src={product.primary_image?.url || '/images/placeholder.png'}
                                            alt=""
                                            className="h-12 w-12 rounded-lg object-cover"
                                        />
                                    </td>
                                    <td className="px-4 py-3 font-semibold">{product.title}</td>
                                    <td className="px-4 py-3">{product.categories?.map((category) => category.name).join(', ') || '—'}</td>
                                    <td className="px-4 py-3">{formatMoney(product.price)}</td>
                                    <td className="px-4 py-3">{product.sale_price ? formatMoney(product.sale_price) : '—'}</td>
                                    <td className="px-4 py-3">{product.manage_stock ? product.stock_quantity : '—'}</td>
                                    <td className="px-4 py-3">
                                        <AdminStatusBadge
                                            status={product.deleted_at ? 'cancelled' : (product.is_active ? 'active' : 'inactive')}
                                            label={product.deleted_at ? 'deleted' : (product.is_active ? 'active' : 'inactive')}
                                        />
                                    </td>
                                    <td className="px-4 py-3 space-x-2 whitespace-nowrap">
                                        <Link href={route('admin.products.show', product.id)} className="text-xs font-bold underline">Voir</Link>
                                        {!product.deleted_at && (
                                            <>
                                                <Link href={route('admin.products.edit', product.id)} className="text-xs font-bold underline">Éditer</Link>
                                                <button type="button" className="text-xs font-bold text-rose-600" onClick={() => setPendingDelete(product)}>
                                                    Supprimer
                                                </button>
                                            </>
                                        )}
                                        {product.deleted_at && (
                                            <button
                                                type="button"
                                                className="text-xs font-bold text-emerald-700"
                                                onClick={() => router.post(route('admin.products.restore', product.id))}
                                            >
                                                Restaurer
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <AdminPagination links={products.links} />

            <AdminConfirmDialog
                show={!!pendingDelete}
                title="Supprimer le produit ?"
                message="Le produit sera mis en corbeille (soft delete) et n’apparaîtra plus dans la boutique."
                confirmLabel="Supprimer"
                onClose={() => setPendingDelete(null)}
                onConfirm={() => {
                    router.delete(route('admin.products.destroy', pendingDelete.id), {
                        onFinish: () => setPendingDelete(null),
                    });
                }}
            />
        </AdminLayout>
    );
}
