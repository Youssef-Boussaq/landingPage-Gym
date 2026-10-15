import AdminBreadcrumbs from '@/Components/Admin/AdminBreadcrumbs';
import AdminLayout from '@/Layouts/AdminLayout';
import ProductForm from '@/Pages/Admin/Products/ProductForm';

import { router, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function ProductEdit({ product, categories, types }) {
    const filesRef = useRef([]);
    const [submitting, setSubmitting] = useState(false);

    const primaryImage = product.images?.find(
        (image) => image.is_primary
    );
    const form = useForm({
        title: product.title || '',
        description: product.description || '',
        slug: product.slug || '',
        type: product.type || 'physical',
        price: product.price || '',
        sale_price: product.sale_price || '',
        stock_quantity: product.stock_quantity ?? '',
        manage_stock: !!product.manage_stock,
        is_active: !!product.is_active,

        category_ids: (product.categories || []).map(
            (category) => category.id
        ),

        primary_index: null,

        existing_primary_path:
            primaryImage?.path || null,

        removed_image_paths: [],
    });

    const handleSubmit = (event) => {
        event.preventDefault();

        if (submitting) {
            return;
        }

        const body = new FormData();

        // Laravel method spoofing
        body.append('_method', 'PUT');

        body.append('title', form.data.title ?? '');
        body.append('description', form.data.description ?? '');
        body.append('slug', form.data.slug ?? '');
        body.append('type', form.data.type ?? '');

        body.append(
            'price',
            String(form.data.price ?? '')
        );

        body.append(
            'sale_price',
            String(form.data.sale_price ?? '')
        );

        body.append(
            'stock_quantity',
            String(form.data.stock_quantity ?? '')
        );

        body.append(
            'manage_stock',
            form.data.manage_stock ? '1' : '0'
        );

        body.append(
            'is_active',
            form.data.is_active ? '1' : '0'
        );



        form.data.category_ids?.forEach((id) => {
            body.append(
                'category_ids[]',
                String(id)
            );
        });

        if (form.data.existing_primary_id) {
            body.append(
                'existing_primary_id',
                form.data.existing_primary_id
            );
        }

        if (form.data.primary_index !== null) {
            body.append(
                'primary_index',
                form.data.primary_index
            );
        }

        form.data.removed_image_ids?.forEach((id) => {
            body.append(
                'removed_image_ids[]',
                id
            );
        });

        filesRef.current.forEach((file) => {
            body.append(
                'images[]',
                file,
                file.name
            );
        });

        setSubmitting(true);
        form.clearErrors();

        router.post(
            route(
                'admin.products.update',
                product.id
            ),
            body,
            {
                onError: (errors) => {
                    form.setError(errors);
                },

                onSuccess: () => {
                    // Laravel/Inertia retourne les nouvelles données
                },

                onFinish: () => {
                    setSubmitting(false);
                },
            }
        );
    };

    return (
        <AdminLayout title={`Éditer ${product.title}`}>
            <AdminBreadcrumbs
                items={[
                    {
                        label: 'Admin',
                        href: route('admin.dashboard'),
                    },
                    {
                        label: 'Products',
                        href: route('admin.products.index'),
                    },
                    {
                        label: product.title,
                    },
                ]}
            />

            <h1 className="mb-6 font-archivo text-2xl uppercase text-slate-900">
                Edit product
            </h1>

            <form onSubmit={handleSubmit}>
                <ProductForm
                    filesRef={filesRef}
                    form={form}
                    submitting={submitting}
                    categories={categories}
                    types={types}
                    existingImages={product.images || []}
                />

                <div className="mt-8 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={() =>
                            router.get(
                                route(
                                    'admin.products.index'
                                )
                            )
                        }
                        disabled={submitting}
                        className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Annuler
                    </button>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-6 py-3 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {submitting ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                                Enregistrement...
                            </>
                        ) : (
                            'Enregistrer'
                        )}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}