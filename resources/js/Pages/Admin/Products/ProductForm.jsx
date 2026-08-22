import AdminProductPreview from '@/Components/Admin/AdminProductPreview';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import RichTextEditor from '@/Components/Admin/RichTextEditor';
import { useMemo, useState } from 'react';

/**
 * ProductForm
 *
 * File objects are stored in `filesRef` (a React ref passed from the parent),
 * NOT in Inertia's form.data. This is critical because Inertia's useForm
 * calls lodash.cloneDeep on form.data on every setData() call, and
 * cloneDeep turns File objects into empty plain objects {}, causing
 * PHP to report "The images.N failed to upload." errors.
 *
 * At submit time, the parent uses form.transform() to inject filesRef.current
 * into the request data right before Inertia builds the HTTP request —
 * after any cloneDeep operations have already run.
 */
export default function ProductForm({
    form,
    filesRef,
    submitting = false,   // tracks router.post() lifecycle (form.processing not used)
    categories,
    types,
    existingImages = [],
    uploadToken = null,
    submitLabel,
    onSubmit,
}) {
    const [previews, setPreviews] = useState([]);

    const rebuildPreviews = (files) => {
        // Revoke old object URLs to avoid memory leaks
        setPreviews((prev) => {
            prev.forEach((url) => URL.revokeObjectURL(url));
            return files.map((file) => URL.createObjectURL(file));
        });
    };

    const selectedCategories = categories.filter((category) =>
        (form.data.category_ids || []).map(String).includes(String(category.id))
    );

    const remainingExisting = existingImages.filter(
        (image) => !(form.data.removed_image_ids || []).includes(image.id)
    );

    const previewImages = useMemo(() => {
        const existing = remainingExisting.map((image) => ({
            url: image.url,
            is_primary: form.data.existing_primary_id
                ? image.id === form.data.existing_primary_id
                : image.is_primary,
        }));

        const fresh = previews.map((url, index) => ({
            url,
            is_primary: !form.data.existing_primary_id && form.data.primary_index === index,
        }));

        const combined = [...existing, ...fresh];

        if (combined.length && !combined.some((image) => image.is_primary)) {
            combined[0].is_primary = true;
        }

        return combined;
    }, [remainingExisting, previews, form.data.existing_primary_id, form.data.primary_index]);

    const previewProduct = {
        title: form.data.title || 'Titre du produit',
        description: form.data.description || 'Description du produit',
        price: form.data.price || 0,
        sale_price: form.data.sale_price || null,
        type: form.data.type,
        stock_quantity: form.data.stock_quantity,
        manage_stock: form.data.manage_stock,
        is_active: form.data.is_active,
        categories: selectedCategories,
        images: previewImages,
    };

    const onFiles = (event) => {
        const files = Array.from(event.target.files || []);
        // Store in the ref (safe from cloneDeep), not in form.data
        filesRef.current = files;
        rebuildPreviews(files);
        form.setData('primary_index', 0);
    };

    const removeNewImage = (index) => {
        const next = [...filesRef.current];
        next.splice(index, 1);
        filesRef.current = next;
        rebuildPreviews(next);
        form.setData(
            'primary_index',
            form.data.primary_index >= next.length ? 0 : form.data.primary_index
        );
    };

    return (
        <form onSubmit={onSubmit} className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div>
                    <InputLabel value="Title" />
                    <input
                        className="mt-1 w-full rounded-xl border-slate-200 text-sm"
                        value={form.data.title}
                        onChange={(event) => form.setData('title', event.target.value)}
                    />
                    <InputError message={form.errors.title} className="mt-1" />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Description
                    </label>

                    <RichTextEditor
                        value={form.data.description}
                        onChange={(value) => form.setData('description', value)}
                        uploadToken={uploadToken}
                    />

                    {form.errors.description && (
                        <p className="mt-1 text-sm text-red-600">
                            {form.errors.description}
                        </p>
                    )}
                </div>
                <div>
                    <InputLabel value="Slug" />
                    <input
                        className="mt-1 w-full rounded-xl border-slate-200 text-sm"
                        value={form.data.slug}
                        onChange={(event) => form.setData('slug', event.target.value)}
                        placeholder="généré automatiquement si vide"
                    />
                    <InputError message={form.errors.slug} className="mt-1" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <InputLabel value="Type" />
                        <select
                            className="mt-1 w-full rounded-xl border-slate-200 text-sm"
                            value={form.data.type}
                            onChange={(event) => form.setData('type', event.target.value)}
                        >
                            {types.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        <InputError message={form.errors.type} className="mt-1" />
                    </div>
                    <div>
                        <InputLabel value="Catégories" />
                        <select
                            multiple
                            className="mt-1 h-32 w-full rounded-xl border-slate-200 text-sm"
                            value={form.data.category_ids.map(String)}
                            onChange={(event) => form.setData(
                                'category_ids',
                                Array.from(event.target.selectedOptions).map((option) => Number(option.value))
                            )}
                        >
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.label || category.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={form.errors.category_ids} className="mt-1" />
                    </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <InputLabel value="Price (MAD)" />
                        <input
                            type="number"
                            step="0.01"
                            className="mt-1 w-full rounded-xl border-slate-200 text-sm"
                            value={form.data.price}
                            onChange={(event) => form.setData('price', event.target.value)}
                        />
                        <InputError message={form.errors.price} className="mt-1" />
                    </div>
                    <div>
                        <InputLabel value="Sale price (MAD)" />
                        <input
                            type="number"
                            step="0.01"
                            className="mt-1 w-full rounded-xl border-slate-200 text-sm"
                            value={form.data.sale_price ?? ''}
                            onChange={(event) => form.setData('sale_price', event.target.value || null)}
                        />
                        <InputError message={form.errors.sale_price} className="mt-1" />
                    </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <InputLabel value="Stock quantity" />
                        <input
                            type="number"
                            className="mt-1 w-full rounded-xl border-slate-200 text-sm"
                            value={form.data.stock_quantity ?? ''}
                            onChange={(event) => form.setData('stock_quantity', event.target.value)}
                        />
                        <InputError message={form.errors.stock_quantity} className="mt-1" />
                    </div>
                    <div className="flex items-end gap-6 pb-2">
                        <label className="inline-flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={!!form.data.manage_stock}
                                onChange={(event) => form.setData('manage_stock', event.target.checked)}
                            />
                            Manage stock
                        </label>
                        <label className="inline-flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={!!form.data.is_active}
                                onChange={(event) => form.setData('is_active', event.target.checked)}
                            />
                            Active
                        </label>
                    </div>
                </div>

                {remainingExisting.length > 0 && (
                    <div>
                        <InputLabel value="Images existantes" />
                        <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-4">
                            {remainingExisting.map((image) => (
                                <div key={image.id} className="relative">
                                    <img src={image.url} alt="" className="h-24 w-full rounded-xl object-cover" />
                                    <button
                                        type="button"
                                        className="absolute left-1 top-1 rounded bg-white px-1.5 text-[10px] font-bold"
                                        onClick={() => form.setData('existing_primary_id', image.id)}
                                    >
                                        {form.data.existing_primary_id === image.id || (!form.data.existing_primary_id && image.is_primary)
                                            ? 'Primary'
                                            : 'Make primary'}
                                    </button>
                                    <button
                                        type="button"
                                        className="absolute right-1 top-1 rounded bg-rose-600 px-1.5 text-[10px] font-bold text-white"
                                        onClick={() => form.setData('removed_image_ids', [...form.data.removed_image_ids, image.id])}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <InputLabel value="Nouvelles images" />
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="mt-1 block w-full text-sm"
                        onChange={onFiles}
                    />
                    {/* General array-level error (required, min:1) */}
                    <InputError message={form.errors.images} className="mt-1" />
                    {previews.length > 0 && (
                        <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
                            {previews.map((url, index) => (
                                <div key={url} className="relative">
                                    <img src={url} alt="" className="h-24 w-full rounded-xl object-cover" />
                                    <button
                                        type="button"
                                        className="absolute left-1 top-1 rounded bg-white px-1.5 text-[10px] font-bold"
                                        onClick={() => {
                                            form.setData('primary_index', index);
                                            form.setData('existing_primary_id', null);
                                        }}
                                    >
                                        {form.data.primary_index === index && !form.data.existing_primary_id ? 'Primary' : 'Make primary'}
                                    </button>
                                    <button
                                        type="button"
                                        className="absolute right-1 top-1 rounded bg-rose-600 px-1.5 text-[10px] font-bold text-white"
                                        onClick={() => removeNewImage(index)}
                                    >
                                        Remove
                                    </button>
                                    {/* Per-image error (images.0, images.1, …) */}
                                    {form.errors[`images.${index}`] && (
                                        <p className="mt-1 text-[10px] text-rose-600">
                                            {form.errors[`images.${index}`]}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    {/* Show per-image errors even when there are no previews (edge case) */}
                    {previews.length === 0 && Object.keys(form.errors).some((k) => k.startsWith('images.')) && (
                        <div className="mt-1 space-y-0.5">
                            {Object.entries(form.errors)
                                .filter(([k]) => k.startsWith('images.'))
                                .map(([k, msg]) => (
                                    <InputError key={k} message={msg} />
                                ))}
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={form.processing || submitting}
                    className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-[#9de500] disabled:opacity-60"
                >
                    {submitting ? 'Envoi en cours…' : submitLabel}
                </button>
            </div>

            <div className="xl:sticky xl:top-24">
                <AdminProductPreview product={previewProduct} />
            </div>
        </form>
    );
}
