import AdminBreadcrumbs from '@/Components/Admin/AdminBreadcrumbs';
import AdminConfirmDialog from '@/Components/Admin/AdminConfirmDialog';
import AdminEmptyState from '@/Components/Admin/AdminEmptyState';
import AdminStatusBadge from '@/Components/Admin/AdminStatusBadge';
import ProductCard from '@/Components/Store/ProductCard';
import AdminLayout from '@/Layouts/AdminLayout';
import { formatDate } from '@/helpers/format';
import { Link, router } from '@inertiajs/react';
import { ArrowDown } from 'lucide-react';
import { useState } from 'react';

export default function CategoryShow({ category }) {
    const [pendingDelete, setPendingDelete] = useState(false);

    return (
        <AdminLayout title={category.name}>
            <AdminBreadcrumbs
                items={[
                    { label: 'Admin', href: route('admin.dashboard') },
                    { label: 'Categories', href: route('admin.categories.index') },
                    { label: category.name },
                ]}
            />

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h1 className="font-archivo text-2xl uppercase text-slate-900">{category.name}</h1>
                <div className="flex gap-2">
                    <Link
                        href={route('admin.categories.edit', category.id)}
                        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-[var(--color-primary)]"
                    >
                        Edit
                    </Link>
                    <button
                        type="button"
                        className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-bold text-rose-600"
                        onClick={() => setPendingDelete(true)}
                    >
                        Delete
                    </button>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Category information</h2>
                    <dl className="mt-3 space-y-2 text-sm">
                        <div className="flex justify-between gap-3"><dt className="text-slate-500">Name</dt><dd className="font-semibold">{category.name}</dd></div>
                        <div className="flex justify-between gap-3"><dt className="text-slate-500">Slug</dt><dd>{category.slug}</dd></div>
                        <div className="flex justify-between gap-3"><dt className="text-slate-500">Parent</dt><dd>{category.parent?.name || 'No parent'}</dd></div>
                        <div className="flex justify-between gap-3"><dt className="text-slate-500">Created</dt><dd>{formatDate(category.created_at)}</dd></div>
                        <div className="flex justify-between gap-3"><dt className="text-slate-500">Updated</dt><dd>{formatDate(category.updated_at)}</dd></div>
                    </dl>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Hierarchy</h2>
                    <div className="mt-4 flex flex-col items-start gap-2 text-sm">
                        <div className="rounded-xl border border-slate-200 px-3 py-2 text-slate-500">
                            {category.parent ? (
                                <Link href={route('admin.categories.show', category.parent.id)} className="font-semibold text-slate-900 underline">
                                    {category.parent.name}
                                </Link>
                            ) : (
                                'No parent (root category)'
                            )}
                        </div>
                        <ArrowDown className="h-4 w-4 text-slate-400" />
                        <div className="rounded-xl bg-slate-900 px-3 py-2 font-bold text-[var(--color-primary)]">
                            {category.name}
                        </div>
                        {(category.children || []).length > 0 && (
                            <>
                                <ArrowDown className="h-4 w-4 text-slate-400" />
                                <div className="flex flex-wrap gap-2">
                                    {category.children.map((child) => (
                                        <Link
                                            key={child.id}
                                            href={route('admin.categories.show', child.id)}
                                            className="rounded-xl border border-slate-200 px-3 py-2 font-semibold hover:bg-slate-50"
                                        >
                                            {child.name}
                                        </Link>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </div>

            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Media</h2>
                {(category.media || []).length === 0 ? (
                    <div className="mt-4">
                        <AdminEmptyState title="No media yet." />
                    </div>
                ) : (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {category.media.map((item) => (
                            <div key={item.id} className="overflow-hidden rounded-2xl border border-slate-200">
                                {item.type === 'video' ? (
                                    <video src={item.url} controls className="h-48 w-full bg-black object-contain" />
                                ) : (
                                    <a href={item.url} target="_blank" rel="noreferrer">
                                        <img src={item.url} alt={item.alt_text || category.name} className="h-48 w-full object-cover" />
                                    </a>
                                )}
                                <div className="space-y-1 p-3 text-sm">
                                    <div className="flex items-center justify-between">
                                        <AdminStatusBadge status={item.type === 'video' ? 'shipped' : 'active'} label={item.type} />
                                        {item.is_primary && <AdminStatusBadge status="paid" label="primary" />}
                                    </div>
                                    <p className="truncate text-xs text-slate-500">{item.path}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="mt-6">
                <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">Products</h2>
                {(category.products || []).length === 0 ? (
                    <AdminEmptyState title="No products in this category." />
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {category.products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>

            <AdminConfirmDialog
                show={pendingDelete}
                title="Delete this category?"
                message="This category cannot be deleted if it has children or attached products."
                confirmLabel="Delete"
                onClose={() => setPendingDelete(false)}
                onConfirm={() => {
                    router.delete(route('admin.categories.destroy', category.id), {
                        onFinish: () => setPendingDelete(false),
                    });
                }}
            />
        </AdminLayout>
    );
}
