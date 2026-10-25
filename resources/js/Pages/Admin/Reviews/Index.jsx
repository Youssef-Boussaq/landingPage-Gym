import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Reviews from '@/Components/Landing/Reviews';
import {
    Plus, Save, Send, Eye, Pencil, Trash2, Power,
    GripVertical, ChevronDown, ChevronUp, Upload, X, Star,
} from 'lucide-react';

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
        ? <textarea rows={4} value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength} className={cls} {...rest} dir="auto" />
        : <input type="text" value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength} className={cls} {...rest} />;
}

/* Star rating picker */
function StarPicker({ value, onChange }) {
    return (
        <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(n => (
                <button key={n} type="button" onClick={() => onChange(n)}
                    className={`p-1 transition ${n <= value ? 'text-[var(--color-primary-dark)]' : 'text-slate-200 hover:text-slate-300'}`}>
                    <Star size={22} fill={n <= value ? 'currentColor' : 'none'} />
                </button>
            ))}
            <span className="ml-2 text-xs text-slate-500">{value}/5</span>
        </div>
    );
}

/* Review modal */
function ReviewModal({ review, onClose }) {
    const isEdit = Boolean(review?.id);
    const { data, setData, post, processing, errors } = useForm({
        name:          review?.name       ?? '',
        role:          review?.role       ?? '',
        text:          review?.text       ?? '',
        rating:        review?.rating     ?? 5,
        is_enabled:    review?.isEnabled  ?? true,
        avatar:        null,
        remove_avatar: false,
        _method:       isEdit ? 'PUT' : undefined,
    });
    const [avatarPreview, setAvatarPreview] = useState(review?.avatar ?? null);

    const handleAvatar = file => {
        setData('avatar', file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const submit = e => {
        e.preventDefault();
        const opts = { forceFormData: true, preserveScroll: true, onSuccess: onClose };
        if (isEdit) post(route('admin.reviews.update', review.id), opts);
        else        post(route('admin.reviews.store'), opts);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-black text-slate-900">{isEdit ? 'Edit Review' : 'New Review'}</h2>
                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700"><X size={20} /></button>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Name *" error={errors.name}>
                            <TextInput value={data.name} onChange={v => setData('name', v)} placeholder="Amine B." maxLength={120} />
                        </Field>
                        <Field label="Role / Program" error={errors.role}>
                            <TextInput value={data.role} onChange={v => setData('role', v)} placeholder="Weight Loss Program" maxLength={120} />
                        </Field>
                    </div>

                    <Field label="Review text *" error={errors.text}>
                        <TextInput value={data.text} onChange={v => setData('text', v)}
                            placeholder="مدرب محترف… (Arabic supported)" maxLength={2000} multiline />
                        <p className="mt-1 text-[11px] text-slate-400">Arabic text is fully supported — direction is set automatically.</p>
                    </Field>

                    <Field label="Star rating" error={errors.rating}>
                        <StarPicker value={data.rating} onChange={v => setData('rating', v)} />
                    </Field>

                    {/* Avatar */}
                    <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">Avatar (optional)</label>
                        {avatarPreview ? (
                            <div className="relative mb-3 inline-block">
                                <img src={avatarPreview} alt="Avatar" className="h-16 w-16 rounded-full border border-slate-200 object-cover" />
                                <button type="button"
                                    onClick={() => { setData('remove_avatar', true); setData('avatar', null); setAvatarPreview(null); }}
                                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white shadow hover:bg-rose-600">
                                    <X size={11} />
                                </button>
                            </div>
                        ) : (
                            <label className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500 hover:border-lime-400 hover:text-lime-700 transition">
                                <Upload size={16} />
                                <span>Upload avatar</span>
                                <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="hidden"
                                    onChange={e => e.target.files?.[0] && handleAvatar(e.target.files[0])} />
                            </label>
                        )}
                        {errors.avatar && <p className="mt-1 text-xs text-rose-600 font-semibold">{errors.avatar}</p>}
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                        <input type="checkbox" checked={Boolean(data.is_enabled)} onChange={e => setData('is_enabled', e.target.checked)} className="w-4 h-4 rounded accent-lime-500" />
                        Published (visible on site)
                    </label>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-700 hover:bg-slate-50 transition">
                            Cancel
                        </button>
                        <button type="submit" disabled={processing}
                            className="flex-1 py-2.5 rounded-xl bg-lime-500 text-sm font-black text-slate-950 hover:bg-lime-400 shadow transition disabled:opacity-50">
                            {processing ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Review'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* Section settings */
function SectionSettingsPanel({ draft }) {
    const [open, setOpen] = useState(false);
    const { data, setData, put, processing } = useForm({
        eyebrow:    draft.eyebrow    ?? 'Success Stories',
        heading:    draft.heading    ?? 'What Clients Say',
        is_visible: Boolean(draft.is_visible ?? true),
        action:     'draft',
    });

    const save = action => {
        setData('action', action);
        put(route('admin.reviews.section.update'), { preserveScroll: true });
    };

    return (
        <div className="fy-hero-editor__card mb-4">
            <button type="button" onClick={() => setOpen(o => !o)} className="fy-hero-editor__card-header w-full text-left">
                <span className="fy-hero-editor__card-title">
                    <Star size={18} className="text-lime-600" /> Section Settings
                </span>
                {open ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
            </button>
            {open && (
                <div className="space-y-4">
                    <Field label="Eyebrow"><TextInput value={data.eyebrow} onChange={v => setData('eyebrow', v)} maxLength={120} /></Field>
                    <Field label="Heading"><TextInput value={data.heading} onChange={v => setData('heading', v)} maxLength={120} /></Field>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                        <input type="checkbox" checked={Boolean(data.is_visible)} onChange={e => setData('is_visible', e.target.checked)} className="w-4 h-4 rounded accent-lime-500" />
                        Show Reviews section
                    </label>
                    <div className="flex gap-2">
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

/* Review row */
function ReviewRow({ review, onEdit, onToggle, onDelete }) {
    const stars = Math.min(5, Math.max(1, Number(review.rating) || 5));
    return (
        <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="cursor-grab text-slate-300 hover:text-slate-500 mt-1"><GripVertical size={18} /></div>
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-900 text-sm shrink-0 overflow-hidden">
                {review.avatar
                    ? <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
                    : <span>{(review.name || '?').charAt(0)}</span>
                }
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-bold text-slate-900 text-sm">{review.name}</p>
                    {review.role && <span className="text-xs text-slate-400">— {review.role}</span>}
                </div>
                <div className="flex items-center gap-0.5 mb-1">
                    {[...Array(stars)].map((_, i) => <Star key={i} size={12} className="fill-[var(--color-primary-dark)] text-[var(--color-primary-dark)]" />)}
                </div>
                <p className="text-xs text-slate-500 line-clamp-2" dir="auto">{review.text}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
                <button type="button" onClick={() => onToggle(review)}
                    className={`p-2 rounded-xl transition ${review.isEnabled ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-slate-400 bg-slate-100 hover:bg-slate-200'}`}>
                    <Power size={15} />
                </button>
                <button type="button" onClick={() => onEdit(review)} className="p-2 rounded-xl text-blue-600 bg-blue-50 hover:bg-blue-100 transition"><Pencil size={15} /></button>
                <button type="button" onClick={() => onDelete(review)} className="p-2 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 transition"><Trash2 size={15} /></button>
            </div>
        </div>
    );
}

export default function Index({ reviews = [], sectionDraft = {}, publishedAt = 'Jamais' }) {
    const [modal, setModal]             = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    const handleToggle = r => router.patch(route('admin.reviews.toggle', r.id), {}, { preserveScroll: true });
    const handleDelete = r => {
        if (confirm(`Delete review by "${r.name}"?`)) {
            router.delete(route('admin.reviews.destroy', r.id), { preserveScroll: true });
        }
    };

    const enabledReviews = reviews.filter(r => r.isEnabled);

    return (
        <AdminLayout title="Reviews — Landing Page">
            <Head title="Reviews Editor" />

            <div className="fy-hero-editor pb-12">
                <div className="fy-hero-editor__toolbar">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-lime-100 text-lime-700 flex items-center justify-center">
                            <Star size={20} />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-slate-900">Reviews Editor</h1>
                            <p className="text-xs text-slate-500">Dernière publication : <span className="font-semibold">{publishedAt}</span></p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={() => setShowPreview(p => !p)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition">
                            <Eye size={14} /> {showPreview ? 'Hide Preview' : 'Preview'}
                        </button>
                        <button type="button" onClick={() => setModal('create')}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-lime-500 text-xs font-black text-slate-950 hover:bg-lime-400 shadow transition">
                            <Plus size={15} /> Add Review
                        </button>
                        <a href="/#testimonials" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition">
                            <Eye size={18} />
                        </a>
                    </div>
                </div>

                <div className="fy-hero-editor__layout">
                    <div className="space-y-3">
                        <SectionSettingsPanel draft={sectionDraft} />
                        {reviews.length === 0 ? (
                            <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                                <Star size={32} className="mx-auto mb-3 opacity-30" />
                                <p className="font-semibold">No reviews yet.</p>
                            </div>
                        ) : (
                            reviews.map(r => (
                                <ReviewRow key={r.id} review={r}
                                    onEdit={rv => setModal(rv)}
                                    onToggle={handleToggle}
                                    onDelete={handleDelete}
                                />
                            ))
                        )}
                    </div>

                    {showPreview && (
                        <div className="fy-hero-editor__canvas-wrapper">
                            <div className="fy-hero-editor__device-bar">
                                <span className="text-xs font-black uppercase tracking-wider text-slate-700">Aperçu Reviews</span>
                            </div>
                            <div className="overflow-y-auto">
                                <Reviews reviews={enabledReviews} sectionConfig={sectionDraft} />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {modal && (
                <ReviewModal
                    review={modal === 'create' ? null : modal}
                    onClose={() => setModal(null)}
                />
            )}
        </AdminLayout>
    );
}
