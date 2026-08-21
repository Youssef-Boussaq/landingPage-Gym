import AdminBreadcrumbs from '@/Components/Admin/AdminBreadcrumbs';
import AdminLayout from '@/Layouts/AdminLayout';
import CategoryForm from '@/Pages/Admin/Categories/CategoryForm';
import { useForm } from '@inertiajs/react';

export default function CategoryCreate({ parentOptions = [] }) {
    const form = useForm({
        name: '',
        slug: '',
        parent_id: '',
        alt_text: '',
        media: [],
        primary_index: 0,
        existing_primary_id: null,
        removed_media_ids: [],
    });

    return (
        <AdminLayout title="Create category">
            <AdminBreadcrumbs
                items={[
                    { label: 'Admin', href: route('admin.dashboard') },
                    { label: 'Categories', href: route('admin.categories.index') },
                    { label: 'Create' },
                ]}
            />
            <h1 className="mb-6 font-archivo text-2xl uppercase text-slate-900">Create category</h1>
            <CategoryForm
                form={form}
                parentOptions={parentOptions}
                submitLabel="Create category"
                onSubmit={(event) => {
                    event.preventDefault();
                    form.post(route('admin.categories.store'), { forceFormData: true });
                }}
            />
        </AdminLayout>
    );
}
