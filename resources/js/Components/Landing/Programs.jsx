import { Check, ArrowRight } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';
import { generateWhatsAppLink, cn } from '@/lib/utils';

function ProgramCard({ program, whatsappPhone, popularLabel, className }) {
    const phone = whatsappPhone || '06 17 93 37 97';
    const ctaLink = generateWhatsAppLink(phone, program.whatsappMessage || '');

    return (
        <div className={cn(
            "relative bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 flex flex-col h-full",
            "transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]",
            program.isPopular ? "shadow-[0_10px_30px_rgb(0,0,0,0.06)] border-[var(--color-primary-dark)]" : "shadow-sm",
            className
        )}>
            {program.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--color-primary)] text-slate-900 text-[10px] sm:text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                    {popularLabel || 'Best Value'}
                </div>
            )}

            <div className="mb-8 text-center pt-4">
                <h4 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">{program.title}</h4>
                <p className="text-slate-500 text-sm mb-6 h-10">{program.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl sm:text-5xl font-black text-slate-900 italic tracking-tighter">
                        {program.price}
                    </span>
                    <span className="text-slate-900 font-bold">{program.currency}</span>
                </div>
                {program.period && (
                    <span className="text-slate-500 text-sm">{program.period}</span>
                )}
            </div>

            <ul className="space-y-4 mb-8 flex-1">
                {(program.benefits || []).map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-[var(--color-primary-dark)] shrink-0" aria-hidden="true" />
                        <span className="text-slate-600 text-sm">{benefit}</span>
                    </li>
                ))}
            </ul>

            <a
                href={ctaLink}
                target="_blank"
                rel="noreferrer"
                className={cn(
                    "w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-200 active:scale-95",
                    program.isPopular
                        ? "bg-slate-900 text-white hover:bg-slate-800 shadow-lg"
                        : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                )}
            >
                {program.ctaLabel || 'Choose Plan'}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
        </div>
    );
}

/**
 * Programs landing section.
 * Receives `programs` (array from DB) and `sectionConfig` (eyebrow/heading/whatsapp_phone).
 */
export default function Programs({ programs = [], sectionConfig = {} }) {
    const titleRef = useReveal();
    const gridRef  = useReveal();

    const eyebrow      = sectionConfig.eyebrow       ?? 'Start Today';
    const heading      = sectionConfig.heading       ?? 'Coaching Programs';
    const whatsappPhone = sectionConfig.whatsapp_phone ?? '06 17 93 37 97';
    const popularLabel  = sectionConfig.popular_label  ?? 'Best Value';

    // Graceful fallback to hardcoded defaults if DB is empty
    const items = programs.length > 0 ? programs : [
        {
            id: '1-month', title: '1 Month Coaching', price: '600', currency: 'MAD', period: '/ month',
            description: 'Perfect for getting started and learning the fundamentals.',
            benefits: ['Customized Workout Plan', 'Basic Nutritional Guidance', 'Weekly Progress Check-ins', 'WhatsApp Support'],
            isPopular: false, ctaLabel: 'Choose Plan',
            whatsappMessage: 'Hello, I would like to start the 1 Month Coaching program.',
        },
        {
            id: '3-months', title: '3 Months Coaching', price: '2,000', currency: 'MAD', period: '/ 3 months',
            description: 'The ideal timeframe to see significant physical changes.',
            benefits: ['Advanced Workout Programming', 'Complete Macro & Meal Plan', 'Bi-weekly Form Checks', 'Priority WhatsApp Support', 'Supplementation Guide'],
            isPopular: true, ctaLabel: 'Choose Plan',
            whatsappMessage: 'Hello, I would like to start the 3 Months Coaching program.',
        },
        {
            id: '1-year', title: '1 Year Coaching', price: '5,000', currency: 'MAD', period: '/ year',
            description: 'A total lifestyle transformation for committed athletes.',
            benefits: ['Year-round Periodized Training', 'Dynamic Nutrition Adjustments', 'Unlimited Form Analysis', '24/7 VIP Support', 'Contest/Photoshoot Prep', 'Exclusive Member Resources'],
            isPopular: false, ctaLabel: 'Choose Plan',
            whatsappMessage: 'Hello, I would like to start the 1 Year Coaching program.',
        },
    ];

    return (
        <section id="programs" className="py-16 lg:py-28 bg-[#f9fbf6] relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div ref={titleRef} className="reveal-up text-center max-w-2xl mx-auto mb-16 lg:mb-24">
                    <h2 className="text-sm font-bold text-[var(--color-primary-dark)] uppercase tracking-widest mb-2">
                        {eyebrow}
                    </h2>
                    <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 uppercase italic tracking-tight">
                        {heading}
                    </h3>
                </div>

                <div ref={gridRef} className="reveal-group grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {items.map((program, idx) => (
                        <div key={program.id ?? program.slug ?? idx} className={`reveal-up reveal-item delay-${(idx + 1) * 100}`}>
                            <ProgramCard
                                program={program}
                                whatsappPhone={whatsappPhone}
                                popularLabel={popularLabel}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
