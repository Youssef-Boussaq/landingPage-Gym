import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Programs from '@/Components/Landing/Programs';
import {
    Plus, Save, Send, Eye, Pencil, Trash2, Power,
    GripVertical, ChevronDown, ChevronUp, X, Layers,
    PlusCircle, MinusCircle,
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
        ? <textarea rows={3} value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength} className={cls} {...rest} />
        : <input type="text" value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength} className={cls} {...rest} />;
}

/* Benefits list editor */
function BenefitsList({ benefits, onChange }) {
    const update = (idx, val) => onChange(benefits.map((b, i) => i === idx ? val : b));
    const add    = () => onChange([...benefits, '']);
    const remove = idx => onChange(benefits.filter((_, i) => i !== idx));

    return (
        <div className="space-y-2">
            {benefits.map((b, idx) => (
                <div key={idx} className="flex gap-2">
                    <input
                        type="text"
                        value={b}
                        onChange={e => update(idx, e.target.value)}
                        placeholder={`Benefit ${idx + 1}`}
                        maxLength={200}
                        className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-100"
                    />
                    <button type="button" onClick={() => remove(idx)}
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition">
                        <MinusCircle size={18} />
                    </button>
                </div>
            ))}
            <button type="button" onClick={add}
                className="flex items-center gap-1.5 text-xs font-bold text-lime-700 hover:text-lime-800 transition">
                <PlusCircle size={16} /> Add benefit
            </button>
        </div>
    );
}

/* Program modal */
function ProgramModal({ program, onClose }) {
    const isEdit = Boolean(program?.id);
    const { data, setData, post, processing, errors } = useForm({
        title:            program?.title           ?? '',
        description:      program?.description     ?? '',
        price:            program?.price           ?? '',
        currency:         program?.currency        ?? 'MAD',
        period:           program?.period          ?? '',
        benefits:         program?.benefits        ?? [],
        is_popular:       program?.isPopular       ?? false,
        is_enabled:       program?.isEnabled       ?? true,
        cta_label:        program?.ctaLabel        ?? 'Choose Plan',
        whatsapp_message: program?.whatsappMessage ?? '',
        _method:          isEdit ? 'PUT' : undefined,
    });

    const submit = e => {
        e.preventDefault();
        const opts = { forceFormData: true, preserveScroll: true, onSuccess: onClose };
        if (isEdit) post(route('admin.programs.update', program.id), opts);
        else        post(route('admin.programs.store'), opts);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-black text-slate-900">{isEdit ? 'Edit Program' : 'New Program'}</h2>
                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700"><X size={20} /></button>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <Field label="Title *" error={errors.title}>
                        <TextInput value={data.title} onChange={v => setData('title', v)} placeholder="3 Months Coaching" maxLength={120} />
                    </Field>
                    <Field label="Description" error={errors.description}>
                        <TextInput value={data.description} onChange={v => setData('description', v)} placeholder="The ideal timeframe…" maxLength={400} multiline />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Price *" error={errors.price}>
                            <TextInput value={data.price} onChange={v => setData('price', v)} placeholder="2,000" maxLength={30} />
                        </Field>
                        <Field label="Currency" error={errors.currency}>
                            <TextInput value={data.currency} onChange={v => setData('currency', v)} placeholder="MAD" maxLength={10} />
                        </Field>
                    </div>

                    <Field label="Period" error={errors.period}>
                        <TextInput value={data.period} onChange={v => setData('period', v)} placeholder="/ 3 months" maxLength={40} />
                    </Field>

                    <Field label="Benefits" error={errors.benefits}>
                        <BenefitsList
                            benefits={data.benefits}
                            onChange={v => setData('benefits', v)}
                        />
                    </Field>

                    <Field label="CTA Label" error={errors.cta_label}>
                        <TextInput value={data.cta_label} onChange={v => setData('cta_label', v)} placeholder="Choose Plan" maxLength={80} />
                    </Field>

                    <Field label="WhatsApp message" error={errors.whatsapp_message}>
                        <TextInput value={data.whatsapp_message} onChange={v => setData('whatsapp_message', v)} placeholder="Hello, I would like to start…" maxLength={500} multiline />
                    </Field>

                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                            <input type="checkbox" checked={Boolean(data.is_popular)} onChange={e => setData('is_popular', e.target.checked)} className="w-4 h-4 rounded accent-lime-500" />
                            Popular / Best Value
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                            <input type="checkbox" checked={Boolean(data.is_enabled)} onChange={e => setData('is_enabled', e.target.checked)} className="w-4 h-4 rounded accent-lime-500" />
                            Enabled
                        </label>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-700 hover:bg-slate-50 transition">
                            Cancel
                        </button>
                        <button type="submit" disabled={processing}
                            className="flex-1 py-2.5 rounded-xl bg-lime-500 text-sm font-black text-slate-950 hover:bg-lime-400 shadow transition disabled:opacity-50">
                            {processing ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Program'}
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
        eyebrow:        draft.eyebrow        ?? 'Start Today',
        heading:        draft.heading        ?? 'Coaching Programs',
        whatsapp_phone: draft.whatsapp_phone ?? '06 17 93 37 97',
        popular_label:  draft.popular_label  ?? 'Best Value',
        is_visible:     Boolean(draft.is_visible ?? true),
        action:         'draft',
    });

    const save = action => {
        setData('action', action);
        put(route('admin.programs.section.update'), { preserveScroll: true });
    };

    return (
        <div className="fy-hero-editor__card mb-4">
            <button type="button" onClick={() => setOpen(o => !o)} className="fy-hero-editor__card-header w-full text-left">
                <span className="fy-hero-editor__card-title">
                    <Layers size={18} className="text-lime-600" /> Section Settings
                </span>
                {open ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
            </button>
            {open && (
                <div className="space-y-4">
                    <Field label="Eyebrow"><TextInput value={data.eyebrow} onChange={v => setData('eyebrow', v)} maxLength={120} /></Field>
                    <Field label="Heading"><TextInput value={data.heading} onChange={v => setData('heading', v)} maxLength={120} /></Field>
                    <Field label="WhatsApp Phone" error={null}>
                        <TextInput value={data.whatsapp_phone} onChange={v => setData('whatsapp_phone', v)} placeholder="06 17 93 37 97" maxLength={30} />
                    </Field>
                    <Field label="Popular badge label">
                        <TextInput value={data.popular_label} onChange={v => setData('popular_label', v)} placeholder="Best Value" maxLength={60} />
                    </Field>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                        <input type="checkbox" checked={Boolean(data.is_visible)} onChange={e => setData('is_visible', e.target.checked)} className="w-4 h-4 rounded accent-lime-500" />
                        Show Programs section
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

/* Program Row */
function ProgramRow({ program, onEdit, onToggle, onDelete }) {
    return (
        <div className={`flex items-center gap-3 p-4 bg-white rounded-2xl border shadow-sm ${program.isPopular ? 'border-[var(--color-primary-dark)]' : 'border-slate-100'}`}>
            <div className="cursor-grab text-slate-300 hover:text-slate-500"><GripVertical size={18} /></div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-bold text-slate-900 text-sm">{program.title}</p>
                    {program.isPopular && (
                        <span className="text-[10px] font-black uppercase tracking-wider bg-[var(--color-primary)] text-slate-900 px-2 py-0.5 rounded-full">Popular</span>
                    )}
                </div>
                <p className="text-xs text-slate-500">{program.price} {program.currency} {program.period}</p>
                <p className="text-xs text-slate-400 mt-0.5">{(program.benefits || []).length} benefits</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
                <button type="button" onClick={() => onToggle(program)}
                    className={`p-2 rounded-xl transition ${program.isEnabled ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-slate-400 bg-slate-100 hover:bg-slate-200'}`}>
                    <Power size={15} />
                </button>
                <button type="button" onClick={() => onEdit(program)} className="p-2 rounded-xl text-blue-600 bg-blue-50 hover:bg-blue-100 transition"><Pencil size={15} /></button>
                <button type="button" onClick={() => onDelete(program)} className="p-2 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 transition"><Trash2 size={15} /></button>
            </div>
        </div>
    );
}

export default function Index({ programs = [], sectionDraft = {}, publishedAt = 'Jamais' }) {
    const [modal, setModal]         = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    const handleToggle = p => router.patch(route('admin.programs.toggle', p.id), {}, { preserveScroll: true });
    const handleDelete = p => {
        if (confirm(`Delete "${p.title}"?`)) {
            router.delete(route('admin.programs.destroy', p.id), { preserveScroll: true });
        }
    };

    const enabledPrograms = programs.filter(p => p.isEnabled);

    return (
        <AdminLayout title="Programs — Landing Page">
            <Head title="Programs Editor" />

            <div className="fy-hero-editor pb-12">
                <div className="fy-hero-editor__toolbar">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-lime-100 text-lime-700 flex items-center justify-center">
                            <Layers size={20} />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-slate-900">Programs Editor</h1>
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
                            <Plus size={15} /> Add Program
                        </button>
                        <a href="/#programs" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition">
                            <Eye size={18} />
                        </a>
                    </div>
                </div>

                <div className="fy-hero-editor__layout">
                    <div className="space-y-3">
                        <SectionSettingsPanel draft={sectionDraft} />
                        {programs.length === 0 ? (
                            <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                                <Layers size={32} className="mx-auto mb-3 opacity-30" />
                                <p className="font-semibold">No programs yet.</p>
                            </div>
                        ) : (
                            programs.map(p => (
                                <ProgramRow key={p.id} program={p}
                                    onEdit={prog => setModal(prog)}
                                    onToggle={handleToggle}
                                    onDelete={handleDelete}
                                />
                            ))
                        )}
                    </div>

                    {showPreview && (
                        <div className="fy-hero-editor__canvas-wrapper">
                            <div className="fy-hero-editor__device-bar">
                                <span className="text-xs font-black uppercase tracking-wider text-slate-700">Aperçu Programs</span>
                            </div>
                            <div className="overflow-y-auto">
                                <Programs programs={enabledPrograms} sectionConfig={sectionDraft} />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {modal && (
                <ProgramModal
                    program={modal === 'create' ? null : modal}
                    onClose={() => setModal(null)}
                />
            )}
        </AdminLayout>
    );
}
