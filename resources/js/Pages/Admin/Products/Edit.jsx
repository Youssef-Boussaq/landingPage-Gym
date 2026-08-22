import AdminBreadcrumbs from '@/Components/Admin/AdminBreadcrumbs';
import AdminLayout from '@/Layouts/AdminLayout';
import ProductForm from '@/Pages/Admin/Products/ProductForm';
import { router, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function ProductEdit({ product, categories, types }) {
    const filesRef  = useRef([]);
    const [submitting, setSubmitting] = useState(false);

    const form = useForm({
        title:               product.title        || '',
        description:         product.description  || '',
        slug:                product.slug         || '',
        type:                product.type         || 'physical',
        price:               product.price        || '',
        sale_price:          product.sale_price   || '',
        stock_quantity:      product.stock_quantity ?? '',
        manage_stock:        !!product.manage_stock,
        is_active:           !!product.is_active,
        category_ids:        (product.categories  || []).map((c) => c.id),
        primary_index:       0,
        existing_primary_id: product.images?.find((img) => img.is_primary)?.id || null,
        removed_image_ids:   [],
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        if (submitting) return;

        // ── Build native FormData ──────────────────────────────────────────
        // Uses POST + _method:PUT spoofing because file uploads require POST.
        // Inertia passes FormData unchanged (isFormData check in core).
        const body = new FormData();

        body.append('_method',        'PUT');
        body.append('title',          form.data.title          ?? '');
        body.append('description',    form.data.description    ?? '');
        body.append('slug',           form.data.slug           ?? '');
        body.append('type',           form.data.type           ?? '');
        body.append('price',          String(form.data.price   ?? ''));
        body.append('sale_price',     String(form.data.sale_price ?? ''));
        body.append('stock_quantity', String(form.data.stock_quantity ?? ''));
        body.append('manage_stock',   form.data.manage_stock   ? '1' : '0');
        body.append('is_active',      form.data.is_active      ? '1' : '0');
        body.append('primary_index',  String(form.data.primary_index ?? 0));

        if (form.data.existing_primary_id != null) {
            body.append('existing_primary_id', String(form.data.existing_primary_id));
        }

        (form.data.category_ids     ?? []).forEach((id)  => body.append('category_ids[]',    String(id)));
        (form.data.removed_image_ids ?? []).forEach((id) => body.append('removed_image_ids[]', String(id)));

        filesRef.current.forEach((file) =>
            body.append('images[]', file, file.name)
        );

        setSubmitting(true);
        form.clearErrors();

        router.post(route('admin.products.update', product.id), body, {
            onError:  (errors) => { form.setError(errors); setSubmitting(false); },
            onSuccess: ()      => setSubmitting(false),
            onFinish:  ()      => setSubmitting(false),
        });
    };

    return (
        <AdminLayout title={`Éditer ${product.title}`}>
            <AdminBreadcrumbs
                items={[
                    { label: 'Admin',        href: route('admin.dashboard') },
                    { label: 'Products',     href: route('admin.products.index') },
                    { label: product.title },
                ]}
            />
            <h1 className="mb-6 font-archivo text-2xl uppercase text-slate-900">
                Edit product
            </h1>
            <ProductForm
                filesRef={filesRef}
                form={form}
                submitting={submitting}
                categories={categories}
                types={types}
                existingImages={product.images || []}
                submitLabel="Enregistrer"
                onSubmit={handleSubmit}
            />
        </AdminLayout>
    );
}
