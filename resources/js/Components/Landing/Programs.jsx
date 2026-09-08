import React from 'react';
import { Check, ArrowRight, Zap, Sparkles, Award, ShieldCheck } from 'lucide-react';

// Remplacez ce numéro par votre numéro WhatsApp (ex: 212612345678)
const WHATSAPP_NUMBER = '212600000000';

const programs = [
    {
        id: 1,
        number: '01',
        duration: '1 MOIS',
        subtitle: 'Flexibilité',
        price: '500 DH',
        description: 'Accompagnement flexible et sur-mesure.',
        featured: false,
        bgClass: 'card-bg-0',
        icon: Zap,
        features: [
            'Programme personnalisé',
            'Ajustements mensuels',
            'Accès app Fit Youness',
            'Support WhatsApp 5j/7',
        ],
    },
    {
        id: 2,
        number: '02',
        duration: '3 MOIS',
        subtitle: 'Engagement',
        price: '1000 DH',
        description: 'Ancrer de nouvelles habitudes et bâtir un physique athlétique.',
        featured: true,
        saving: 'POPULAIRE',
        bgClass: 'card-bg-1',
        icon: Sparkles,
        features: [
            'Plan 100% sur-mesure',
            'Plan nutritionnel & macros',
            'Bilan vidéo hebdomadaire',
            'Support WhatsApp 7j/7',
            'Guide supplémentation',
        ],
    },
    {
        id: 3,
        number: '03',
        duration: '1 AN',
        subtitle: 'Transformation',
        price: '3000 DH',
        description: 'Suivi longue durée pour transformer votre physique.',
        featured: false,
        saving: 'TOP VALEUR',
        bgClass: 'card-bg-2',
        icon: Award,
        features: [
            'Suivi VIP & reprogrammation',
            'Nutrition évolutive',
            'Analyse biomécanique',
            'Canal direct 24/7',
            'E-books illimités',
        ],
    },
];

export default function Programs() {
    const handleWhatsAppRedirect = (program) => {
        const message = `Bonjour Fit Youness! Je souhaite m'inscrire au programme ${program.duration} (${program.subtitle}) au tarif de ${program.price}. Merci de me contacter pour finaliser mon inscription.`;
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <section
            id="programs"
            className="fy-showcase fy-showcase-bg relative overflow-hidden py-12 sm:py-16"
        >
            {/* Ambient Background Lights */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-32 left-1/2 h-[350px] w-[500px] -translate-x-1/2 rounded-full bg-[var(--color-primary)] opacity-15 blur-[120px]"
            />

            <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
                {/* Header Section */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="fy-pill inline-flex items-center gap-2 rounded-full px-3 py-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary-dark)] animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-[0.25em]">
                                Nos Offres
                            </span>
                        </div>

                        <h2 className="fy-title text-2xl sm:text-4xl font-black uppercase tracking-tight mt-3">
                            Choisissez votre <span className="fy-accent">engagement</span>
                        </h2>
                    </div>

                    <p className="fy-description max-w-md text-xs sm:text-sm leading-relaxed text-slate-500">
                        Un accompagnement haute précision adapté à votre rythme et vos objectifs physiques.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid gap-6 md:grid-cols-3">
                    {programs.map((program) => {
                        const isFeatured = program.featured;
                        const IconComponent = program.icon;

                        return (
                            <article
                                key={program.id}
                                onClick={() => handleWhatsAppRedirect(program)}
                                className={`group relative flex flex-col justify-between cursor-pointer rounded-3xl p-6 transition-all duration-300 ${program.bgClass
                                    } glow-effect border border-black/10 hover:border-[var(--color-primary-dark)] hover:scale-[1.01]`}
                            >
                                {/* Recommended Badge */}
                                {isFeatured && (
                                    <div className="absolute right-0 top-0 flex items-center gap-1 rounded-bl-xl bg-[#0b0c0e] px-3 py-1.5 text-[8px] font-black uppercase tracking-widest text-[var(--color-primary)] shadow-sm">
                                        <Sparkles className="h-2.5 w-2.5" />
                                        Recommandé
                                    </div>
                                )}

                                <div>
                                    {/* Number + Subtitle Tag */}
                                    <div className="flex items-center justify-between">
                                        <span className="font-archivo text-4xl font-black leading-none text-black/10 group-hover:text-black/20 transition-colors">
                                            {program.number}
                                        </span>

                                        <span className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-white/60 backdrop-blur-md px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-wider text-[#547900]">
                                            <IconComponent className="h-2.5 w-2.5" />
                                            {program.subtitle}
                                        </span>
                                    </div>

                                    {/* Duration & Description */}
                                    <div className="mt-5">
                                        <h3 className="font-archivo text-2xl font-black uppercase text-[#11140f]">
                                            {program.duration}
                                        </h3>
                                        <p className="mt-1 text-xs text-[#566052] leading-snug">
                                            {program.description}
                                        </p>
                                    </div>

                                    {/* Price Display */}
                                    <div className="mt-5 flex items-end justify-between">
                                        <div>
                                            <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
                                                Tarif
                                            </p>
                                            <p className="font-archivo text-3xl font-black text-[#11140f] tracking-tight leading-none mt-0.5">
                                                {program.price}
                                            </p>
                                        </div>

                                        {program.saving && (
                                            <span className="rounded-full bg-[#0b0c0e] px-2.5 py-1 text-[8px] font-black uppercase tracking-wider text-[var(--color-primary)]">
                                                {program.saving}
                                            </span>
                                        )}
                                    </div>

                                    {/* Features List */}
                                    <div className="mt-5 space-y-2 border-t border-black/10 pt-4">
                                        {program.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-2.5">
                                                <div className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-black">
                                                    <Check className="h-2 w-2 stroke-[3]" />
                                                </div>
                                                <span className="text-[11px] font-medium text-[#2f352c]">
                                                    {feature}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Button - Redirects directly to WhatsApp */}
                                <div className="mt-6">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleWhatsAppRedirect(program);
                                        }}
                                        className="flex w-full items-center justify-between rounded-full bg-[#0b0c0e] px-5 py-3 text-[11px] font-black uppercase tracking-wider text-white transition-all duration-300 hover:bg-[var(--color-primary)] hover:text-black shadow-md"
                                    >
                                        <span>S'inscrire sur WhatsApp</span>
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>

                {/* Footer Note */}
                <div className="mt-8 flex items-center justify-between border-t border-black/10 pt-4 text-[10px] text-slate-500">
                    <span>Démarrage sous 24h après bilan initial.</span>
                    <div className="flex items-center gap-1.5 text-[#547900] font-black uppercase tracking-wider">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>FIT YOUNESS</span>
                    </div>
                </div>
            </div>
        </section>
    );
}