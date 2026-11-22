import { useReveal } from '@/hooks/useReveal';
import { cn } from '@/lib/utils';
import {
    ArrowRight, Dumbbell, Flame, Activity, PersonStanding,
    Heart, Zap, Target, Trophy, Star, Timer, BarChart2,
    Users, Shield, TrendingUp,
} from 'lucide-react';

/**
 * Approved icon registry — maps stored string names to Lucide components.
 * Administrators choose from this set; arbitrary icon names are blocked.
 */
const ICON_REGISTRY = {
    Dumbbell, Flame, Activity, PersonStanding,
    Heart, Zap, Target, Trophy, Star, Timer,
    BarChart2, Users, Shield, TrendingUp,
};

function resolveIcon(name) {
    return ICON_REGISTRY[name] ?? Dumbbell;
}

function ServiceCard({ service, className }) {
    const Icon = resolveIcon(service.icon);
    const hasImage = Boolean(service.image);

    return (
        <div className={cn(
            "group relative bg-white border border-[#e5e7eb] hover:border-[#000000] rounded-none overflow-hidden cursor-pointer",
            "transition-colors duration-300 flex flex-col h-full",
            className
        )}>
            {/* Image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f0efe7]">
                {hasImage ? (
                    <img
                        src={service.image}
                        alt={service.imageAlt || service.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-[#f0efe7] flex items-center justify-center">
                        <Icon className="w-8 h-8 text-[#cccccc]" strokeWidth={1.5} />
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1 justify-between bg-white">
                <div>
                    <div className="mb-4 w-9 h-9 rounded-[4px] border border-[#000000] flex items-center justify-center text-[#000000]">
                        <Icon className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
                    </div>

                    <h4 className="text-[16px] font-bold text-[#000000] uppercase tracking-[0.025em] mb-2 font-favorit">
                        {service.title}
                    </h4>

                    <p className="text-[#666666] text-[13px] leading-[1.4] tracking-[0.025em] mb-6 font-favorit">
                        {service.description}
                    </p>
                </div>

                <div className="flex items-center text-[#000000] font-medium text-[12px] uppercase tracking-[0.025em]">
                    <span>{service.ctaLabel || 'Learn More'}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-2 transform transition-transform group-hover:translate-x-1" strokeWidth={1.5} aria-hidden="true" />
                </div>
            </div>
        </div>
    );
}

/**
 * Services landing section.
 * Receives `services` (array from DB) and `sectionConfig` (eyebrow/heading/description).
 */
export default function Services({ services = [], sectionConfig = {} }) {
    const titleRef = useReveal();
    const gridRef  = useReveal();

    const eyebrow     = sectionConfig.eyebrow     ?? 'Premium Coaching';
    const heading     = sectionConfig.heading     ?? 'Specialized Services';
    const description = sectionConfig.description ?? 'Tailored fitness programs designed to push your limits, transform your physique, and elevate your performance.';

    // Fallback to hardcoded defaults if DB is empty (graceful degradation)
    const items = services.length > 0 ? services : [
        { id: 'powerlifting',    title: 'Powerlifting',          description: 'Master the big three lifts with proper form, programming, and safety. Build raw strength.',                                   image: '/images/8.png', imageAlt: 'Powerlifting', icon: 'Dumbbell',       ctaLabel: 'Learn More' },
        { id: 'weight-loss',     title: 'Weight Loss',           description: 'Sustainable fat loss through customized nutrition plans and high-intensity training.',                                          image: '/images/7.png', imageAlt: 'Weight Loss',  icon: 'Flame',          ctaLabel: 'Learn More' },
        { id: 'muscle-building', title: 'Muscle Building',       description: 'Hypertrophy-focused training designed to maximize muscle growth and aesthetic proportions.',                                     image: '/images/5.png', imageAlt: 'Muscle Building', icon: 'Activity',    ctaLabel: 'Learn More' },
        { id: 'stretching',      title: 'Stretching & Mobility', description: 'Improve flexibility, prevent injuries, and enhance overall functional movement.',                                                image: '/images/6.png', imageAlt: 'Stretching', icon: 'PersonStanding', ctaLabel: 'Learn More' },
    ];

    return (
        <section id="services" className="py-20 lg:py-28 bg-white relative">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                <div ref={titleRef} className="reveal-up flex flex-col lg:flex-row justify-between items-end gap-6 mb-16 lg:mb-20">
                    <div className="max-w-2xl">
                        <div className="mb-3 flex items-center gap-3">
                            <span className="h-px w-8 bg-[#000000]" />
                            <h2 className="text-[12px] font-medium text-[#333333] uppercase tracking-[0.025em] font-favorit">
                                {eyebrow}
                            </h2>
                        </div>
                        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#000000] uppercase tracking-[0.025em] font-favorit">
                            {heading}
                        </h3>
                    </div>
                    <p className="text-[#666666] max-w-md lg:text-right text-[14px] leading-[1.4] tracking-[0.025em] font-favorit">
                        {description}
                    </p>
                </div>

                <div ref={gridRef} className="reveal-group grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {items.map((service, idx) => (
                        <div key={service.id ?? service.slug ?? idx} className={`reveal-up reveal-item delay-${(idx + 1) * 100}`}>
                            <ServiceCard service={service} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
