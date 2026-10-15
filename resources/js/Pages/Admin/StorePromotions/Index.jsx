import AdminBreadcrumbs from '@/Components/Admin/AdminBreadcrumbs';
import AdminConfirmDialog from '@/Components/Admin/AdminConfirmDialog';
import AdminEmptyState from '@/Components/Admin/AdminEmptyState';
import AdminStatusBadge from '@/Components/Admin/AdminStatusBadge';
import AdminLayout from '@/Layouts/AdminLayout';
import { formatDate } from '@/helpers/format';
import { Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';


export default function StorePromotionsIndex({ promotions = [] }) {
    const [pendingDelete, setPendingDelete] = useState(null);

    return (
        <AdminLayout title="Promotions">



            <AdminBreadcrumbs items={[{ label: 'Admin', href: route('admin.dashboard') }, { label: 'Store Promotions' }]} />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-archivo text-2xl uppercase text-slate-900">Promotions</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        {promotions.length} promotion{promotions.length > 1 ? 's' : ''} au total
                    </p>
                </div>
                <Link
                    href={route('admin.store-promotions.create')}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-[var(--color-primary)]"
                >
                    <Plus className="h-4 w-4" />
                    Nouvelle promotion
                </Link>
            </div>

            {promotions.length === 0 ? (
                <div className="mt-6">
                    <AdminEmptyState title="Aucune promotion." description="Créez votre première promotion pour l'afficher sur la boutique." />
                </div>
            ) : (
                <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-400">
                            <tr>
                                <th className="px-4 py-3">Image</th>
                                <th className="px-4 py-3">Titre</th>
                                <th className="px-4 py-3">Ordre</th>
                                <th className="px-4 py-3">Statut</th>
                                <th className="px-4 py-3">Créé le</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {promotions.map((promotion) => (
                                <tr key={promotion.id} className="border-t border-slate-100">
                                    <td className="px-4 py-3">
                                        {promotion.image ? (
                                            <img
                                                src={`/storage/${promotion.image}`}
                                                alt={promotion.title}
                                                className="h-12 w-12 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <span className="text-xs text-slate-400">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-slate-900">
                                        {promotion.title || '—'}
                                    </td>
                                    <td className="px-4 py-3 text-sm">{promotion.sort_order}</td>
                                    <td className="px-4 py-3">
                                        <AdminStatusBadge
                                            status={promotion.is_active ? 'active' : 'inactive'}
                                            label={promotion.is_active ? 'active' : 'inactive'}
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-500">{formatDate(promotion.created_at)}</td>
                                    <td className="px-4 py-3 space-x-2 whitespace-nowrap text-right">
                                        <Link href={route('admin.store-promotions.edit', promotion.id)} className="text-xs font-bold underline">Éditer</Link>
                                        <button type="button" className="text-xs font-bold text-rose-600" onClick={() => setPendingDelete(promotion)}>
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <AdminConfirmDialog
                show={!!pendingDelete}
                title="Supprimer cette promotion ?"
                message="Êtes-vous sûr de vouloir supprimer cette promotion ? Cette action est irréversible."
                confirmLabel="Supprimer"
                onClose={() => setPendingDelete(null)}
                onConfirm={() => {
                    router.delete(route('admin.store-promotions.destroy', pendingDelete.id), {
                        onFinish: () => setPendingDelete(null),
                    });
                }}
            />
        </AdminLayout>
    );
}
