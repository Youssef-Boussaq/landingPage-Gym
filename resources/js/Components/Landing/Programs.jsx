import { Check, ArrowRight } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';
import { generateWhatsAppLink, cn } from '@/lib/utils';

function ProgramCard({ program, whatsappPhone, popularLabel, className }) {
    const phone = whatsappPhone || '06 17 93 37 97';
    const ctaLink = generateWhatsAppLink(phone, program.whatsappMessage || '');

    return (
        <div className={cn(
            "relative bg-white rounded-none p-8 flex flex-col h-full",
            program.isPopular ? "border-2 border-[#000000]" : "border border-[#e5e7eb]",
            className
        )}>
            {program.isPopular && (
                <div className="absolute -top-3 left-6 bg-[#000000] text-white text-[10px] font-medium uppercase tracking-[0.05em] px-3 py-1 rounded-none">
                    {popularLabel || 'Best Value'}
                </div>
            )}

            <div className="mb-8 pt-2">
                <h4 className="text-[18px] font-bold text-[#000000] mb-2 font-favorit uppercase tracking-[0.025em]">{program.title}</h4>
                <p className="text-[#666666] text-[13px] mb-6 h-10 font-favorit leading-[1.33]">{program.description}</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-normal text-[#000000] tracking-[0.025em] font-favorit">
                        {program.price}
                    </span>
                    <span className="text-[#000000] font-medium text-sm font-favorit">{program.currency}</span>
                    {program.period && (
                        <span className="text-[#666666] text-xs font-favorit ml-1">{program.period}</span>
                    )}
                </div>
            </div>

            <ul className="space-y-3 mb-8 flex-1 border-t border-[#e5e7eb] pt-6">
                {(program.benefits || []).map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-[#000000] shrink-0 mt-0.5" strokeWidth={1.5} aria-hidden="true" />
                        <span className="text-[#333333] text-[13px] font-favorit tracking-[0.025em]">{benefit}</span>
                    </li>
                ))}
            </ul>

            <a
                href={ctaLink}
                target="_blank"
                rel="noreferrer"
                className={cn(
                    "w-full flex items-center justify-center gap-2 py-3 rounded-[4px] font-medium text-[12px] uppercase tracking-[0.025em] transition-colors duration-200",
                    program.isPopular
                        ? "bg-[#000000] text-white hover:bg-[#1d1d1d]"
                        : "border border-[#000000] text-[#000000] bg-transparent hover:bg-[#000000] hover:text-white"
                )}
            >
                {program.ctaLabel || 'Choose Plan'}
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
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
        <section id="programs" className="py-20 lg:py-28 bg-[#f0efe7] relative">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                <div ref={titleRef} className="reveal-up text-center max-w-2xl mx-auto mb-16 lg:mb-20">
                    <div className="mb-3 flex items-center justify-center gap-3">
                        <span className="h-px w-8 bg-[#000000]" />
                        <h2 className="text-[12px] font-medium text-[#333333] uppercase tracking-[0.025em] font-favorit">
                            {eyebrow}
                        </h2>
                        <span className="h-px w-8 bg-[#000000]" />
                    </div>
                    <h3 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#000000] uppercase tracking-[0.025em] font-favorit">
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
