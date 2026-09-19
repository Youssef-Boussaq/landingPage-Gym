
import AdminBreadcrumbs from '@/Components/Admin/AdminBreadcrumbs';
import AdminLayout from '@/Layouts/AdminLayout';

import { Link, router, useForm } from '@inertiajs/react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { useRef, useState } from 'react';

export default function Edit({ promotion }) {
    const fileRef = useRef(null);

    const [preview, setPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const form = useForm({
        title: promotion.title || '',
        description: promotion.description || '',
        image: null,
        is_active: !!promotion.is_active,
        sort_order: promotion.sort_order ?? 0,
    });

    const currentImage = promotion.image
        ? `/storage/${promotion.image}`
        : null;

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        form.setData('image', file);

        setPreview(URL.createObjectURL(file));
    };

    const removeNewImage = () => {
        form.setData('image', null);
        setPreview(null);

        if (fileRef.current) {
            fileRef.current.value = '';
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (submitting) {
            return;
        }

        const body = new FormData();

        // Laravel method spoofing
        body.append('_method', 'PUT');

        body.append(
            'title',
            form.data.title ?? ''
        );

        body.append(
            'description',
            form.data.description ?? ''
        );

        body.append(
            'is_active',
            form.data.is_active ? '1' : '0'
        );

        body.append(
            'sort_order',
            String(form.data.sort_order ?? 0)
        );

        if (form.data.image) {
            body.append(
                'image',
                form.data.image,
                form.data.image.name
            );
        }

        setSubmitting(true);
        form.clearErrors();

        router.post(
            route(
                'admin.store-promotions.update',
                promotion.id
            ),
            body,
            {
                onError: (errors) => {
                    form.setError(errors);
                },

                onFinish: () => {
                    setSubmitting(false);
                },
            }
        );
    };

    return (
        <AdminLayout title="Modifier la promotion">
            <AdminBreadcrumbs
                items={[
                    { label: 'Admin', href: route('admin.dashboard') },
                    { label: 'Store Promotions', href: route('admin.store-promotions.index') },
                    { label: 'Edit' },
                ]}
            />

            <h1 className="mb-6 font-archivo text-2xl uppercase text-slate-900">
                Edit promotion
            </h1>

            <form
                onSubmit={handleSubmit}
                className="max-w-4xl"
            >
                <div className="space-y-6">

                    {/* Promotion content */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-5 font-archivo text-lg uppercase text-slate-900">
                            Promotion
                        </h2>

                        <div className="space-y-5">

                            {/* Title */}
                            <div>
                                <label
                                    htmlFor="title"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Title
                                </label>

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
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#9de500] focus:ring-2 focus:ring-[#9de500]/20"
                                />

                                {form.errors.title && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {form.errors.title}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label
                                    htmlFor="description"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Description
                                </label>

                                <textarea
                                    id="description"
                                    rows={4}
                                    value={form.data.description}
                                    onChange={(event) =>
                                        form.setData(
                                            'description',
                                            event.target.value
                                        )
                                    }
                                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#9de500] focus:ring-2 focus:ring-[#9de500]/20"
                                />

                                {form.errors.description && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {form.errors.description}
                                    </p>
                                )}
                            </div>

                            {/* Sort order */}
                            <div>
                                <label
                                    htmlFor="sort_order"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Ordre d'affichage
                                </label>

                                <input
                                    id="sort_order"
                                    type="number"
                                    min="0"
                                    value={form.data.sort_order}
                                    onChange={(event) =>
                                        form.setData(
                                            'sort_order',
                                            event.target.value
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#9de500] focus:ring-2 focus:ring-[#9de500]/20"
                                />

                                {form.errors.sort_order && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {form.errors.sort_order}
                                    </p>
                                )}
                            </div>

                            {/* Active */}
                            <label className="flex cursor-pointer items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={form.data.is_active}
                                    onChange={(event) =>
                                        form.setData(
                                            'is_active',
                                            event.target.checked
                                        )
                                    }
                                    className="h-4 w-4 rounded border-slate-300 text-[#9de500] focus:ring-[#9de500]"
                                />

                                <span className="text-sm font-semibold text-slate-700">
                                    Promotion active
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Image */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-5 font-archivo text-lg uppercase text-slate-900">
                            Image
                        </h2>

                        {preview ? (
                            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                                <img
                                    src={preview}
                                    alt={form.data.title}
                                    className="h-64 w-full object-cover"
                                />

                                <button
                                    type="button"
                                    onClick={removeNewImage}
                                    className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 shadow-md transition hover:bg-red-50 hover:text-red-600"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ) : currentImage ? (
                            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                                <img
                                    src={currentImage}
                                    alt={promotion.title}
                                    className="h-64 w-full object-cover"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        fileRef.current?.click()
                                    }
                                    className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-md transition hover:bg-slate-50"
                                >
                                    <ImagePlus className="h-4 w-4" />
                                    Changer l'image
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() =>
                                    fileRef.current?.click()
                                }
                                className="flex min-h-64 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 text-center transition hover:border-[#9de500] hover:bg-[#9de500]/5"
                            >
                                <ImagePlus className="mb-3 h-10 w-10 text-slate-400" />

                                <span className="text-sm font-semibold text-slate-700">
                                    Ajouter une image
                                </span>

                                <span className="mt-1 text-xs text-slate-400">
                                    Cliquez pour sélectionner une image
                                </span>
                            </button>
                        )}

                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />

                        {form.errors.image && (
                            <p className="mt-2 text-sm text-red-600">
                                {form.errors.image}
                            </p>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex items-center justify-end gap-3">
                    <Link
                        href={route(
                            'admin.store-promotions.index'
                        )}
                        className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        Annuler
                    </Link>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#9de500] px-6 py-3 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-[#8cd000] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
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
