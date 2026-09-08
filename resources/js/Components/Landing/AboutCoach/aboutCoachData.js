import {
    Target,
    Zap,
    Trophy,
    CheckCircle2,
    Sparkles,
    Flame,
} from 'lucide-react';

export const PHASES = {
    1: {
        label: 'COACHING & DIAGNOSTIC',
        navLabel: 'Diagnostic',
        coachBadge: 'Coach Certifié Élite',
        icon: Target,

        titleLine1: 'PRÊT À CHANGER',
        titleLine2: 'VOTRE VIE ?',

        description:
            'Un accompagnement personnalisé calibré sur votre morphologie, votre métabolisme et vos contraintes.',

        badgeItems: [
            {
                icon: CheckCircle2,
                text: 'Bilan physique 360°',
                accent: true,
            },
            {
                icon: Sparkles,
                text: 'Nutrition flexible',
                accent: true,
            },
        ],

        socialProof: {
            avatars: [
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop',
            ],
            value: '124K+',
            label: 'Community Followers',
        },

        cta: 'Démarrer mon bilan',
    },

    2: {
        label: 'DISCIPLINE & INTENSITÉ',
        navLabel: 'Intensité',

        coachBadge: 'FIT YOUNESS',
        coachBadgeSubtitle:
            'IFBB-Certified Personal Trainer & Nutritionist',

        icon: Zap,

        titleLine1: 'IFBB-Certified',
        titleLine2: '',

        description:
            'Une méthode de coaching fondée sur l’expertise IFBB : entraînements haute intensité, biomécanique de pointe et suivi personnalisé pour développer votre force, votre physique et vos performances sans compromettre votre santé.',

        badgeItems: [
            {
                icon: Flame,
                text: 'Surcharge progressive',
                accentClass: 'text-orange-600',
            },
            {
                icon: Zap,
                text: 'Suivi vidéo 48h',
                accent: true,
            },
        ],

        socialProof: null,

        cta: 'Voir les programmes',
    },

    3: {
        label: 'RÉSULTATS & TRANSFORMATION',
        navLabel: 'Résultats',
        coachBadge: 'Objectif Garanti',
        icon: Trophy,

        titleLine1: 'TRANSFORMEZ',
        titleLine2: 'VOTRE CORPS',

        description:
            'Rejoignez les clients métamorphosés. Un physique athlétique, une vitalité inépuisable et un mental d’acier.',

        badgeItems: [
            {
                icon: Trophy,
                text: '+750 réussites',
                accentClass: 'text-amber-500',
            },
            {
                icon: CheckCircle2,
                text: 'Garantie résultats',
                accent: true,
            },
        ],

        socialProof: null,

        cta: 'Rejoindre le coaching',
    },
};

export const PHASE_NAVIGATION_RATIOS = {
    1: 0.12,
    2: 0.52,
    3: 0.92,
};

export const BREAKPOINTS = {
    mobile: '(max-width: 767px)',
    desktop: '(min-width: 768px)',
};

export const ANIMATION_CONFIG = {
    mobile: {
        end: '+=250%',
        scrub: 0.8,

        // Coach reste clairement sur la gauche
        imageX: '-10vw',

        imageScaleFrom: 1,
        imageScaleTo: 0.96,
        imageDuration: 1.2,

        phaseStart: {
            text: 0.3,
            badge: 0.4,
        },

        phaseTwoStart: 1.6,
        phaseThreeStart: 3.4,

        textOffset: 20,
        badgeDuration: 0.8,
    },

    desktop: {
        end: '+=350%',
        scrub: 1.2,

        // Desktop inchangé
        imageX: '-34vw',
        imageScaleFrom: 1.02,
        imageScaleTo: 1,
        imageDuration: 1.4,

        phaseStart: {
            text: 0.4,
            badge: 0.5,
        },

        phaseTwoStart: 2.0,
        phaseThreeStart: 4.0,

        textOffset: 25,
        badgeDuration: 0.9,
    },
};
