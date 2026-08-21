import AdminBreadcrumbs from '@/Components/Admin/AdminBreadcrumbs';
import AdminLayout from '@/Layouts/AdminLayout';
import CategoryForm from '@/Pages/Admin/Categories/CategoryForm';
import { useForm } from '@inertiajs/react';

export default function CategoryEdit({ category, parentOptions = [] }) {
    const form = useForm({
        name: category.name || '',
        slug: category.slug || '',
        parent_id: category.parent_id ?? '',
        alt_text: '',
        media: [],
        primary_index: 0,
        existing_primary_id: category.media?.find((item) => item.is_primary)?.id || null,
        removed_media_ids: [],
        _method: 'put',
    });

    return (
        <AdminLayout title={`Edit ${category.name}`}>
            <AdminBreadcrumbs
                items={[
                    { label: 'Admin', href: route('admin.dashboard') },
                    { label: 'Categories', href: route('admin.categories.index') },
                    { label: category.name },
                ]}
            />
            <h1 className="mb-6 font-archivo text-2xl uppercase text-slate-900">Edit category</h1>
            <CategoryForm
                form={form}
                parentOptions={parentOptions}
                existingMedia={category.media || []}
                submitLabel="Save category"
                onSubmit={(event) => {
                    event.preventDefault();
                    form.post(route('admin.categories.update', category.id), { forceFormData: true });
                }}
            />
        </AdminLayout>
    );
}
