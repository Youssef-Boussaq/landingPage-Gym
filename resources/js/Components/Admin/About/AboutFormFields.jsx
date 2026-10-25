import React, { useState } from 'react';
import {
    Type, Image as ImageIcon, Eye, ChevronDown, ChevronUp,
    Upload, Trash2, Award, Dumbbell,
} from 'lucide-react';

/**
 * Collapsible accordion section for the About editor form.
 */
function Section({ id, open, onToggle, icon: Icon, iconColor = 'text-lime-600', title, children }) {
    return (
        <div className="fy-hero-editor__card">
            <button
                type="button"
                onClick={() => onToggle(id)}
                className="fy-hero-editor__card-header w-full text-left"
            >
                <span className="fy-hero-editor__card-title">
                    <Icon className={iconColor} size={18} />
                    {title}
                </span>
                {open ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
            </button>
            {open && <div className="space-y-4">{children}</div>}
        </div>
    );
}

function Field({ label, error, children, hint }) {
    return (
        <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                {label}
            </label>
            {children}
            {hint && <p className="mt-1 text-[11px] text-slate-400">{hint}</p>}
            {error && <p className="mt-1 text-xs text-rose-600 font-semibold">{error}</p>}
        </div>
    );
}

function TextInput({ id, value, onChange, placeholder, maxLength, multiline = false, className = '' }) {
    const base = "w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-lime-500 focus:ring-2 focus:ring-lime-100 " + className;
    if (multiline) {
        return (
            <textarea
                id={id}
                value={value ?? ''}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                maxLength={maxLength}
                rows={3}
                className={base}
            />
        );
    }
    return (
        <input
            id={id}
            type="text"
            value={value ?? ''}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            className={base}
        />
    );
}

function ImageUploadField({ label, currentUrl, fieldName, onSelect, onRemove, error }) {
    return (
        <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                {label}
            </label>
            {currentUrl && (
                <div className="relative mb-3 inline-block">
                    <img
                        src={currentUrl}
                        alt="Preview"
                        className="h-32 w-auto rounded-xl border border-slate-200 object-contain bg-slate-50"
                    />
                    <button
                        type="button"
                        onClick={onRemove}
                        className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white shadow-md hover:bg-rose-600 transition"
                        title="Remove image"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            )}
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500 hover:border-lime-400 hover:text-lime-700 transition">
                <Upload size={16} />
                <span>{currentUrl ? 'Replace image' : 'Upload image'}</span>
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    className="hidden"
                    onChange={e => e.target.files?.[0] && onSelect(e.target.files[0])}
                />
            </label>
            {error && <p className="mt-1 text-xs text-rose-600 font-semibold">{error}</p>}
        </div>
    );
}

export default function AboutFormFields({
    data, setData, errors,
    coachImageUrl, certImageUrl,
    onCoachImageSelect, onCertImageSelect,
    onRemoveCoachImage, onRemoveCertImage,
}) {
    const [open, setOpen] = useState({
        header: true, coach: true, cert: true, bottom: false, visibility: false,
    });
    const toggle = key => setOpen(p => ({ ...p, [key]: !p[key] }));
    const u = (k, v) => setData(k, v);

    return (
        <div className="fy-hero-editor__panel">
            {/* ── SECTION HEADER ─────────────────────────────── */}
            <Section id="header" open={open.header} onToggle={toggle} icon={Type} title="Section Header">
                <Field label="Eyebrow text" error={errors.eyebrow}>
                    <TextInput id="eyebrow" value={data.eyebrow} onChange={v => u('eyebrow', v)} placeholder="About the coach" maxLength={120} />
                </Field>
                <Field label="Main heading" error={errors.heading}>
                    <TextInput id="heading" value={data.heading} onChange={v => u('heading', v)} placeholder="Built through" maxLength={120} />
                </Field>
                <Field label="Highlighted word" error={errors.heading_highlight} hint="Rendered in the brand colour below the heading">
                    <TextInput id="heading_highlight" value={data.heading_highlight} onChange={v => u('heading_highlight', v)} placeholder="discipline." maxLength={120} />
                </Field>
                <Field label="Description" error={errors.description}>
                    <TextInput id="description" value={data.description} onChange={v => u('description', v)} placeholder="A coaching philosophy…" maxLength={600} multiline />
                </Field>
            </Section>

            {/* ── COACH PROFILE ──────────────────────────────── */}
            <Section id="coach" open={open.coach} onToggle={toggle} icon={Dumbbell} iconColor="text-blue-600" title="Coach Profile">
                <Field label="Coach label" error={errors.coach_label}>
                    <TextInput id="coach_label" value={data.coach_label} onChange={v => u('coach_label', v)} placeholder="The Coach" maxLength={80} />
                </Field>
                <Field label="Coach heading" error={errors.coach_heading} hint="Use newlines to break across three lines">
                    <TextInput id="coach_heading" value={data.coach_heading} onChange={v => u('coach_heading', v)} placeholder={"Discipline.\nExperience.\nResults."} maxLength={300} multiline />
                </Field>
                <Field label="Coach description" error={errors.coach_description}>
                    <TextInput id="coach_description" value={data.coach_description} onChange={v => u('coach_description', v)} placeholder="A passion for fitness…" maxLength={600} multiline />
                </Field>
                <Field label="Coach statement" error={errors.coach_statement}>
                    <TextInput id="coach_statement" value={data.coach_statement} onChange={v => u('coach_statement', v)} placeholder="Strength is built daily" maxLength={120} />
                </Field>
                <Field label="Decorative number" error={errors.coach_number} hint="Large background numeral (e.g. 01)">
                    <TextInput id="coach_number" value={data.coach_number} onChange={v => u('coach_number', v)} placeholder="01" maxLength={10} />
                </Field>
                <ImageUploadField
                    label="Coach photo"
                    currentUrl={coachImageUrl}
                    fieldName="coach_image"
                    onSelect={onCoachImageSelect}
                    onRemove={onRemoveCoachImage}
                    error={errors.coach_image}
                />
                <Field label="Image alt text" error={errors.coach_image_alt}>
                    <TextInput id="coach_image_alt" value={data.coach_image_alt} onChange={v => u('coach_image_alt', v)} placeholder="Fit Youness coach" maxLength={255} />
                </Field>
            </Section>

            {/* ── CERTIFICATION ──────────────────────────────── */}
            <Section id="cert" open={open.cert} onToggle={toggle} icon={Award} iconColor="text-amber-600" title="IFBB Certification">
                <Field label="Cert eyebrow" error={errors.cert_eyebrow}>
                    <TextInput id="cert_eyebrow" value={data.cert_eyebrow} onChange={v => u('cert_eyebrow', v)} placeholder="Professional certification" maxLength={120} />
                </Field>
                <Field label="Cert heading" error={errors.cert_heading}>
                    <TextInput id="cert_heading" value={data.cert_heading} onChange={v => u('cert_heading', v)} placeholder="IFBB" maxLength={120} />
                </Field>
                <Field label="Cert highlighted word" error={errors.cert_heading_highlight}>
                    <TextInput id="cert_heading_highlight" value={data.cert_heading_highlight} onChange={v => u('cert_heading_highlight', v)} placeholder="Certified." maxLength={120} />
                </Field>
                <Field label="Cert description" error={errors.cert_description}>
                    <TextInput id="cert_description" value={data.cert_description} onChange={v => u('cert_description', v)} placeholder="Knowledge behind the training…" maxLength={600} multiline />
                </Field>
                <Field label="Cert statement" error={errors.cert_statement}>
                    <TextInput id="cert_statement" value={data.cert_statement} onChange={v => u('cert_statement', v)} placeholder="Knowledge • Training • Nutrition" maxLength={120} />
                </Field>
                <Field label="Decorative number" error={errors.cert_number}>
                    <TextInput id="cert_number" value={data.cert_number} onChange={v => u('cert_number', v)} placeholder="02" maxLength={10} />
                </Field>
                <ImageUploadField
                    label="Certificate photo"
                    currentUrl={certImageUrl}
                    fieldName="cert_image"
                    onSelect={onCertImageSelect}
                    onRemove={onRemoveCertImage}
                    error={errors.cert_image}
                />
                <Field label="Cert image alt text" error={errors.cert_image_alt}>
                    <TextInput id="cert_image_alt" value={data.cert_image_alt} onChange={v => u('cert_image_alt', v)} placeholder="IFBB certified coach" maxLength={255} />
                </Field>
            </Section>

            {/* ── BOTTOM STATEMENT ───────────────────────────── */}
            <Section id="bottom" open={open.bottom} onToggle={toggle} icon={Eye} iconColor="text-slate-500" title="Bottom Statement & CTA">
                <Field label="Bottom statement" error={errors.bottom_statement} hint="Use a newline to split into two lines">
                    <TextInput id="bottom_statement" value={data.bottom_statement} onChange={v => u('bottom_statement', v)} placeholder={"Train with purpose.\nProgress with confidence."} maxLength={200} multiline />
                </Field>
                <Field label="Dimmed line (must match one of the above lines)" error={errors.bottom_highlight}>
                    <TextInput id="bottom_highlight" value={data.bottom_highlight} onChange={v => u('bottom_highlight', v)} placeholder="Progress with confidence." maxLength={120} />
                </Field>
                <Field label="CTA button label" error={errors.cta_label}>
                    <TextInput id="cta_label" value={data.cta_label} onChange={v => u('cta_label', v)} placeholder="Start your journey" maxLength={80} />
                </Field>
                <Field label="CTA destination" error={errors.cta_href}>
                    <TextInput id="cta_href" value={data.cta_href} onChange={v => u('cta_href', v)} placeholder="#contact" maxLength={255} />
                </Field>
            </Section>

            {/* ── VISIBILITY ─────────────────────────────────── */}
            <Section id="visibility" open={open.visibility} onToggle={toggle} icon={Eye} iconColor="text-slate-400" title="Visibility">
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={Boolean(data.is_visible)}
                        onChange={e => u('is_visible', e.target.checked)}
                        className="w-4 h-4 rounded accent-lime-500"
                    />
                    <span className="text-sm text-slate-700 font-semibold">Show About section on public page</span>
                </label>
            </Section>
        </div>
    );
}
