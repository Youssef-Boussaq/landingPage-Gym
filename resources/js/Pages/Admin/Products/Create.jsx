import AdminBreadcrumbs from '@/Components/Admin/AdminBreadcrumbs';
import AdminLayout from '@/Layouts/AdminLayout';
import ProductForm from '@/Pages/Admin/Products/ProductForm';
import { useForm } from '@inertiajs/react';

export default function ProductCreate({ categories, types }) {
    const form = useForm({
        title: '',
        slug: '',
        type: types[0] || 'physical',
        price: '',
        sale_price: '',
        stock_quantity: '',
        manage_stock: true,
        is_active: true,
        category_ids: [],
        images: [],
        primary_index: 0,
        existing_primary_id: null,
        removed_image_ids: [],
    });

    return (
        <AdminLayout title="Nouveau produit">
            <AdminBreadcrumbs
                items={[
                    { label: 'Admin', href: route('admin.dashboard') },
                    { label: 'Products', href: route('admin.products.index') },
                    { label: 'Create' },
                ]}
            />
            <h1 className="mb-6 font-archivo text-2xl uppercase text-slate-900">Create product</h1>
            <ProductForm
                form={form}
                categories={categories}
                types={types}
                submitLabel="Créer le produit"
                onSubmit={(event) => {
                    event.preventDefault();
                    form.post(route('admin.products.store'), { forceFormData: true });
                }}
            />
        </AdminLayout>
    );
}
