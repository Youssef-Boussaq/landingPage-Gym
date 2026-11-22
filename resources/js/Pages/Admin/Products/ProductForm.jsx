import AdminProductPreview from '@/Components/Admin/AdminProductPreview';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import RichTextEditor from '@/Components/Admin/RichTextEditor';
import ProductCategorySelector from '@/Components/Admin/Product/ProductCategorySelector';

import { useEffect, useMemo, useState } from 'react';
export default function ProductForm({
    form,
    categories = [],
    types = [],
    existingImages = [],
    filesRef,
    uploadToken,
}) {
    /*
    |--------------------------------------------------------------------------
    | Categories
    |--------------------------------------------------------------------------
    */

    // Local copy because a new category can be created without
    // reloading the page.
    const [localCategories, setLocalCategories] = useState(categories);

    /*
    |--------------------------------------------------------------------------
    | Images
    |--------------------------------------------------------------------------
    */

    const [previews, setPreviews] = useState([]);

    /*
    |--------------------------------------------------------------------------
    | Selected categories
    |--------------------------------------------------------------------------
    */

    const selectedCategories = useMemo(() => {
        const selectedIds = new Set(
            (form.data.category_ids || []).map(Number)
        );

        return localCategories.filter((category) =>
            selectedIds.has(Number(category.id))
        );
    }, [localCategories, form.data.category_ids]);

    /*
    |--------------------------------------------------------------------------
    | Existing images
    |--------------------------------------------------------------------------
    */

    const remainingExisting = useMemo(() => {
        const removedPaths = new Set(
            form.data.removed_image_paths || []
        );

        return existingImages.filter(
            (image) => !removedPaths.has(image.path)
        );
    }, [existingImages, form.data.removed_image_paths]);
    /*
    |--------------------------------------------------------------------------
    | Preview images
    |--------------------------------------------------------------------------
    */

    const previewImages = useMemo(() => {
        return [
            ...remainingExisting.map((image) => ({
                id: `existing-${image.id}`,
                url: image.url,
                path: image.path,
                type: 'existing',
                originalId: image.id,
                alt: image.alt_text || '',
                isPrimary:
                    Number(form.data.existing_primary_id) ===
                    Number(image.id),
            })),

            ...previews.map((preview, index) => ({
                id: preview.id,
                url: preview.url,
                type: 'new',
                fileIndex: index,
                alt: '',
                isPrimary:
                    form.data.existing_primary_id === null &&
                    Number(form.data.primary_index) === index,
            })),
        ];
    }, [
        remainingExisting,
        previews,
        form.data.existing_primary_id,
        form.data.primary_index,
    ]);
    /*
    |--------------------------------------------------------------------------
    | Sync categories when server props change
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        setLocalCategories(categories);
    }, [categories]);

    /*
    |--------------------------------------------------------------------------
    | Image helpers
    |--------------------------------------------------------------------------
    */

    const rebuildPreviews = (files) => {
        // Revoke previous object URLs
        previews.forEach((preview) => {
            URL.revokeObjectURL(preview.url);
        });

        const nextPreviews = files.map((file, index) => ({
            id: `${file.name}-${file.size}-${file.lastModified}-${index}`,
            file,
            url: URL.createObjectURL(file),
        }));

        setPreviews(nextPreviews);
    };

    /*
    |--------------------------------------------------------------------------
    | Handle new image files
    |--------------------------------------------------------------------------
    */

    const handleFiles = (event) => {
        const files = Array.from(event.target.files || []);

        if (!files.length) {
            return;
        }

        filesRef.current = files;

        rebuildPreviews(files);

        // New files become the source of truth for the primary image.
        form.setData('existing_primary_id', null);

        if (form.data.primary_index >= files.length) {
            form.setData('primary_index', 0);
        }

        // Allow selecting the same file again.
        event.target.value = '';
    };

    /*
    |--------------------------------------------------------------------------
    | Remove new image
    |--------------------------------------------------------------------------
    */

    const removeNewImage = (index) => {
        const currentFiles = [...(filesRef.current || [])];

        if (!currentFiles[index]) {
            return;
        }

        currentFiles.splice(index, 1);

        filesRef.current = currentFiles;

        rebuildPreviews(currentFiles);

        /*
         * Fix primary index after removing an image.
         */
        const currentPrimary = Number(form.data.primary_index);

        if (!currentFiles.length) {
            form.setData('primary_index', 0);
            return;
        }

        if (currentPrimary === index) {
            form.setData('primary_index', 0);
        } else if (currentPrimary > index) {
            form.setData('primary_index', currentPrimary - 1);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Remove existing image
    |--------------------------------------------------------------------------
    */

    const removeExistingImage = (imagePath) => {
        const removedPaths = [
            ...(form.data.removed_image_paths || []),
        ];

        if (!removedPaths.includes(imagePath)) {
            removedPaths.push(imagePath);
        }

        form.setData('removed_image_paths', removedPaths);
    };

    /*
    |--------------------------------------------------------------------------
    | Set primary image
    |--------------------------------------------------------------------------
    */

    const setPrimaryExisting = (imageId) => {
        form.setData('existing_primary_id', imageId);
        form.setData('primary_index', null);
    };

    const setPrimaryNew = (index) => {
        form.setData('primary_index', index);
        form.setData('existing_primary_id', null);
    };

    /*
    |--------------------------------------------------------------------------
    | Category created
    |--------------------------------------------------------------------------
    */

    const handleCategoryCreated = (newCategory) => {
        setLocalCategories((previous) => [
            ...previous,
            newCategory,
        ]);
    };

    return (
        <div className="space-y-8">
            {/* =========================================================
                BASIC INFORMATION
            ========================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Informations générales
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Configurez les informations principales du produit.
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Product title */}
                    <div>
                        <InputLabel
                            htmlFor="title"
                            value="Nom du produit"
                        />

                        <input
                            id="title"
                            type="text"
                            value={form.data.title}
                            onChange={(event) =>
                                form.setData(
                                    'title',
                                    event.target.value
                                )
                            }
                            className="mt-2 block w-full rounded-xl border-slate-300 text-sm shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                            placeholder="Ex: Whey Protein Isolate"
                        />

                        <InputError
                            message={form.errors.title}
                            className="mt-2"
                        />
                    </div>

                    {/* Type + Category */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Product type */}
                        <div>
                            <InputLabel
                                htmlFor="type"
                                value="Type"
                            />

                            <select
                                id="type"
                                value={form.data.type}
                                onChange={(event) => {
                                    const nextType = event.target.value;
                                    if (nextType === 'digital') {
                                        form.setData({
                                            ...form.data,
                                            type: 'digital',
                                            stock_quantity: '',
                                            manage_stock: false,
                                        });
                                    } else {
                                        form.setData('type', nextType);
                                    }
                                }}
                                className="mt-2 block w-full rounded-xl border-slate-300 text-sm shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                            >
                                {types.map((type) => (
                                    <option
                                        key={type.value ?? type}
                                        value={type.value ?? type}
                                    >
                                        {type.label ?? type}
                                    </option>
                                ))}
                            </select>

                            <InputError
                                message={form.errors.type}
                                className="mt-2"
                            />
                        </div>

                        {/* Categories */}
                        <ProductCategorySelector
                            categories={localCategories}
                            selectedIds={
                                form.data.category_ids || []
                            }
                            onChange={(ids) =>
                                form.setData(
                                    'category_ids',
                                    ids
                                )
                            }
                            onCategoryCreated={
                                handleCategoryCreated
                            }
                            error={
                                form.errors.category_ids
                            }
                        />
                    </div>
                </div>
            </section>

            {/* =========================================================
                PRICING
            ========================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-slate-900">
                        {form.data.type === 'digital' ? 'Tarification' : 'Prix et stock'}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        {form.data.type === 'digital'
                            ? 'Définissez le prix du produit digital (accès immédiat, aucun stock physique nécessaire).'
                            : 'Définissez le prix et la disponibilité du produit.'}
                    </p>
                </div>

                <div className={`grid gap-6 ${form.data.type === 'digital' ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
                    {/* Price */}
                    <div>
                        <InputLabel
                            htmlFor="price"
                            value="Prix"
                        />

                        <div className="relative mt-2">
                            <input
                                id="price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.data.price}
                                onChange={(event) =>
                                    form.setData(
                                        'price',
                                        event.target.value
                                    )
                                }
                                className="block w-full rounded-xl border-slate-300 pr-14 text-sm shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                                placeholder="0.00"
                            />

                            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-slate-400">
                                MAD
                            </span>
                        </div>

                        <InputError
                            message={form.errors.price}
                            className="mt-2"
                        />
                    </div>

                    {/* Sale price */}
                    <div>
                        <InputLabel
                            htmlFor="sale_price"
                            value="Prix promotionnel"
                        />

                        <div className="relative mt-2">
                            <input
                                id="sale_price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={
                                    form.data.sale_price ?? ''
                                }
                                onChange={(event) =>
                                    form.setData(
                                        'sale_price',
                                        event.target.value
                                    )
                                }
                                className="block w-full rounded-xl border-slate-300 pr-14 text-sm shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                                placeholder="Optionnel"
                            />

                            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-slate-400">
                                MAD
                            </span>
                        </div>

                        <InputError
                            message={form.errors.sale_price}
                            className="mt-2"
                        />
                    </div>

                    {/* Stock - HIDDEN for digital products */}
                    {form.data.type !== 'digital' && (
                        <div>
                            <InputLabel
                                htmlFor="stock_quantity"
                                value="Stock"
                            />

                            <input
                                id="stock_quantity"
                                type="number"
                                min="0"
                                value={
                                    form.data.stock_quantity ?? ''
                                }
                                onChange={(event) =>
                                    form.setData(
                                        'stock_quantity',
                                        event.target.value
                                    )
                                }
                                className="mt-2 block w-full rounded-xl border-slate-300 text-sm shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                                placeholder="0"
                            />

                            <InputError
                                message={
                                    form.errors.stock_quantity
                                }
                                className="mt-2"
                            />
                        </div>
                    )}
                </div>

                {/* Manage stock - HIDDEN for digital products */}
                {form.data.type !== 'digital' && (
                    <>
                        <label className="mt-6 flex cursor-pointer items-center gap-3">
                            <input
                                type="checkbox"
                                checked={
                                    Boolean(form.data.manage_stock)
                                }
                                onChange={(event) =>
                                    form.setData(
                                        'manage_stock',
                                        event.target.checked
                                    )
                                }
                                className="h-4 w-4 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                            />

                            <span className="text-sm font-medium text-slate-700">
                                Gérer le stock
                            </span>
                        </label>

                        <InputError
                            message={form.errors.manage_stock}
                            className="mt-2"
                        />
                    </>
                )}
            </section>

            {/* =========================================================
                DESCRIPTION
            ========================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Description
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Ajoutez une description détaillée du produit.
                    </p>
                </div>

                <RichTextEditor
                    value={form.data.description || ''}
                    onChange={(value) => form.setData('description', value)}
                    uploadToken={uploadToken}
                />

                <InputError
                    message={form.errors.description}
                    className="mt-2"
                />
            </section>

            {/* =========================================================
                IMAGES
            ========================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Images du produit
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Ajoutez les images et choisissez l'image principale.
                    </p>
                </div>

                {/* Upload */}
                <div>
                    <label
                        htmlFor="product-images"
                        className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 px-6 py-8 text-center transition hover:border-[var(--color-primary)] hover:bg-lime-50/30"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                            <svg
                                className="h-6 w-6 text-slate-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.8"
                                    d="M12 16V4m0 0L8 8m4-4l4 4M4 16.5v1A2.5 2.5 0 006.5 20h11a2.5 2.5 0 002.5-2.5v-1"
                                />
                            </svg>
                        </div>

                        <span className="mt-3 text-sm font-medium text-slate-700">
                            Cliquez pour ajouter des images
                        </span>

                        <span className="mt-1 text-xs text-slate-400">
                            PNG, JPG, WEBP
                        </span>
                    </label>

                    <input
                        id="product-images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFiles}
                        className="hidden"
                    />

                    <InputError
                        message={form.errors.images}
                        className="mt-2"
                    />
                </div>

                {/* Existing + new images */}
                {previewImages.length > 0 && (
                    <div className="mt-6">
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                            {previewImages.map(
                                (image) => (
                                    <div
                                        key={image.id}
                                        className={`group relative overflow-hidden rounded-2xl border bg-white ${image.isPrimary
                                            ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20'
                                            : 'border-slate-200'
                                            }`}
                                    >
                                        <div className="aspect-square overflow-hidden bg-slate-100">
                                            <img
                                                src={image.url}
                                                alt={
                                                    image.alt ||
                                                    'Product image'
                                                }
                                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                            />
                                        </div>

                                        {/* Primary badge */}
                                        {image.isPrimary && (
                                            <div className="absolute left-2 top-2 rounded-full bg-[var(--color-primary)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-950">
                                                Principale
                                            </div>
                                        )}

                                        {/* Remove */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (
                                                    image.type ===
                                                    'existing'
                                                ) {
                                                    removeExistingImage(image.path);
                                                } else {
                                                    removeNewImage(
                                                        image.fileIndex
                                                    );
                                                }
                                            }}
                                            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-slate-600 opacity-0 shadow-sm transition group-hover:opacity-100 hover:bg-red-50 hover:text-red-600"
                                            aria-label="Supprimer l'image"
                                        >
                                            ×
                                        </button>

                                        {/* Primary button */}
                                        {!image.isPrimary && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (
                                                        image.type ===
                                                        'existing'
                                                    ) {
                                                        setPrimaryExisting(
                                                            image.originalId
                                                        );
                                                    } else {
                                                        setPrimaryNew(
                                                            image.fileIndex
                                                        );
                                                    }
                                                }}
                                                className="absolute bottom-2 left-2 right-2 rounded-lg bg-white/95 px-3 py-2 text-xs font-medium text-slate-700 opacity-0 shadow-sm transition group-hover:opacity-100 hover:bg-[var(--color-primary)] hover:text-slate-950"
                                            >
                                                Définir comme principale
                                            </button>
                                        )}
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}

                <InputError
                    message={
                        form.errors.primary_index ||
                        form.errors.existing_primary_id
                    }
                    className="mt-3"
                />
            </section>

            {/* =========================================================
                PREVIEW
            ========================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Aperçu
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Aperçu du produit tel qu'il apparaîtra dans la boutique.
                    </p>
                </div>

                <AdminProductPreview
                    product={{
                        ...form.data,
                        images: previewImages,
                        categories: selectedCategories,
                    }}
                />
            </section>
        </div>
    );
}