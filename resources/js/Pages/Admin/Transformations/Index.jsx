import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Transformations from '@/Components/Landing/Transformations';
import {
    Plus, Save, Send, Eye, Pencil, Trash2, Power,
    ChevronDown, ChevronUp, Upload, X, Images,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────
   Shared tiny UI atoms
───────────────────────────────────────────────────────────────────── */
function Field({ label, error, children }) {
    return (
        <div>
            <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-700">
                {label}
            </label>
            {children}
            {error && <p className="mt-1 text-xs font-semibold text-rose-600">{error}</p>}
        </div>
    );
}

function TextInput({ value, onChange, placeholder, maxLength, multiline, ...rest }) {
    const cls =
        'w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-lime-500 focus:ring-2 focus:ring-lime-100';
    return multiline ? (
        <textarea
            rows={3}
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            className={cls}
            {...rest}
        />
    ) : (
        <input
            type="text"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            className={cls}
            {...rest}
        />
    );
}

/* ─────────────────────────────────────────────────────────────────────
   Image upload field — Before or After
───────────────────────────────────────────────────────────────────── */
function ImageUploadField({ label, previewUrl, fieldName, removeFieldName, onFile, onRemove, error }) {
    return (
        <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-700">
                {label}
            </label>
            {previewUrl && (
                <div className="relative mb-3 inline-block">
                    <img
                        src={previewUrl}
                        alt={label}
                        className="h-32 w-auto rounded-xl border border-slate-200 bg-slate-50 object-cover shadow-sm"
                    />
                    <button
                        type="button"
                        onClick={onRemove}
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white shadow hover:bg-rose-600"
                    >
                        <X size={11} />
                    </button>
                </div>
            )}
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500 transition hover:border-lime-400 hover:text-lime-700">
                <Upload size={16} />
                <span>{previewUrl ? 'Replace image' : 'Upload image'}</span>
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
                />
            </label>
            {error && <p className="mt-1 text-xs font-semibold text-rose-600">{error}</p>}
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────────
   Transformation Modal — Create / Edit
───────────────────────────────────────────────────────────────────── */
function TransformationModal({ transformation, onClose }) {
    const isEdit = Boolean(transformation?.id);

    const { data, setData, post, processing, errors } = useForm({
        title:               transformation?.title        ?? '',
        program:             transformation?.program      ?? '',
        before_image_alt:    transformation?.beforeImageAlt ?? '',
        after_image_alt:     transformation?.afterImageAlt  ?? '',
        result_badge:        transformation?.resultBadge  ?? 'Real Result',
        is_enabled:          transformation?.isEnabled    ?? true,
        before_image:        null,
        after_image:         null,
        remove_before_image: false,
        remove_after_image:  false,
        _method:             isEdit ? 'PUT' : undefined,
    });

    const [beforePreview, setBeforePreview] = useState(transformation?.beforeImg ?? null);
    const [afterPreview,  setAfterPreview]  = useState(transformation?.afterImg  ?? null);

    const handleFile = (field, setPreview, file) => {
        setData(field, file);
        setPreview(URL.createObjectURL(file));
    };

    const handleRemove = (imageField, removeField, setPreview) => {
        setData(imageField, null);
        setData(removeField, true);
        setPreview(null);
    };

    const submit = (e) => {
        e.preventDefault();
        const opts = { forceFormData: true, preserveScroll: true, onSuccess: onClose };
        if (isEdit) {
            post(route('admin.transformations.update', transformation.id), opts);
        } else {
            post(route('admin.transformations.store'), opts);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-lg font-black text-slate-900">
                        {isEdit ? 'Edit Transformation' : 'New Transformation'}
                    </h2>
                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    {/* Title */}
                    <Field label="Title *" error={errors.title}>
                        <TextInput
                            value={data.title}
                            onChange={(v) => setData('title', v)}
                            placeholder="12 Weeks Transformation"
                            maxLength={120}
                        />
                    </Field>

                    {/* Program */}
                    <Field label="Program / Category" error={errors.program}>
                        <TextInput
                            value={data.program}
                            onChange={(v) => setData('program', v)}
                            placeholder="Weight Loss"
                            maxLength={120}
                        />
                    </Field>

                    {/* Result Badge */}
                    <Field label='Floating badge text' error={errors.result_badge}>
                        <TextInput
                            value={data.result_badge}
                            onChange={(v) => setData('result_badge', v)}
                            placeholder="Real Result"
                            maxLength={60}
                        />
                    </Field>

                    {/* Before Image */}
                    <ImageUploadField
                        label="Before Image"
                        previewUrl={beforePreview}
                        fieldName="before_image"
                        error={errors.before_image}
                        onFile={(file) => handleFile('before_image', setBeforePreview, file)}
                        onRemove={() => handleRemove('before_image', 'remove_before_image', setBeforePreview)}
                    />

                    {/* Before Alt */}
                    <Field label="Before image alt text" error={errors.before_image_alt}>
                        <TextInput
                            value={data.before_image_alt}
                            onChange={(v) => setData('before_image_alt', v)}
                            placeholder="Client before transformation"
                            maxLength={255}
                        />
                    </Field>

                    {/* After Image */}
                    <ImageUploadField
                        label="After Image"
                        previewUrl={afterPreview}
                        fieldName="after_image"
                        error={errors.after_image}
                        onFile={(file) => handleFile('after_image', setAfterPreview, file)}
                        onRemove={() => handleRemove('after_image', 'remove_after_image', setAfterPreview)}
                    />

                    {/* After Alt */}
                    <Field label="After image alt text" error={errors.after_image_alt}>
                        <TextInput
                            value={data.after_image_alt}
                            onChange={(v) => setData('after_image_alt', v)}
                            placeholder="Client after transformation"
                            maxLength={255}
                        />
                    </Field>

                    {/* Enabled toggle */}
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                        <input
                            type="checkbox"
                            checked={Boolean(data.is_enabled)}
                            onChange={(e) => setData('is_enabled', e.target.checked)}
                            className="h-4 w-4 rounded accent-lime-500"
                        />
                        Visible on site
                    </label>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-xl border border-slate-300 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 rounded-xl bg-lime-500 py-2.5 text-sm font-black text-slate-950 shadow transition hover:bg-lime-400 disabled:opacity-50"
                        >
                            {processing
                                ? 'Saving…'
                                : isEdit
                                    ? 'Save Changes'
                                    : 'Create Transformation'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────────
   Section Settings collapsible panel
───────────────────────────────────────────────────────────────────── */
function SectionSettingsPanel({ draft }) {
    const [open, setOpen] = useState(false);
    const { data, setData, put, processing } = useForm({
        eyebrow:    draft.eyebrow    ?? 'FIT YOUNESS',
        heading:    draft.heading    ?? 'Clients',
        is_visible: Boolean(draft.is_visible ?? true),
        action:     'draft',
    });

    const save = (action) => {
        setData('action', action);
        put(route('admin.transformations.section.update'), { preserveScroll: true });
    };

    return (
        <div className="fy-hero-editor__card mb-4">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="fy-hero-editor__card-header w-full text-left"
            >
                <span className="fy-hero-editor__card-title">
                    <Images size={18} className="text-lime-600" />
                    Section Settings
                </span>
                {open
                    ? <ChevronUp size={18} className="text-slate-400" />
                    : <ChevronDown size={18} className="text-slate-400" />}
            </button>

            {open && (
                <div className="space-y-4">
                    <Field label="Eyebrow label">
                        <TextInput
                            value={data.eyebrow}
                            onChange={(v) => setData('eyebrow', v)}
                            placeholder="FIT YOUNESS"
                            maxLength={120}
                        />
                    </Field>
                    <Field label="Section heading">
                        <TextInput
                            value={data.heading}
                            onChange={(v) => setData('heading', v)}
                            placeholder="Clients"
                            maxLength={120}
                        />
                    </Field>
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                        <input
                            type="checkbox"
                            checked={Boolean(data.is_visible)}
                            onChange={(e) => setData('is_visible', e.target.checked)}
                            className="h-4 w-4 rounded accent-lime-500"
                        />
                        Show Transformations section on site
                    </label>
                    <div className="flex gap-2 pt-1">
                        <button
                            type="button"
                            onClick={() => save('draft')}
                            disabled={processing}
                            className="flex items-center gap-1.5 rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-800 transition hover:bg-slate-50 disabled:opacity-50"
                        >
                            <Save size={14} /> Save Draft
                        </button>
                        <button
                            type="button"
                            onClick={() => save('publish')}
                            disabled={processing}
                            className="flex items-center gap-1.5 rounded-xl bg-lime-500 px-4 py-2 text-xs font-black text-slate-950 transition hover:bg-lime-400 disabled:opacity-50"
                        >
                            <Send size={14} /> Publish
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────────
   Transformation Row in the list
───────────────────────────────────────────────────────────────────── */
function TransformationRow({ transformation, onEdit, onToggle, onDelete }) {
    return (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            {/* Before / After thumbnails side by side */}
            <div className="flex shrink-0 gap-1.5">
                <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-slate-100">
                    {transformation.beforeImg ? (
                        <img
                            src={transformation.beforeImg}
                            alt="before"
                            className="h-full w-full object-cover grayscale"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">B</div>
                    )}
                    <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1 py-0.5 text-[8px] font-black uppercase tracking-wider text-white">
                        Before
                    </span>
                </div>
                <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-slate-100">
                    {transformation.afterImg ? (
                        <img
                            src={transformation.afterImg}
                            alt="after"
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">A</div>
                    )}
                    <span className="absolute bottom-1 right-1 rounded bg-lime-500 px-1 py-0.5 text-[8px] font-black uppercase tracking-wider text-black">
                        After
                    </span>
                </div>
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-900">{transformation.title}</p>
                {transformation.program && (
                    <span className="mt-0.5 inline-block rounded-full bg-lime-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-lime-800">
                        {transformation.program}
                    </span>
                )}
                <p className="mt-1 text-xs text-slate-400">Badge: «{transformation.resultBadge}»</p>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-1">
                <button
                    type="button"
                    onClick={() => onToggle(transformation)}
                    title={transformation.isEnabled ? 'Disable' : 'Enable'}
                    className={`rounded-xl p-2 transition ${
                        transformation.isEnabled
                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    }`}
                >
                    <Power size={15} />
                </button>
                <button
                    type="button"
                    onClick={() => onEdit(transformation)}
                    className="rounded-xl bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                    title="Edit"
                >
                    <Pencil size={15} />
                </button>
                <button
                    type="button"
                    onClick={() => onDelete(transformation)}
                    className="rounded-xl bg-rose-50 p-2 text-rose-600 transition hover:bg-rose-100"
                    title="Delete"
                >
                    <Trash2 size={15} />
                </button>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────────
   Main page
───────────────────────────────────────────────────────────────────── */
export default function Index({
    transformations = [],
    sectionDraft = {},
    hasUnpublishedChanges = false,
    publishedAt = 'Jamais',
}) {
    const [modal, setModal]           = useState(null); // null | 'create' | transformation object
    const [showPreview, setShowPreview] = useState(false);

    const handleToggle = (t) => {
        router.patch(route('admin.transformations.toggle', t.id), {}, { preserveScroll: true });
    };

    const handleDelete = (t) => {
        if (confirm(`Delete "${t.title}"? This cannot be undone.`)) {
            router.delete(route('admin.transformations.destroy', t.id), { preserveScroll: true });
        }
    };

    // Build the shape Transformations.jsx expects for the live preview
    const previewData = transformations
        .filter((t) => t.isEnabled)
        .map((t, i) => ({
            ...t,
            id:     t.id,
            shape:  ['fashion-card-shape-1', 'fashion-card-shape-2', 'fashion-card-shape-3'][i % 3],
            offset: i === 1 ? 'lg:translate-y-8' : '',
        }));

    return (
        <AdminLayout title="Transformations — Landing Page">
            <Head title="Transformations Editor" />

            <div className="fy-hero-editor pb-12">
                {/* ── TOOLBAR ── */}
                <div className="fy-hero-editor__toolbar">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-100 text-lime-700">
                            <Images size={20} />
                        </div>
                        <div>
                            <h1 className="flex items-center gap-2 text-lg font-black text-slate-900">
                                Transformations Editor
                                {hasUnpublishedChanges && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-800">
                                        Draft pending
                                    </span>
                                )}
                            </h1>
                            <p className="text-xs text-slate-500">
                                Dernière publication :{' '}
                                <span className="font-semibold">{publishedAt}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setShowPreview((p) => !p)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                        >
                            <Eye size={14} />
                            {showPreview ? 'Hide Preview' : 'Preview'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setModal('create')}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-lime-500 px-4 py-2.5 text-xs font-black text-slate-950 shadow transition hover:bg-lime-400"
                        >
                            <Plus size={15} />
                            Add Transformation
                        </button>
                        <a
                            href="/#transformations"
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                            title="View live section"
                        >
                            <Eye size={18} />
                        </a>
                    </div>
                </div>

                {/* ── 2-COLUMN LAYOUT ── */}
                <div className="fy-hero-editor__layout">
                    {/* LEFT — Controls */}
                    <div className="space-y-4">
                        <SectionSettingsPanel draft={sectionDraft} />

                        {/* List */}
                        <div className="space-y-3">
                            {transformations.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-12 text-center text-slate-400">
                                    <Images size={32} className="mx-auto mb-3 opacity-30" />
                                    <p className="font-semibold">No transformations yet.</p>
                                    <p className="text-sm">
                                        Click &quot;Add Transformation&quot; to create the first one.
                                    </p>
                                </div>
                            ) : (
                                transformations.map((t) => (
                                    <TransformationRow
                                        key={t.id}
                                        transformation={t}
                                        onEdit={(item) => setModal(item)}
                                        onToggle={handleToggle}
                                        onDelete={handleDelete}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* RIGHT — Live Preview */}
                    {showPreview && (
                        <div className="fy-hero-editor__canvas-wrapper">
                            <div className="fy-hero-editor__device-bar">
                                <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                                    Live Preview — Transformations
                                </span>
                            </div>
                            <div className="overflow-y-auto">
                                <Transformations
                                    transformations={previewData}
                                    sectionConfig={sectionDraft}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {modal && (
                <TransformationModal
                    transformation={modal === 'create' ? null : modal}
                    onClose={() => setModal(null)}
                />
            )}
        </AdminLayout>
    );
}

