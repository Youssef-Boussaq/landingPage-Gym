import React, { useState, useMemo, useEffect, useRef } from 'react';
import SplitText from '@/Components/ui/SplitText';
import HeroAnimatedBackground from '@/Components/ui/HeroAnimatedBackground';
import {
    ArrowRight,
    Award,
    Check,
    CheckCircle2,
    Dumbbell,
    Flame,
    ShieldCheck,
    Sparkles,
    Star,
    Zap,
} from 'lucide-react';

export const HERO_DEFAULTS = {
    badge: 'VOTRE PARCOURS COMMENCE ICI',
    titleLine1: 'CONSTRUIS UN CORPS PLUS FORT.',
    titleHighlight: 'ENSEMBLE.',
    titleLine2: 'À TON RYTHME.',
    titleLine3: '',
    keywords: 'Coaching Sur-Mesure • Nutrition • Suivi 24/7',
    description:
        'Un accompagnement personnalisé, une nutrition adaptée à votre quotidien et des entraînements ciblés pour atteindre vos objectifs avec bienveillance et rigueur.',
    ctaText: 'DÉMARRER MON COACHING',
    ctaHref: '#contact',
    secondaryCtaText: 'VOIR LES PROGRAMMES',
    secondaryCtaHref: '#programs',
    statValue: '500+',
    statLabel: 'Transformations Réussies',
    experienceBadgeText: '10+ ANS D’EXPÉRIENCE',
    coachQuote: '« Chaque transformation commence par une première décision. Je suis là pour t’accompagner pas à pas. »',
    portraitFocal: 'center',
    backgroundImage: null,
    coachImage: '/images/2.webp',
    coachImageFallback: '/images/2.png',
    coachImageAlt: 'Coach Fit Youness',

    showBadge: true,
    showTitle: true,
    showKeywords: true,
    showDescription: true,
    showGoalSelector: true,
    showCta: true,
    showSecondaryCta: true,
    showStat: true,
    showCoachImage: true,
    showCoachQuote: true,
    showExperienceBadge: true,
    showBackgroundImage: true,
    showTrustStrip: true,

    layoutVariant: 'editorial-split',
    textAlignment: 'auto',
    backgroundStyle: 'subtle-glow',
};

// Goals for the interactive goal selector
const GOAL_OPTIONS = [
    {
        id: 'perte-poids',
        label: 'Perte de Poids',
        shortLabel: 'Perte de Poids',
        icon: Flame,
        badgeText: 'Option : Perte de Poids',
        advice: '« Déficit calorique progressif, cardio optimisé et tonification sans faim ni privation extrême. »',
    },
    {
        id: 'prise-masse',
        label: 'Prise de Muscle',
        shortLabel: 'Prise de Muscle',
        icon: Dumbbell,
        badgeText: 'Option : Prise de Muscle',
        advice: '« Surcharge progressive maîtrisée, technique rigoureuse et apports nutritionnels calibrés. »',
    },
    {
        id: 'remise-en-forme',
        label: 'Remise en Forme',
        shortLabel: 'Remise en Forme',
        icon: Zap,
        badgeText: 'Option : Vitalité & Santé',
        advice: '« Retrouvez vitalité, mobilité et énergie au quotidien avec des séances fluides et motivantes. »',
    },
];

function hasArabic(text = '') {
    return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);
}

export default function Hero({ config = {}, isPreview = false }) {
    const hero = useMemo(() => ({ ...HERO_DEFAULTS, ...config }), [config]);

    // Interactive Goal Selector state
    const [selectedGoalId, setSelectedGoalId] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    // Entrance animation trigger
    useEffect(() => {
        if (isPreview) {
            setIsVisible(true);
            return;
        }
        const el = sectionRef.current;
        if (!el) return;
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.disconnect();
                    }
                },
                { threshold: 0.1 }
            );
            observer.observe(el);
            return () => observer.disconnect();
        } else {
            setIsVisible(true);
        }
    }, [isPreview]);

    const activeGoal = useMemo(() => {
        return GOAL_OPTIONS.find((g) => g.id === selectedGoalId) || null;
    }, [selectedGoalId]);

    // Handle goal toggling
    const handleGoalToggle = (goalId) => {
        setSelectedGoalId((prev) => (prev === goalId ? null : goalId));
    };

    // Determine if the primary layout should be RTL
    // Only switch the whole section to RTL if user explicitly chose 'right'
    // or if the main headline line 1 is Arabic.
    const isRTL = useMemo(() => {
        if (hero.textAlignment === 'right') return true;
        if (hero.textAlignment === 'left' || hero.textAlignment === 'center') return false;
        return hasArabic(hero.titleLine1 || '');
    }, [hero.textAlignment, hero.titleLine1]);

    // Alignment CSS class
    const alignClass = useMemo(() => {
        if (hero.textAlignment === 'center') return 'fy-hero--align-center';
        if (hero.textAlignment === 'right' || isRTL) return 'fy-hero--align-right';
        return 'fy-hero--align-left';
    }, [hero.textAlignment, isRTL]);

    // Background style class
    const bgClass = useMemo(() => {
        switch (hero.backgroundStyle) {
            case 'clean-white':
                return 'fy-hero--clean-white';
            case 'soft-neutral':
                return 'fy-hero--soft-neutral';
            default:
                return 'fy-hero--subtle-glow';
        }
    }, [hero.backgroundStyle]);

    // Grid layout class
    const gridClass = useMemo(() => {
        switch (hero.layoutVariant) {
            case 'studio-compact':
                return 'fy-hero__grid--studio-compact';
            case 'centered':
                return 'fy-hero__grid--centered';
            default:
                return 'fy-hero__grid--editorial-split';
        }
    }, [hero.layoutVariant]);

    // Focal position class for the portrait image
    const focalClass = useMemo(() => {
        switch (hero.portraitFocal) {
            case 'top':
                return 'fy-hero__portrait-img--focal-top';
            case 'bottom':
                return 'fy-hero__portrait-img--focal-bottom';
            default:
                return 'fy-hero__portrait-img--focal-center';
        }
    }, [hero.portraitFocal]);

    // Compute dynamic CTA destination based on selected goal
    const computedCtaHref = useMemo(() => {
        const baseHref = hero.ctaHref || '#contact';
        if (!selectedGoalId) return baseHref;
        const separator = baseHref.includes('?') ? '&' : '?';
        return `${baseHref}${separator}goal=${encodeURIComponent(selectedGoalId)}`;
    }, [hero.ctaHref, selectedGoalId]);

    // Resolve coach image URLs
    const primaryCoachImg = hero.coachImage || '/images/2.webp';
    const fallbackCoachImg = hero.coachImageFallback || '/images/2.png';

    return (
        <section
            id="hero"
            ref={sectionRef}
            dir={isRTL ? 'rtl' : 'ltr'}
            className={`fy-hero ${bgClass} ${alignClass} ${isPreview ? 'fy-hero--preview' : ''} ${isVisible ? 'fy-hero--visible' : ''}`}
            aria-label="Présentation du Coach Fit Youness"
        >
            {/* React Bits Ambient Animated Background */}
            <HeroAnimatedBackground />

            {/* Ambient Background Glow Layer */}
            <div className="fy-hero__ambient" aria-hidden="true" />

            {/* Optional subtle background image overlay */}
            {hero.showBackgroundImage && hero.backgroundImage && (
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.06] bg-cover bg-center mix-blend-multiply"
                    style={{ backgroundImage: `url(${hero.backgroundImage})` }}
                    aria-hidden="true"
                />
            )}

            <div className="fy-hero__inner">
                <div className={`fy-hero__grid ${gridClass}`}>
                    {/* LEFT COLUMN: Editorial & Value Engine */}
                    <div className="fy-hero__content">
                        {/* 1. Friendly Eyebrow Badge */}
                        {hero.showBadge && hero.badge && (
                            <div className="fy-hero__eyebrow-container fy-hero__enter fy-hero__enter--0">
                                <span className="fy-hero__eyebrow">
                                    <span className="fy-hero__eyebrow-dot" aria-hidden="true" />
                                    <span className="fy-hero__eyebrow-text">{hero.badge}</span>
                                    <Sparkles className="w-3 h-3 text-lime-500 opacity-80" aria-hidden="true" />
                                </span>
                            </div>
                        )}

                        {/* 2. Main Editorial Headline with React Bits SplitText */}
                        {hero.showTitle && (
                            <h1 className="fy-hero__title fy-hero__enter fy-hero__enter--1" dir="auto">
                                {hero.titleLine1 && (
                                    <span className="fy-hero__title-line1">
                                        <SplitText text={hero.titleLine1} delay={0.1} stagger={0.015} />{' '}
                                    </span>
                                )}

                                {hero.titleHighlight && (
                                    <span className="fy-hero__highlight">
                                        <SplitText text={hero.titleHighlight} delay={0.35} stagger={0.02} />{' '}
                                    </span>
                                )}

                                {hero.titleLine2 && (
                                    <span className="fy-hero__title-line2">
                                        <SplitText text={hero.titleLine2} delay={0.55} stagger={0.015} />
                                    </span>
                                )}
                            </h1>
                        )}

                        {/* 3. Conversational Supporting Description */}
                        {hero.showDescription && hero.description && (
                            <p className="fy-hero__description fy-hero__enter fy-hero__enter--2" dir="auto">
                                {hero.description}
                            </p>
                        )}

                        {/* 4. Interactive Goal Selector */}
                        {hero.showGoalSelector && (
                            <div
                                className="fy-hero__goal-selector"
                                role="region"
                                aria-label="Choisir un objectif de coaching"
                            >
                                <div className="fy-hero__goal-header">
                                    <span className="fy-hero__goal-prompt">
                                        Quel est votre objectif prioritaire ?
                                    </span>
                                    <span className="fy-hero__goal-hint">
                                        (Cliquez pour personnaliser votre suivi)
                                    </span>
                                </div>

                                <div
                                    className="fy-hero__goal-chips"
                                    role="radiogroup"
                                    aria-label="Objectifs de fitness"
                                >
                                    {GOAL_OPTIONS.map((goal) => {
                                        const isSelected = selectedGoalId === goal.id;
                                        const GoalIcon = goal.icon;
                                        return (
                                            <button
                                                key={goal.id}
                                                type="button"
                                                role="radio"
                                                aria-checked={isSelected}
                                                onClick={() => handleGoalToggle(goal.id)}
                                                className={`fy-hero__goal-chip ${isSelected ? 'fy-hero__goal-chip--active' : ''}`}
                                            >
                                                <GoalIcon
                                                    className={`w-3.5 h-3.5 transition-transform duration-200 ${isSelected ? 'text-lime-600 scale-110' : 'text-slate-500'
                                                        }`}
                                                    aria-hidden="true"
                                                />
                                                <span>{goal.label}</span>
                                                {isSelected && (
                                                    <CheckCircle2
                                                        className="w-3.5 h-3.5 text-lime-600 ml-0.5 animate-in zoom-in-75 duration-150"
                                                        aria-hidden="true"
                                                    />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Dynamic Coach Advice Note */}
                                {activeGoal && (
                                    <div
                                        className="fy-hero__goal-feedback"
                                        role="status"
                                        aria-live="polite"
                                    >
                                        <div className="fy-hero__goal-feedback-tag">
                                            <Sparkles className="w-3 h-3" aria-hidden="true" />
                                            <span>Conseil de Youness</span>
                                        </div>
                                        <p className="fy-hero__goal-feedback-text">
                                            {activeGoal.advice}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 5. Calls to Action */}
                        {(hero.showCta || hero.showSecondaryCta) && (
                            <div className="fy-hero__actions">
                                {hero.showCta && hero.ctaText && (
                                    <a
                                        href={computedCtaHref}
                                        className="fy-hero__button fy-hero__button--primary group"
                                        id="hero-primary-cta"
                                    >
                                        <span className="flex items-center gap-2">
                                            <span>{hero.ctaText}</span>
                                            {activeGoal && (
                                                <span className="fy-hero__button-tag">
                                                    {activeGoal.shortLabel}
                                                </span>
                                            )}
                                        </span>
                                        <ArrowRight
                                            aria-hidden="true"
                                            className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1.5"
                                        />
                                    </a>
                                )}

                                {hero.showSecondaryCta && hero.secondaryCtaText && (
                                    <a
                                        href={hero.secondaryCtaHref || '#programs'}
                                        className="fy-hero__button fy-hero__button--secondary"
                                        id="hero-secondary-cta"
                                    >
                                        <span>{hero.secondaryCtaText}</span>
                                    </a>
                                )}
                            </div>
                        )}

                        {/* 6. Authentic Trust Strip */}
                        {hero.showTrustStrip && (
                            <div className="fy-hero__trust-strip">
                                <div className="fy-hero__trust-item">
                                    <ShieldCheck className="w-4 h-4 text-lime-600 flex-shrink-0" aria-hidden="true" />
                                    <span>Coaching Diplômé & Dédié</span>
                                </div>
                                <span className="fy-hero__trust-separator" aria-hidden="true">•</span>
                                <div className="fy-hero__trust-item">
                                    <Check className="w-4 h-4 text-lime-600 flex-shrink-0" aria-hidden="true" />
                                    <span>Suivi 1:1 Sans Routine Figée</span>
                                </div>
                                {hero.showStat && hero.statValue && (
                                    <>
                                        <span className="fy-hero__trust-separator" aria-hidden="true">•</span>
                                        <div className="fy-hero__trust-item font-semibold text-slate-800">
                                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400 flex-shrink-0" aria-hidden="true" />
                                            <span>{hero.statValue} {hero.statLabel || 'Transformations'}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Optional Specialty Keywords */}
                        {hero.showKeywords && hero.keywords && (
                            <div className="fy-hero__keywords" dir="auto">
                                <span>{hero.keywords}</span>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Coach Portrait & Welcoming Human Connection */}
                    {hero.showCoachImage && (
                        <div className="fy-hero__portrait-col">
                            <div className="fy-hero__portrait-card">
                                {/* Ambient halo behind the athlete */}
                                <div className="fy-hero__portrait-halo" aria-hidden="true" />

                                {/* High-Performance Coach Picture */}
                                <picture className="fy-hero__portrait-picture">
                                    {/* Use dynamic primaryCoachImg — never hardcode the source path */}
                                    {primaryCoachImg && primaryCoachImg.endsWith('.webp') && (
                                        <source srcSet={primaryCoachImg} type="image/webp" />
                                    )}
                                    <img
                                        src={primaryCoachImg}
                                        alt={hero.coachImageAlt || 'Coach Fit Youness'}
                                        width="720"
                                        height="900"
                                        fetchPriority="high"
                                        decoding="async"
                                        className={`fy-hero__portrait-img ${focalClass}`}
                                        onError={(e) => {
                                            // Fallback to png if webp fails
                                            if (e.currentTarget.src !== fallbackCoachImg) {
                                                e.currentTarget.src = fallbackCoachImg;
                                            }
                                        }}
                                    />
                                </picture>

                                {/* Floating Coach Personal Welcome Speech Card */}
                                {hero.showCoachQuote && (
                                    <div className="fy-hero__coach-note" aria-label="Message de bienvenue du coach">
                                        <div className="fy-hero__coach-note-header">
                                            <div className="fy-hero__coach-status">
                                                <span className="fy-hero__coach-status-dot" aria-hidden="true" />
                                                <span className="fy-hero__coach-status-text">Disponible pour vous guider</span>
                                            </div>
                                            <span className="fy-hero__coach-tag">Coach Youness</span>
                                        </div>
                                        <p className="fy-hero__coach-note-quote">
                                            {hero.coachQuote || HERO_DEFAULTS.coachQuote}
                                        </p>
                                    </div>
                                )}

                                {/* Floating Experience Credentials Badge */}
                                {hero.showExperienceBadge && hero.experienceBadgeText && (
                                    <div
                                        className="fy-hero__floating-badge"
                                        aria-label={`Expérience : ${hero.experienceBadgeText}`}
                                    >
                                        <div className="fy-hero__floating-badge-icon" aria-hidden="true">
                                            <Award className="w-4 h-4 text-slate-950" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="fy-hero__floating-badge-title">Expérience Certifiée</span>
                                            <span className="fy-hero__floating-badge-text">
                                                {hero.experienceBadgeText}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* ADANOLA SLIDE PAGINATION BARS (Thin horizontal bars 30px wide, 2px tall) */}
                <div className="mt-12 flex items-center justify-center gap-2">
                    <span className="w-8 h-[2px] bg-black" aria-label="Slide 1 active" />
                    <span className="w-8 h-[2px] bg-[#cccccc]" aria-label="Slide 2" />
                </div>
            </div>
        </section>
    );
}
