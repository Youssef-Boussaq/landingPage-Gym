import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import HeroPreviewCanvas from '@/Components/Admin/Hero/HeroPreviewCanvas';
import HeroFormFields from '@/Components/Admin/Hero/HeroFormFields';
import {
    Save,
    Send,
    RotateCcw,
    CheckCircle2,
    AlertCircle,
    Eye,
    Sparkles,
} from 'lucide-react';

export default function Edit({
    initialDraft = {},
    publishedConfig = {},
    hasUnpublishedChanges = false,
    publishedAt = 'Jamais',
    coachImageUrl: initialCoachImageUrl = null,
    backgroundImageUrl: initialBackgroundImageUrl = null,
}) {
    // Form state initialized with the current draft configuration
    const { data, setData, post, processing, errors, isDirty, reset } = useForm({
        badge: initialDraft.badge ?? '',
        title_line1: initialDraft.title_line1 ?? '',
        title_highlight: initialDraft.title_highlight ?? (initialDraft.title_line2 ?? ''),
        title_line2: initialDraft.title_line2 ?? '',
        title_line3: initialDraft.title_line3 ?? '',
        keywords: initialDraft.keywords ?? '',
        description: initialDraft.description ?? '',
        cta_text: initialDraft.cta_text ?? '',
        cta_href: initialDraft.cta_href ?? '#contact',
        secondary_cta_text: initialDraft.secondary_cta_text ?? '',
        secondary_cta_href: initialDraft.secondary_cta_href ?? '#programs',
        stat_value: initialDraft.stat_value ?? '',
        stat_label: initialDraft.stat_label ?? '',
        experience_badge_text: initialDraft.experience_badge_text ?? '',
        coach_quote: initialDraft.coach_quote ?? '« Chaque transformation commence par une première décision. Je suis là pour t’accompagner pas à pas. »',
        portrait_focal: initialDraft.portrait_focal ?? 'center',
        coach_image_alt: initialDraft.coach_image_alt ?? 'Coach Fit Youness',

        show_badge: Boolean(initialDraft.show_badge ?? true),
        show_title: Boolean(initialDraft.show_title ?? true),
        show_keywords: Boolean(initialDraft.show_keywords ?? true),
        show_description: Boolean(initialDraft.show_description ?? true),
        show_goal_selector: Boolean(initialDraft.show_goal_selector ?? true),
        show_cta: Boolean(initialDraft.show_cta ?? true),
        show_secondary_cta: Boolean(initialDraft.show_secondary_cta ?? true),
        show_stat: Boolean(initialDraft.show_stat ?? true),
        show_coach_image: Boolean(initialDraft.show_coach_image ?? true),
        show_coach_quote: Boolean(initialDraft.show_coach_quote ?? true),
        show_experience_badge: Boolean(initialDraft.show_experience_badge ?? true),
        show_background_image: Boolean(initialDraft.show_background_image ?? true),
        show_trust_strip: Boolean(initialDraft.show_trust_strip ?? true),
        show_slashes: Boolean(initialDraft.show_slashes ?? false),

        layout_variant: initialDraft.layout_variant ?? 'editorial-split',
        text_alignment: initialDraft.text_alignment ?? 'auto',
        background_style: initialDraft.background_style ?? 'subtle-glow',

        coach_image: null,
        background_image: null,
        action: 'draft',
        _method: 'PUT',
    });

    // Local image object URL previews for instant zero-latency feedback
    const [coachPreviewUrl, setCoachPreviewUrl] = useState(initialCoachImageUrl);
    const [backgroundPreviewUrl, setBackgroundPreviewUrl] = useState(initialBackgroundImageUrl);
    const activeBlobUrlsRef = useRef([]);

    // Handle local image selection with URL.createObjectURL
    const handleImageSelect = (field, file) => {
        setData(field, file);
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            activeBlobUrlsRef.current.push(objectUrl);
            if (field === 'coach_image') setCoachPreviewUrl(objectUrl);
            if (field === 'background_image') setBackgroundPreviewUrl(objectUrl);
        }
    };

    // Clean up created object URLs on unmount
    useEffect(() => {
        return () => {
            activeBlobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
        };
    }, []);

    // Warn before navigating away if form is dirty
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    // Live reactive preview configuration (camelCase mapping expected by Hero.jsx)
    const livePreviewConfig = useMemo(() => ({
        badge: data.badge,
        titleLine1: data.title_line1,
        titleHighlight: data.title_highlight,
        titleLine2: data.title_line2,
        titleLine3: data.title_line3,
        keywords: data.keywords,
        description: data.description,
        ctaText: data.cta_text,
        ctaHref: data.cta_href,
        secondaryCtaText: data.secondary_cta_text,
        secondaryCtaHref: data.secondary_cta_href,
        statValue: data.stat_value,
        statLabel: data.stat_label,
        experienceBadgeText: data.experience_badge_text,
        coachQuote: data.coach_quote,
        portraitFocal: data.portrait_focal,
        coachImage: coachPreviewUrl || '/images/2.png',
        coachImageAlt: data.coach_image_alt,
        backgroundImage: backgroundPreviewUrl,

        showBadge: data.show_badge,
        showTitle: data.show_title,
        showKeywords: data.show_keywords,
        showDescription: data.show_description,
        showGoalSelector: data.show_goal_selector,
        showCta: data.show_cta,
        showSecondaryCta: data.show_secondary_cta,
        showStat: data.show_stat,
        showCoachImage: data.show_coach_image,
        showCoachQuote: data.show_coach_quote,
        showExperienceBadge: data.show_experience_badge,
        showBackgroundImage: data.show_background_image,
        showTrustStrip: data.show_trust_strip,
        showSlashes: data.show_slashes,

        layoutVariant: data.layout_variant,
        textAlignment: data.text_alignment,
        backgroundStyle: data.background_style,
    }), [data, coachPreviewUrl, backgroundPreviewUrl]);

    // Save as draft
    const handleSaveDraft = (e) => {
        e.preventDefault();
        data.action = 'draft';
        post(route('admin.hero.update'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    // Save & Publish live
    const handlePublish = (e) => {
        e.preventDefault();
        if (confirm('Voulez-vous publier cette configuration en direct sur le site public ?')) {
            data.action = 'publish';
            post(route('admin.hero.update'), {
                forceFormData: true,
                preserveScroll: true,
            });
        }
    };

    // Revert draft to published
    const handleRevert = () => {
        if (confirm('Êtes-vous sûr de vouloir annuler vos modifications et restaurer la dernière version publiée ?')) {
            router.post(route('admin.hero.revert'), {}, {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setCoachPreviewUrl(initialCoachImageUrl);
                    setBackgroundPreviewUrl(initialBackgroundImageUrl);
                },
            });
        }
    };

    return (
        <AdminLayout title="Gestion du Hero">
            <Head title="Gestion du Hero — Live Preview" />

            <div className="fy-hero-editor pb-12">
                {/* TOOLBAR */}
                <div className="fy-hero-editor__toolbar">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-lime-100 text-lime-700 flex items-center justify-center font-black">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                                Éditeur du Hero
                                {isDirty ? (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                                        <AlertCircle size={12} />
                                        Modifications non enregistrées
                                    </span>
                                ) : hasUnpublishedChanges ? (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                        Brouillon en attente de publication
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                                        <CheckCircle2 size={12} />
                                        Publié en direct
                                    </span>
                                )}
                            </h1>
                            <p className="text-xs text-slate-500">
                                Dernière publication : <span className="font-semibold">{publishedAt}</span>
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            type="button"
                            onClick={handleRevert}
                            disabled={processing}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition"
                            title="Rétablir la version publiée"
                        >
                            <RotateCcw size={14} />
                            Réinitialiser
                        </button>

                        <button
                            type="button"
                            onClick={handleSaveDraft}
                            disabled={processing}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 hover:bg-slate-50 shadow-sm disabled:opacity-50 transition"
                        >
                            <Save size={15} />
                            {processing && data.action === 'draft' ? 'Enregistrement...' : 'Enregistrer brouillon'}
                        </button>

                        <button
                            type="button"
                            onClick={handlePublish}
                            disabled={processing}
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-xs font-black text-slate-950 shadow-md hover:shadow-lime-200 transition disabled:opacity-50"
                        >
                            <Send size={15} />
                            {processing && data.action === 'publish' ? 'Publication...' : 'Publier en direct'}
                        </button>

                        <a
                            href="/"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                            title="Voir le site en direct dans un nouvel onglet"
                        >
                            <Eye size={18} />
                        </a>
                    </div>
                </div>

                {/* 2-COLUMN LAYOUT: FORM PANEL (LEFT) & LIVE PREVIEW CANVAS (RIGHT) */}
                <div className="fy-hero-editor__layout">
                    {/* Left Editing Controls */}
                    <form onSubmit={handleSaveDraft}>
                        <HeroFormFields
                            data={data}
                            setData={(name, val) => setData(name, val)}
                            errors={errors}
                            coachImageUrl={coachPreviewUrl}
                            backgroundImageUrl={backgroundPreviewUrl}
                            onImageSelect={handleImageSelect}
                        />
                    </form>

                    {/* Right Interactive Live Preview Canvas */}
                    <div>
                        <HeroPreviewCanvas
                            config={livePreviewConfig}
                            title="Aperçu du Hero en Direct"
                        />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
