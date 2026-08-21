import AdminBreadcrumbs from '@/Components/Admin/AdminBreadcrumbs';
import AdminLayout from '@/Layouts/AdminLayout';
import ProductForm from '@/Pages/Admin/Products/ProductForm';
import { useForm } from '@inertiajs/react';

export default function ProductEdit({ product, categories, types }) {
    const form = useForm({
        title: product.title || '',
        slug: product.slug || '',
        type: product.type || 'physical',
        price: product.price || '',
        sale_price: product.sale_price || '',
        stock_quantity: product.stock_quantity ?? '',
        manage_stock: !!product.manage_stock,
        is_active: !!product.is_active,
        category_ids: (product.categories || []).map((category) => category.id),
        images: [],
        primary_index: 0,
        existing_primary_id: product.images?.find((image) => image.is_primary)?.id || null,
        removed_image_ids: [],
        _method: 'put',
    });

    return (
        <AdminLayout title={`Éditer ${product.title}`}>
            <AdminBreadcrumbs
                items={[
                    { label: 'Admin', href: route('admin.dashboard') },
                    { label: 'Products', href: route('admin.products.index') },
                    { label: product.title },
                ]}
            />
            <h1 className="mb-6 font-archivo text-2xl uppercase text-slate-900">Edit product</h1>
            <ProductForm
                form={form}
                categories={categories}
                types={types}
                existingImages={product.images || []}
                submitLabel="Enregistrer"
                onSubmit={(event) => {
                    event.preventDefault();
                    form.post(route('admin.products.update', product.id), { forceFormData: true });
                }}
            />
        </AdminLayout>
    );
}
