import AdminBreadcrumbs from '@/Components/Admin/AdminBreadcrumbs';
import AdminConfirmDialog from '@/Components/Admin/AdminConfirmDialog';
import AdminEmptyState from '@/Components/Admin/AdminEmptyState';
import AdminStatusBadge from '@/Components/Admin/AdminStatusBadge';
import AdminLayout from '@/Layouts/AdminLayout';
import { formatDate } from '@/helpers/format';
import { Link, router } from '@inertiajs/react';
import { FolderPlus } from 'lucide-react';
import { useState } from 'react';

function PrimaryPreview({ media }) {
    if (!media) {
        return <span className="text-xs text-slate-400">No media</span>;
    }

    if (media.type === 'video') {
        return <video src={media.url} className="h-12 w-12 rounded-lg object-cover" muted />;
    }

    return <img src={media.url} alt={media.alt_text || ''} className="h-12 w-12 rounded-lg object-cover" />;
}

function CategoryRow({ category, parentName = '—', depth = 0, onDelete }) {
    return (
        <>
            <tr className="border-t border-slate-100">
                <td className="px-4 py-3">
                    <div className="flex items-center gap-3" style={{ paddingLeft: `${depth * 24}px` }}>
                        {depth > 0 && <span className="text-slate-300">└</span>}
                        <PrimaryPreview media={category.primary_media} />
                        <div>
                            <p className="font-semibold text-slate-900">{category.name}</p>
                            <p className="text-xs text-slate-400">{category.slug}</p>
                        </div>
                    </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{parentName}</td>
                <td className="px-4 py-3 text-sm">{category.children_count ?? category.children?.length ?? 0}</td>
                <td className="px-4 py-3 text-sm">{category.products_count ?? 0}</td>
                <td className="px-4 py-3">
                    {category.primary_media ? (
                        <AdminStatusBadge status={category.primary_media.type === 'video' ? 'shipped' : 'active'} label={category.primary_media.type} />
                    ) : (
                        <span className="text-xs text-slate-400">—</span>
                    )}
                </td>
                <td className="px-4 py-3 text-sm text-slate-500">{formatDate(category.created_at)}</td>
                <td className="px-4 py-3 space-x-2 whitespace-nowrap">
                    <Link href={route('admin.categories.show', category.id)} className="text-xs font-bold underline">View</Link>
                    <Link href={route('admin.categories.edit', category.id)} className="text-xs font-bold underline">Edit</Link>
                    <button type="button" className="text-xs font-bold text-rose-600" onClick={() => onDelete(category)}>
                        Delete
                    </button>
                </td>
            </tr>
            {(category.children || []).map((child) => (
                <CategoryRow
                    key={child.id}
                    category={child}
                    parentName={category.name}
                    depth={depth + 1}
                    onDelete={onDelete}
                />
            ))}
        </>
    );
}

export default function CategoriesIndex({ categories = [], stats }) {
    const [pendingDelete, setPendingDelete] = useState(null);

    return (
        <AdminLayout title="Categories">
            <AdminBreadcrumbs items={[{ label: 'Admin', href: route('admin.dashboard') }, { label: 'Categories' }]} />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-archivo text-2xl uppercase text-slate-900">Categories</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        {stats?.roots ?? 0} roots • {stats?.children ?? 0} children • {stats?.total ?? 0} total
                    </p>
                </div>
                <Link
                    href={route('admin.categories.create')}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-[#9de500]"
                >
                    <FolderPlus className="h-4 w-4" />
                    New category
                </Link>
            </div>

            {categories.length === 0 ? (
                <div className="mt-6">
                    <AdminEmptyState title="No categories found." description="Create a root category to start the catalog tree." />
                </div>
            ) : (
                <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-400">
                            <tr>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3">Parent</th>
                                <th className="px-4 py-3">Children</th>
                                <th className="px-4 py-3">Products</th>
                                <th className="px-4 py-3">Primary media</th>
                                <th className="px-4 py-3">Created</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <CategoryRow
                                    key={category.id}
                                    category={category}
                                    parentName="—"
                                    onDelete={setPendingDelete}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <AdminConfirmDialog
                show={!!pendingDelete}
                title="Delete this category?"
                message="Deletion is blocked if the category has children or attached products. Media files are removed only when the category can be deleted."
                confirmLabel="Delete"
                onClose={() => setPendingDelete(null)}
                onConfirm={() => {
                    router.delete(route('admin.categories.destroy', pendingDelete.id), {
                        onFinish: () => setPendingDelete(null),
                    });
                }}
            />
        </AdminLayout>
    );
}
