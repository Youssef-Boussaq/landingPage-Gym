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
            "group relative bg-slate-900 rounded-3xl overflow-hidden cursor-pointer",
            "transform transition-transform duration-500 hover:-translate-y-2",
            className
        )}>
            {/* Background Image */}
            <div className="absolute inset-0">
                {hasImage ? (
                    <img
                        src={service.image}
                        alt={service.imageAlt || service.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                    />
                ) : (
                    /* Fallback gradient when no image */
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative h-full min-h-[320px] p-6 sm:p-8 flex flex-col justify-end">
                <div className="mb-4 bg-[var(--color-primary)] w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                    <Icon className="w-6 h-6 text-slate-900" aria-hidden="true" />
                </div>

                <h4 className="text-xl sm:text-2xl font-black text-white uppercase italic tracking-tight mb-2">
                    {service.title}
                </h4>

                {/* Description: always visible on mobile/touch, hover-reveal on desktop */}
                <p className="text-slate-300 text-sm leading-relaxed mb-6
                               opacity-100 translate-y-0
                               sm:opacity-0 sm:translate-y-4
                               sm:transition-all sm:duration-300
                               sm:group-hover:opacity-100 sm:group-hover:translate-y-0
                               group-focus-within:opacity-100 group-focus-within:translate-y-0">
                    {service.description}
                </p>

                <div className="flex items-center text-[var(--color-primary)] font-bold text-xs uppercase tracking-wider">
                    <span>{service.ctaLabel || 'Learn More'}</span>
                    <ArrowRight className="w-4 h-4 ml-2 transform transition-transform group-hover:translate-x-2" aria-hidden="true" />
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
        <section id="services" className="py-16 lg:py-28 bg-[#f9fbf6] relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div ref={titleRef} className="reveal-up flex flex-col lg:flex-row justify-between items-end gap-6 mb-12 lg:mb-20">
                    <div className="max-w-2xl">
                        <h2 className="text-sm font-bold text-[var(--color-primary-dark)] uppercase tracking-widest mb-2">
                            {eyebrow}
                        </h2>
                        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 uppercase italic tracking-tight">
                            {heading}
                        </h3>
                    </div>
                    <p className="text-slate-600 max-w-md lg:text-right text-sm sm:text-base">
                        {description}
                    </p>
                </div>

                <div ref={gridRef} className="reveal-group grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
