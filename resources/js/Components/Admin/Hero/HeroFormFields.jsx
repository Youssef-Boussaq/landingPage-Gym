import React, { useState } from 'react';
import {
    Type,
    MousePointerClick,
    Image as ImageIcon,
    Sliders,
    Eye,
    ChevronDown,
    ChevronUp,
    Upload,
    Trash2,
    Sparkles,
} from 'lucide-react';

export default function HeroFormFields({
    data,
    setData,
    errors,
    coachImageUrl,
    backgroundImageUrl,
    onImageSelect,
}) {
    const [openSections, setOpenSections] = useState({
        content: true,
        ctas: true,
        images: true,
        appearance: false,
        visibility: false,
    });

    const toggleSection = (key) => {
        setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const update = (name, value) => {
        setData(name, value);
    };

    return (
        <div className="fy-hero-editor__panel">
            {/* 1. CONTENU ET TEXTES */}
            <div className="fy-hero-editor__card">
                <button
                    type="button"
                    onClick={() => toggleSection('content')}
                    className="fy-hero-editor__card-header w-full text-left"
                >
                    <span className="fy-hero-editor__card-title">
                        <Type className="text-lime-600" size={18} />
                        Textes & Message Principal
                    </span>
                    {openSections.content ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                </button>

                {openSections.content && (
                    <div className="space-y-4">
                        {/* Badge Eyebrow */}
                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label htmlFor="badge" className="text-xs font-black uppercase tracking-wider text-slate-700">
                                    Badge supérieur
                                </label>
                                <span className="text-[11px] font-semibold text-slate-400">
                                    {(data.badge || '').length}/120
                                </span>
                            </div>
                            <input
                                id="badge"
                                type="text"
                                value={data.badge ?? ''}
                                maxLength={120}
                                onChange={(e) => update('badge', e.target.value)}
                                placeholder="ex: FIT YOUNESS COACHING"
                                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-lime-500 focus:ring-2 focus:ring-lime-100"
                            />
                            {errors.badge && <p className="mt-1 text-xs text-rose-600 font-semibold">{errors.badge}</p>}
                        </div>

                        {/* Title Line 1 */}
                        <div>
                            <label htmlFor="title_line1" className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                                Titre principal — Ligne 1 <span className="text-rose-500">*</span>
                            </label>
                            <input
                                id="title_line1"
                                type="text"
                                value={data.title_line1 ?? ''}
                                onChange={(e) => update('title_line1', e.target.value)}
                                placeholder="ex: TRANSFORME."
                                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-bold outline-none transition focus:border-lime-500 focus:ring-2 focus:ring-lime-100"
                            />
                            {errors.title_line1 && <p className="mt-1 text-xs text-rose-600 font-semibold">{errors.title_line1}</p>}
                        </div>

                        {/* Highlighted Phrase */}
                        <div>
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <Sparkles size={14} className="text-amber-500" />
                                <label htmlFor="title_highlight" className="text-xs font-black uppercase tracking-wider text-slate-700">
                                    Phrase mise en valeur (surbrillance verte)
                                </label>
                            </div>
                            <input
                                id="title_highlight"
                                type="text"
                                value={data.title_highlight ?? ''}
                                onChange={(e) => update('title_highlight', e.target.value)}
                                placeholder="ex: DÉPASSE-TOI."
                                className="w-full rounded-xl border border-lime-300 bg-lime-50/30 px-3.5 py-2.5 text-sm font-extrabold text-slate-900 outline-none transition focus:border-lime-500 focus:ring-2 focus:ring-lime-100"
                            />
                            <p className="mt-1 text-[11px] text-slate-500">
                                Ce texte apparaît avec le fond vert athlétique Fit Youness.
                            </p>
                            {errors.title_highlight && <p className="mt-1 text-xs text-rose-600 font-semibold">{errors.title_highlight}</p>}
                        </div>

                        {/* Title Line 2 */}
                        <div>
                            <label htmlFor="title_line2" className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                                Titre principal — Ligne 2
                            </label>
                            <input
                                id="title_line2"
                                type="text"
                                value={data.title_line2 ?? ''}
                                onChange={(e) => update('title_line2', e.target.value)}
                                placeholder="ex: RÉUSSIS."
                                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-bold outline-none transition focus:border-lime-500 focus:ring-2 focus:ring-lime-100"
                            />
                        </div>

                        {/* Supporting Description */}
                        <div>
                            <label htmlFor="description" className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                                Description & Proposition de valeur
                            </label>
                            <textarea
                                id="description"
                                rows={3}
                                value={data.description ?? ''}
                                onChange={(e) => update('description', e.target.value)}
                                placeholder="Décrivez votre méthode de coaching et la transformation promise..."
                                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-lime-500 focus:ring-2 focus:ring-lime-100"
                            />
                            {errors.description && <p className="mt-1 text-xs text-rose-600 font-semibold">{errors.description}</p>}
                        </div>

                        {/* Keywords */}
                        <div>
                            <label htmlFor="keywords" className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                                Mots-clés / Spécialités
                            </label>
                            <input
                                id="keywords"
                                type="text"
                                value={data.keywords ?? ''}
                                onChange={(e) => update('keywords', e.target.value)}
                                placeholder="ex: Coaching Sur-Mesure • Nutrition • Suivi 24/7"
                                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-lime-500 focus:ring-2 focus:ring-lime-100"
                            />
                        </div>

                        {/* Coach Welcome Note / Quote */}
                        <div className="p-3.5 rounded-xl bg-lime-50/40 border border-lime-200/80 space-y-2">
                            <div className="flex justify-between items-center">
                                <label htmlFor="coach_quote" className="text-xs font-black uppercase tracking-wider text-slate-800">
                                    Message de bienvenue du Coach (Bulle d'accueil)
                                </label>
                                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-600">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(data.show_coach_quote)}
                                        onChange={(e) => update('show_coach_quote', e.target.checked)}
                                        className="rounded border-slate-300 text-lime-600 focus:ring-lime-500"
                                    />
                                    Afficher
                                </label>
                            </div>
                            <textarea
                                id="coach_quote"
                                rows={2}
                                value={data.coach_quote ?? ''}
                                onChange={(e) => update('coach_quote', e.target.value)}
                                placeholder="« Chaque transformation commence par une première décision. Je suis là pour t’accompagner pas à pas. »"
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-lime-500"
                            />
                            <p className="text-[11px] text-slate-500">
                                Bulle interactive flottante près du portrait du coach.
                            </p>
                        </div>

                        {/* Stat / Social Proof */}
                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                            <div>
                                <label htmlFor="stat_value" className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                                    Chiffre clé (statistique)
                                </label>
                                <input
                                    id="stat_value"
                                    type="text"
                                    value={data.stat_value ?? ''}
                                    onChange={(e) => update('stat_value', e.target.value)}
                                    placeholder="ex: 500+"
                                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold outline-none focus:border-lime-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="stat_label" className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                                    Label du chiffre
                                </label>
                                <input
                                    id="stat_label"
                                    type="text"
                                    value={data.stat_label ?? ''}
                                    onChange={(e) => update('stat_label', e.target.value)}
                                    placeholder="ex: Clients Transformés"
                                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-lime-500"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 2. BOUTONS D'ACTION (CTAs) */}
            <div className="fy-hero-editor__card">
                <button
                    type="button"
                    onClick={() => toggleSection('ctas')}
                    className="fy-hero-editor__card-header w-full text-left"
                >
                    <span className="fy-hero-editor__card-title">
                        <MousePointerClick className="text-lime-600" size={18} />
                        Boutons d'Appel à l'Action (CTAs)
                    </span>
                    {openSections.ctas ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                </button>

                {openSections.ctas && (
                    <div className="space-y-5">
                        {/* Primary CTA */}
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                                    Bouton Principal (Vert)
                                </span>
                                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-600">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(data.show_cta)}
                                        onChange={(e) => update('show_cta', e.target.checked)}
                                        className="rounded border-slate-300 text-lime-600 focus:ring-lime-500"
                                    />
                                    Afficher
                                </label>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label htmlFor="cta_text" className="block text-[11px] font-bold text-slate-600 mb-1">
                                        Texte
                                    </label>
                                    <input
                                        id="cta_text"
                                        type="text"
                                        value={data.cta_text ?? ''}
                                        onChange={(e) => update('cta_text', e.target.value)}
                                        placeholder="ex: DÉMARRER LE COACHING"
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="cta_href" className="block text-[11px] font-bold text-slate-600 mb-1">
                                        Destination (ancre ou URL)
                                    </label>
                                    <input
                                        id="cta_href"
                                        type="text"
                                        value={data.cta_href ?? ''}
                                        onChange={(e) => update('cta_href', e.target.value)}
                                        placeholder="ex: #contact"
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-mono"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Secondary CTA */}
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                                    Bouton Secondaire (Blanc / Contour)
                                </span>
                                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-600">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(data.show_secondary_cta)}
                                        onChange={(e) => update('show_secondary_cta', e.target.checked)}
                                        className="rounded border-slate-300 text-lime-600 focus:ring-lime-500"
                                    />
                                    Afficher
                                </label>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label htmlFor="secondary_cta_text" className="block text-[11px] font-bold text-slate-600 mb-1">
                                        Texte
                                    </label>
                                    <input
                                        id="secondary_cta_text"
                                        type="text"
                                        value={data.secondary_cta_text ?? ''}
                                        onChange={(e) => update('secondary_cta_text', e.target.value)}
                                        placeholder="ex: VOIR LES PROGRAMMES"
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="secondary_cta_href" className="block text-[11px] font-bold text-slate-600 mb-1">
                                        Destination (ancre ou URL)
                                    </label>
                                    <input
                                        id="secondary_cta_href"
                                        type="text"
                                        value={data.secondary_cta_href ?? ''}
                                        onChange={(e) => update('secondary_cta_href', e.target.value)}
                                        placeholder="ex: #programs"
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-mono"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 3. IMAGE DU COACH & MÉDIAS */}
            <div className="fy-hero-editor__card">
                <button
                    type="button"
                    onClick={() => toggleSection('images')}
                    className="fy-hero-editor__card-header w-full text-left"
                >
                    <span className="fy-hero-editor__card-title">
                        <ImageIcon className="text-lime-600" size={18} />
                        Portrait du Coach & Médias
                    </span>
                    {openSections.images ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                </button>

                {openSections.images && (
                    <div className="space-y-4">
                        {/* Coach Image Upload */}
                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                                    Photo du Coach (PNG détouré ou WebP recommandé)
                                </label>
                                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-600">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(data.show_coach_image)}
                                        onChange={(e) => update('show_coach_image', e.target.checked)}
                                        className="rounded border-slate-300 text-lime-600 focus:ring-lime-500"
                                    />
                                    Afficher
                                </label>
                            </div>

                            <div className="flex items-center gap-4 p-3 rounded-xl border border-slate-200 bg-slate-50">
                                <div className="w-16 h-20 rounded-lg bg-white border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                                    <img
                                        src={coachImageUrl || '/images/2.png'}
                                        alt="Aperçu coach"
                                        className="w-full h-full object-contain"
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-sm transition">
                                        <Upload size={14} />
                                        Choisir une image
                                        <input
                                            type="file"
                                            accept="image/png,image/webp,image/jpeg"
                                            className="sr-only"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) onImageSelect('coach_image', file);
                                            }}
                                        />
                                    </label>
                                    <p className="mt-1 text-[11px] text-slate-400">
                                        PNG détouré, WebP ou JPG · Max 4 Mo
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Alt text & Focal Position */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="coach_image_alt" className="block text-[11px] font-bold text-slate-600 mb-1">
                                    Texte alternatif (accessibilité SEO)
                                </label>
                                <input
                                    id="coach_image_alt"
                                    type="text"
                                    value={data.coach_image_alt ?? ''}
                                    onChange={(e) => update('coach_image_alt', e.target.value)}
                                    placeholder="ex: Coach Fit Youness"
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
                                />
                            </div>

                            <div>
                                <label htmlFor="portrait_focal" className="block text-[11px] font-bold text-slate-600 mb-1">
                                    Cadrage / Point focal
                                </label>
                                <select
                                    id="portrait_focal"
                                    value={data.portrait_focal ?? 'center'}
                                    onChange={(e) => update('portrait_focal', e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium"
                                >
                                    <option value="center">Centré (Recommandé)</option>
                                    <option value="top">Haut (Focus visage)</option>
                                    <option value="bottom">Bas (Ancré au sol)</option>
                                </select>
                            </div>
                        </div>

                        {/* Floating Experience Badge */}
                        <div className="pt-3 border-t border-slate-100">
                            <div className="flex justify-between items-center mb-1.5">
                                <label htmlFor="experience_badge_text" className="text-xs font-black uppercase tracking-wider text-slate-700">
                                    Badge d'expérience flottant
                                </label>
                                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-600">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(data.show_experience_badge)}
                                        onChange={(e) => update('show_experience_badge', e.target.checked)}
                                        className="rounded border-slate-300 text-lime-600 focus:ring-lime-500"
                                    />
                                    Afficher
                                </label>
                            </div>
                            <input
                                id="experience_badge_text"
                                type="text"
                                value={data.experience_badge_text ?? ''}
                                onChange={(e) => update('experience_badge_text', e.target.value)}
                                placeholder="ex: 10+ ANS D'EXPÉRIENCE"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* 4. APPARENCE & MISE EN PAGE */}
            <div className="fy-hero-editor__card">
                <button
                    type="button"
                    onClick={() => toggleSection('appearance')}
                    className="fy-hero-editor__card-header w-full text-left"
                >
                    <span className="fy-hero-editor__card-title">
                        <Sliders className="text-lime-600" size={18} />
                        Disposition & Ambiance
                    </span>
                    {openSections.appearance ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                </button>

                {openSections.appearance && (
                    <div className="space-y-4">
                        {/* Layout Variant */}
                        <div>
                            <label htmlFor="layout_variant" className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                                Variante de mise en page
                            </label>
                            <select
                                id="layout_variant"
                                value={data.layout_variant ?? 'editorial-split'}
                                onChange={(e) => update('layout_variant', e.target.value)}
                                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold"
                            >
                                <option value="editorial-split">Éditorial Asymétrique (Recommandé)</option>
                                <option value="studio-compact">Studio Équilibré 50/50</option>
                                <option value="centered">Centré Minimaliste</option>
                            </select>
                        </div>

                        {/* Text Alignment */}
                        <div>
                            <label htmlFor="text_alignment" className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                                Alignement du texte
                            </label>
                            <select
                                id="text_alignment"
                                value={data.text_alignment ?? 'auto'}
                                onChange={(e) => update('text_alignment', e.target.value)}
                                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold"
                            >
                                <option value="auto">Automatique (RTL si Arabe, Gauche si Français)</option>
                                <option value="left">Aligné à gauche (LTR)</option>
                                <option value="center">Centré</option>
                                <option value="right">Aligné à droite (RTL forcé)</option>
                            </select>
                        </div>

                        {/* Background Style */}
                        <div>
                            <label htmlFor="background_style" className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                                Style d'arrière-plan
                            </label>
                            <select
                                id="background_style"
                                value={data.background_style ?? 'subtle-glow'}
                                onChange={(e) => update('background_style', e.target.value)}
                                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold"
                            >
                                <option value="subtle-glow">Lueur Ambiante Verte (Fit Youness)</option>
                                <option value="clean-white">Blanc Pur Studio</option>
                                <option value="soft-neutral">Gris Neutre Doux</option>
                            </select>
                        </div>

                        {/* Interactive Features Toggles */}
                        <div className="pt-3 border-t border-slate-100 space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                                <div>
                                    <span className="block text-xs font-black text-slate-800">
                                        Sélecteur d'Objectifs Interactif
                                    </span>
                                    <span className="block text-[11px] text-slate-500">
                                        3 choix interactifs (Perte de poids, Muscle, Remise en forme)
                                    </span>
                                </div>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(data.show_goal_selector)}
                                        onChange={(e) => update('show_goal_selector', e.target.checked)}
                                        className="rounded border-slate-300 text-lime-600 focus:ring-lime-500 w-4 h-4"
                                    />
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                                <div>
                                    <span className="block text-xs font-black text-slate-800">
                                        Bandeau de Confiance (Trust Strip)
                                    </span>
                                    <span className="block text-[11px] text-slate-500">
                                        Coaching Diplômé & Dédié • Suivi 1:1
                                    </span>
                                </div>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(data.show_trust_strip)}
                                        onChange={(e) => update('show_trust_strip', e.target.checked)}
                                        className="rounded border-slate-300 text-lime-600 focus:ring-lime-500 w-4 h-4"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
