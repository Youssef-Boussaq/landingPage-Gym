import AdminBreadcrumbs from '@/Components/Admin/AdminBreadcrumbs';
import AdminLayout from '@/Layouts/AdminLayout';
import ProductForm from '@/Pages/Admin/Products/ProductForm';
import { router, useForm } from '@inertiajs/react';
import { useMemo, useRef, useState } from 'react';

export default function ProductCreate({ categories, types }) {
    const uploadToken = useMemo(() => crypto.randomUUID(), []);
    const filesRef   = useRef([]);

    // Separate processing flag because router.post() bypasses useForm's internal
    // processing state (form.processing would stay false if we use router.post directly).
    const [submitting, setSubmitting] = useState(false);

    const form = useForm({
        title:              '',
        description:        '',
        slug:               '',
        type:               types[0] || 'physical',
        price:              '',
        sale_price:         '',
        stock_quantity:     '',
        manage_stock:       true,
        is_active:          true,
        category_ids:       [],
        primary_index:      0,
        existing_primary_id: null,
        removed_image_ids:  [],
        upload_token:       uploadToken,
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        if (submitting) return;

        // ── Build native FormData ──────────────────────────────────────────
        // We bypass Inertia's objectToFormData entirely.
        // Inertia core passes FormData through unchanged (isFormData check),
        // so the browser's multipart boundary is set correctly by Axios.
        const body = new FormData();

        body.append('title',          form.data.title          ?? '');
        body.append('description',    form.data.description    ?? '');
        body.append('slug',           form.data.slug           ?? '');
        body.append('type',           form.data.type           ?? '');
        body.append('price',          String(form.data.price   ?? ''));
        body.append('sale_price',     String(form.data.sale_price ?? ''));
        body.append('stock_quantity', String(form.data.stock_quantity ?? ''));
        body.append('manage_stock',   form.data.manage_stock ? '1' : '0');
        body.append('is_active',      form.data.is_active      ? '1' : '0');
        body.append('primary_index',  String(form.data.primary_index ?? 0));
        body.append('upload_token',   form.data.upload_token   ?? '');

        (form.data.category_ids ?? []).forEach((id) =>
            body.append('category_ids[]', String(id))
        );

        // Append files using native browser File API — no serialization issues
        filesRef.current.forEach((file) =>
            body.append('images[]', file, file.name)
        );

        setSubmitting(true);
        form.clearErrors();

        router.post(route('admin.products.store'), body, {
            onError:  (errors) => { form.setError(errors); setSubmitting(false); },
            onSuccess: ()      => setSubmitting(false),
            onFinish:  ()      => setSubmitting(false),
        });
    };

    return (
        <AdminLayout title="Nouveau produit">
            <AdminBreadcrumbs
                items={[
                    { label: 'Admin',     href: route('admin.dashboard') },
                    { label: 'Products',  href: route('admin.products.index') },
                    { label: 'Create' },
                ]}
            />

            <h1 className="mb-6 font-archivo text-2xl uppercase text-slate-900">
                Create product
            </h1>

            <ProductForm
                filesRef={filesRef}
                form={form}
                submitting={submitting}
                categories={categories}
                types={types}
                uploadToken={uploadToken}
                submitLabel="Créer le produit"
                onSubmit={handleSubmit}
            />
        </AdminLayout>
    );
}