import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import AboutFormFields from '@/Components/Admin/About/AboutFormFields';
import AboutPreviewCanvas from '@/Components/Admin/About/AboutPreviewCanvas';
import {
    Save, Send, RotateCcw, CheckCircle2, AlertCircle, Eye, UserRound,
} from 'lucide-react';

export default function Edit({
    initialDraft            = {},
    publishedConfig         = {},
    hasUnpublishedChanges   = false,
    publishedAt             = 'Jamais',
    coachImageUrl:  initCoachUrl  = null,
    certImageUrl:   initCertUrl   = null,
}) {
    const { data, setData, post, processing, errors, isDirty, reset } = useForm({
        eyebrow:                initialDraft.eyebrow                ?? 'About the coach',
        heading:                initialDraft.heading                ?? 'Built through',
        heading_highlight:      initialDraft.heading_highlight      ?? 'discipline.',
        description:            initialDraft.description            ?? '',
        coach_label:            initialDraft.coach_label            ?? 'The Coach',
        coach_heading:          initialDraft.coach_heading          ?? "Discipline.\nExperience.\nResults.",
        coach_description:      initialDraft.coach_description      ?? '',
        coach_statement:        initialDraft.coach_statement        ?? 'Strength is built daily',
        coach_image_alt:        initialDraft.coach_image_alt        ?? 'Fit Youness coach',
        coach_number:           initialDraft.coach_number           ?? '01',
        cert_eyebrow:           initialDraft.cert_eyebrow           ?? 'Professional certification',
        cert_heading:           initialDraft.cert_heading           ?? 'IFBB',
        cert_heading_highlight: initialDraft.cert_heading_highlight ?? 'Certified.',
        cert_description:       initialDraft.cert_description       ?? '',
        cert_statement:         initialDraft.cert_statement         ?? 'Knowledge • Training • Nutrition',
        cert_image_alt:         initialDraft.cert_image_alt         ?? 'IFBB certified coach',
        cert_number:            initialDraft.cert_number            ?? '02',
        bottom_statement:       initialDraft.bottom_statement       ?? "Train with purpose.\nProgress with confidence.",
        bottom_highlight:       initialDraft.bottom_highlight       ?? 'Progress with confidence.',
        cta_label:              initialDraft.cta_label              ?? 'Start your journey',
        cta_href:               initialDraft.cta_href               ?? '#contact',
        is_visible:             Boolean(initialDraft.is_visible     ?? true),
        coach_image:            null,
        cert_image:             null,
        remove_coach_image:     false,
        remove_cert_image:      false,
        action:                 'draft',
        _method:                'PUT',
    });

    const [coachPreviewUrl, setCoachPreviewUrl] = useState(initCoachUrl);
    const [certPreviewUrl,  setCertPreviewUrl]  = useState(initCertUrl);
    const blobUrls = useRef([]);

    const handleImageSelect = (field, file) => {
        setData(field, file);
        if (file) {
            const url = URL.createObjectURL(file);
            blobUrls.current.push(url);
            if (field === 'coach_image') setCoachPreviewUrl(url);
            if (field === 'cert_image')  setCertPreviewUrl(url);
        }
    };

    useEffect(() => () => blobUrls.current.forEach(URL.revokeObjectURL), []);

    useEffect(() => {
        const handler = e => { if (isDirty) { e.preventDefault(); e.returnValue = ''; } };
        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, [isDirty]);

    // Build live preview config — mirrors what the public component expects
    const liveConfig = useMemo(() => ({
        eyebrow:              data.eyebrow,
        heading:              data.heading,
        heading_highlight:    data.heading_highlight,
        description:          data.description,
        coach_label:          data.coach_label,
        coach_heading:        data.coach_heading,
        coach_description:    data.coach_description,
        coach_statement:      data.coach_statement,
        coach_image_url:      coachPreviewUrl || '/images/3.png',
        coach_image_alt:      data.coach_image_alt,
        coach_number:         data.coach_number,
        cert_eyebrow:         data.cert_eyebrow,
        cert_heading:         data.cert_heading,
        cert_heading_highlight: data.cert_heading_highlight,
        cert_description:     data.cert_description,
        cert_statement:       data.cert_statement,
        cert_image_url:       certPreviewUrl || '/images/4.png',
        cert_image_alt:       data.cert_image_alt,
        cert_number:          data.cert_number,
        bottom_statement:     data.bottom_statement,
        bottom_highlight:     data.bottom_highlight,
        cta_label:            data.cta_label,
        cta_href:             data.cta_href,
    }), [data, coachPreviewUrl, certPreviewUrl]);

    const handleSaveDraft = e => {
        e.preventDefault();
        data.action = 'draft';
        post(route('admin.about.update'), { forceFormData: true, preserveScroll: true });
    };

    const handlePublish = e => {
        e.preventDefault();
        if (confirm('Publier la section About en direct sur le site public ?')) {
            data.action = 'publish';
            post(route('admin.about.update'), { forceFormData: true, preserveScroll: true });
        }
    };

    const handleRevert = () => {
        if (confirm('Réinitialiser le brouillon à la dernière version publiée ?')) {
            router.post(route('admin.about.revert'), {}, {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setCoachPreviewUrl(initCoachUrl);
                    setCertPreviewUrl(initCertUrl);
                },
            });
        }
    };

    return (
        <AdminLayout title="Gestion — About Coach">
            <Head title="About Coach — Éditeur" />

            <div className="fy-hero-editor pb-12">
                {/* TOOLBAR */}
                <div className="fy-hero-editor__toolbar">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
                            <UserRound size={20} />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                                Éditeur About Coach
                                {isDirty ? (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                                        <AlertCircle size={12} /> Modifications non enregistrées
                                    </span>
                                ) : hasUnpublishedChanges ? (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                        Brouillon en attente
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                                        <CheckCircle2 size={12} /> Publié en direct
                                    </span>
                                )}
                            </h1>
                            <p className="text-xs text-slate-500">
                                Dernière publication : <span className="font-semibold">{publishedAt}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <button type="button" onClick={handleRevert} disabled={processing}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition">
                            <RotateCcw size={14} /> Réinitialiser
                        </button>
                        <button type="button" onClick={handleSaveDraft} disabled={processing}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 hover:bg-slate-50 shadow-sm disabled:opacity-50 transition">
                            <Save size={15} />
                            {processing && data.action === 'draft' ? 'Enregistrement…' : 'Enregistrer brouillon'}
                        </button>
                        <button type="button" onClick={handlePublish} disabled={processing}
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-xs font-black text-slate-950 shadow-md hover:shadow-lime-200 transition disabled:opacity-50">
                            <Send size={15} />
                            {processing && data.action === 'publish' ? 'Publication…' : 'Publier en direct'}
                        </button>
                        <a href="/#about" target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-1 p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                            title="Voir sur le site">
                            <Eye size={18} />
                        </a>
                    </div>
                </div>

                {/* 2-COLUMN LAYOUT */}
                <div className="fy-hero-editor__layout">
                    <form onSubmit={handleSaveDraft}>
                        <AboutFormFields
                            data={data}
                            setData={(k, v) => setData(k, v)}
                            errors={errors}
                            coachImageUrl={coachPreviewUrl}
                            certImageUrl={certPreviewUrl}
                            onCoachImageSelect={file => handleImageSelect('coach_image', file)}
                            onCertImageSelect={file  => handleImageSelect('cert_image',  file)}
                            onRemoveCoachImage={() => { setData('remove_coach_image', true); setCoachPreviewUrl(null); }}
                            onRemoveCertImage={()  => { setData('remove_cert_image',  true); setCertPreviewUrl(null); }}
                        />
                    </form>

                    <div>
                        <AboutPreviewCanvas config={liveConfig} title="Aperçu About en direct" />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
