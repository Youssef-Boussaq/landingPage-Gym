import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Services from '@/Components/Landing/Services';
import {
    Plus, Save, Send, Eye, Pencil, Trash2, Power, GripVertical,
    ChevronDown, ChevronUp, Upload, X, Dumbbell,
} from 'lucide-react';

const ICON_OPTIONS = [
    'Dumbbell','Flame','Activity','PersonStanding','Heart','Zap',
    'Target','Trophy','Star','Timer','BarChart2','Users','Shield','TrendingUp',
];

/* ── tiny reusable components ─────────────────────────────────────── */
function Field({ label, error, children }) {
    return (
        <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">{label}</label>
            {children}
            {error && <p className="mt-1 text-xs text-rose-600 font-semibold">{error}</p>}
        </div>
    );
}

function TextInput({ value, onChange, placeholder, maxLength, multiline, ...rest }) {
    const cls = "w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-lime-500 focus:ring-2 focus:ring-lime-100";
    return multiline
        ? <textarea rows={3} value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength} className={cls} {...rest} />
        : <input type="text" value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength} className={cls} {...rest} />;
}

/* ── Service Form (create / edit) ─────────────────────────────────── */
function ServiceModal({ service, onClose }) {
    const isEdit = Boolean(service?.id);
    const { data, setData, post, put, processing, errors, reset } = useForm({
        title:       service?.title       ?? '',
        description: service?.description ?? '',
        image_alt:   service?.imageAlt    ?? '',
        icon:        service?.icon        ?? 'Dumbbell',
        cta_label:   service?.ctaLabel    ?? 'Learn More',
        is_enabled:  service?.isEnabled   ?? true,
        is_featured: service?.isFeatured  ?? false,
        image:       null,
        remove_image:false,
        _method:     isEdit ? 'PUT' : undefined,
    });
    const [previewUrl, setPreviewUrl] = useState(service?.image ?? null);

    const handleFile = file => {
        setData('image', file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const submit = e => {
        e.preventDefault();
        const opts = { forceFormData: true, preserveScroll: true, onSuccess: onClose };
        if (isEdit) post(route('admin.services.update', service.id), opts);
        else        post(route('admin.services.store'), opts);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-black text-slate-900">{isEdit ? 'Edit Service' : 'New Service'}</h2>
                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700"><X size={20} /></button>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <Field label="Title *" error={errors.title}>
                        <TextInput value={data.title} onChange={v => setData('title', v)} placeholder="Powerlifting" maxLength={120} />
                    </Field>
                    <Field label="Description" error={errors.description}>
                        <TextInput value={data.description} onChange={v => setData('description', v)} placeholder="Master the big three…" maxLength={400} multiline />
                    </Field>
                    <Field label="Icon" error={errors.icon}>
                        <select value={data.icon} onChange={e => setData('icon', e.target.value)}
                            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-100">
                            {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                        </select>
                    </Field>
                    <Field label="CTA Label" error={errors.cta_label}>
                        <TextInput value={data.cta_label} onChange={v => setData('cta_label', v)} placeholder="Learn More" maxLength={80} />
                    </Field>
                    <Field label="Image alt text" error={errors.image_alt}>
                        <TextInput value={data.image_alt} onChange={v => setData('image_alt', v)} placeholder="Service image description" maxLength={255} />
                    </Field>

                    {/* Image upload */}
                    <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">Image</label>
                        {previewUrl && (
                            <div className="relative mb-3 inline-block">
                                <img src={previewUrl} alt="Preview" className="h-28 w-auto rounded-xl border border-slate-200 object-cover bg-slate-50" />
                                <button type="button" onClick={() => { setData('remove_image', true); setData('image', null); setPreviewUrl(null); }}
                                    className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white shadow hover:bg-rose-600">
                                    <Trash2 size={11} />
                                </button>
                            </div>
                        )}
                        <label className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500 hover:border-lime-400 hover:text-lime-700 transition">
                            <Upload size={16} />
                            <span>{previewUrl ? 'Replace' : 'Upload image'}</span>
                            <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="hidden"
                                onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
                        </label>
                        {errors.image && <p className="mt-1 text-xs text-rose-600 font-semibold">{errors.image}</p>}
                    </div>

                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                            <input type="checkbox" checked={Boolean(data.is_enabled)} onChange={e => setData('is_enabled', e.target.checked)} className="w-4 h-4 rounded accent-lime-500" />
                            Enabled
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                            <input type="checkbox" checked={Boolean(data.is_featured)} onChange={e => setData('is_featured', e.target.checked)} className="w-4 h-4 rounded accent-lime-500" />
                            Featured
                        </label>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-700 hover:bg-slate-50 transition">
                            Cancel
                        </button>
                        <button type="submit" disabled={processing}
                            className="flex-1 py-2.5 rounded-xl bg-lime-500 text-sm font-black text-slate-950 hover:bg-lime-400 shadow transition disabled:opacity-50">
                            {processing ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Service'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ── Section Settings Form ────────────────────────────────────────── */
function SectionSettingsPanel({ draft, onClose }) {
    const [open, setOpen] = useState(false);
    const { data, setData, put, processing } = useForm({
        eyebrow:     draft.eyebrow     ?? 'Premium Coaching',
        heading:     draft.heading     ?? 'Specialized Services',
        description: draft.description ?? '',
        is_visible:  Boolean(draft.is_visible ?? true),
        action:      'draft',
    });

    const save = action => {
        setData('action', action);
        put(route('admin.services.section.update'), { preserveScroll: true, onSuccess: onClose });
    };

    return (
        <div className="fy-hero-editor__card mb-4">
            <button type="button" onClick={() => setOpen(o => !o)}
                className="fy-hero-editor__card-header w-full text-left">
                <span className="fy-hero-editor__card-title">
                    <Dumbbell size={18} className="text-lime-600" /> Section Settings
                </span>
                {open ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
            </button>
            {open && (
                <div className="space-y-4">
                    <Field label="Eyebrow">
                        <TextInput value={data.eyebrow} onChange={v => setData('eyebrow', v)} placeholder="Premium Coaching" maxLength={120} />
                    </Field>
                    <Field label="Heading">
                        <TextInput value={data.heading} onChange={v => setData('heading', v)} placeholder="Specialized Services" maxLength={120} />
                    </Field>
                    <Field label="Description">
                        <TextInput value={data.description} onChange={v => setData('description', v)} placeholder="Tailored fitness programs…" maxLength={600} multiline />
                    </Field>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                        <input type="checkbox" checked={Boolean(data.is_visible)} onChange={e => setData('is_visible', e.target.checked)} className="w-4 h-4 rounded accent-lime-500" />
                        Show Services section
                    </label>
                    <div className="flex gap-2 pt-1">
                        <button type="button" onClick={() => save('draft')} disabled={processing}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 hover:bg-slate-50 transition disabled:opacity-50">
                            <Save size={14} /> Save Draft
                        </button>
                        <button type="button" onClick={() => save('publish')} disabled={processing}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-lime-500 text-xs font-black text-slate-950 hover:bg-lime-400 transition disabled:opacity-50">
                            <Send size={14} /> Publish
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ── Service Row ──────────────────────────────────────────────────── */
function ServiceRow({ service, onEdit, onToggle, onDelete }) {
    return (
        <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="cursor-grab text-slate-300 hover:text-slate-500">
                <GripVertical size={18} />
            </div>
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                {service.image
                    ? <img src={service.image} alt={service.imageAlt} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-slate-400"><Dumbbell size={20} /></div>
                }
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 text-sm truncate">{service.title}</p>
                <p className="text-xs text-slate-500 truncate">{service.description}</p>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        {service.icon}
                    </span>
                    {service.isFeatured && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                            Featured
                        </span>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
                <button type="button" onClick={() => onToggle(service)}
                    className={`p-2 rounded-xl transition ${service.isEnabled ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-slate-400 bg-slate-100 hover:bg-slate-200'}`}
                    title={service.isEnabled ? 'Disable' : 'Enable'}>
                    <Power size={15} />
                </button>
                <button type="button" onClick={() => onEdit(service)}
                    className="p-2 rounded-xl text-blue-600 bg-blue-50 hover:bg-blue-100 transition" title="Edit">
                    <Pencil size={15} />
                </button>
                <button type="button" onClick={() => onDelete(service)}
                    className="p-2 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 transition" title="Delete">
                    <Trash2 size={15} />
                </button>
            </div>
        </div>
    );
}

/* ── Main Page ────────────────────────────────────────────────────── */
export default function Index({ services = [], sectionDraft = {}, publishedAt = 'Jamais', hasUnpublishedChanges = false }) {
    const [modal, setModal]     = useState(null); // null | 'create' | service object
    const [showPreview, setShowPreview] = useState(false);

    const handleToggle = service => {
        router.patch(route('admin.services.toggle', service.id), {}, { preserveScroll: true });
    };

    const handleDelete = service => {
        if (confirm(`Delete "${service.title}"? This cannot be undone.`)) {
            router.delete(route('admin.services.destroy', service.id), { preserveScroll: true });
        }
    };

    const enabledServices = services.filter(s => s.isEnabled);

    return (
        <AdminLayout title="Services — Landing Page">
            <Head title="Services Editor" />

            <div className="fy-hero-editor pb-12">
                {/* TOOLBAR */}
                <div className="fy-hero-editor__toolbar">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-lime-100 text-lime-700 flex items-center justify-center">
                            <Dumbbell size={20} />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-slate-900">Services Editor</h1>
                            <p className="text-xs text-slate-500">
                                Dernière publication : <span className="font-semibold">{publishedAt}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={() => setShowPreview(p => !p)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition">
                            <Eye size={14} /> {showPreview ? 'Hide Preview' : 'Preview'}
                        </button>
                        <button type="button" onClick={() => setModal('create')}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-lime-500 text-xs font-black text-slate-950 hover:bg-lime-400 shadow transition">
                            <Plus size={15} /> Add Service
                        </button>
                        <a href="/#services" target="_blank" rel="noreferrer"
                            className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition">
                            <Eye size={18} />
                        </a>
                    </div>
                </div>

                <div className="fy-hero-editor__layout">
                    {/* LEFT — Controls */}
                    <div className="space-y-4">
                        <SectionSettingsPanel draft={sectionDraft} onClose={() => {}} />

                        {/* Service list */}
                        <div className="space-y-3">
                            {services.length === 0 ? (
                                <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                                    <Dumbbell size={32} className="mx-auto mb-3 opacity-30" />
                                    <p className="font-semibold">No services yet.</p>
                                    <p className="text-sm">Click "Add Service" to create your first one.</p>
                                </div>
                            ) : (
                                services.map(s => (
                                    <ServiceRow
                                        key={s.id}
                                        service={s}
                                        onEdit={svc => setModal(svc)}
                                        onToggle={handleToggle}
                                        onDelete={handleDelete}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* RIGHT — Live preview */}
                    {showPreview && (
                        <div className="fy-hero-editor__canvas-wrapper">
                            <div className="fy-hero-editor__device-bar">
                                <span className="text-xs font-black uppercase tracking-wider text-slate-700">Aperçu Services</span>
                            </div>
                            <div className="overflow-y-auto">
                                <Services services={enabledServices} sectionConfig={sectionDraft} />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Create / Edit Modal */}
            {modal && (
                <ServiceModal
                    service={modal === 'create' ? null : modal}
                    onClose={() => setModal(null)}
                />
            )}
        </AdminLayout>
    );
}
