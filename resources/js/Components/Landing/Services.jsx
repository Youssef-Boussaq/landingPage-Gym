import { Dumbbell, Flame, Activity, ArrowRight, PersonStanding } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';
import { cn } from '@/lib/utils';

const SERVICES = [
    {
        id: "powerlifting",
        title: "Powerlifting",
        description: "Master the big three lifts with proper form, programming, and safety. Build raw strength.",
        image: "/images/4.png",
        icon: Dumbbell,
    },
    {
        id: "weight-loss",
        title: "Weight Loss",
        description: "Sustainable fat loss through customized nutrition plans and high-intensity training.",
        image: "/images/5.png",
        icon: Flame,
    },
    {
        id: "muscle-building",
        title: "Muscle Building",
        description: "Hypertrophy-focused training designed to maximize muscle growth and aesthetic proportions.",
        image: "/images/8.png",
        icon: Activity,
    },
    {
        id: "stretching",
        title: "Stretching & Mobility",
        description: "Improve flexibility, prevent injuries, and enhance overall functional movement.",
        image: "/images/7.png",
        icon: PersonStanding,
    }
];

function ServiceCard({ service, className }) {
    const Icon = service.icon;

    return (
        <div className={cn(
            "group relative bg-slate-900 rounded-3xl overflow-hidden cursor-pointer",
            "transform transition-transform duration-500 hover:-translate-y-2",
            className
        )}>
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative h-full min-h-[320px] p-6 sm:p-8 flex flex-col justify-end">
                <div className="mb-4 bg-[var(--color-primary)] w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                    <Icon className="w-6 h-6 text-slate-900" />
                </div>

                <h4 className="text-xl sm:text-2xl font-black text-white uppercase italic tracking-tight mb-2">
                    {service.title}
                </h4>

                <p className="text-slate-300 text-sm leading-relaxed mb-6 opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    {service.description}
                </p>

                <div className="flex items-center text-[var(--color-primary)] font-bold text-xs uppercase tracking-wider">
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4 ml-2 transform transition-transform group-hover:translate-x-2" />
                </div>
            </div>
        </div>
    );
}

export default function Services() {
    const titleRef = useReveal();
    const gridRef = useReveal();

    return (
        <section id="services" className="py-16 lg:py-28 bg-[#f9fbf6] relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div ref={titleRef} className="reveal-up flex flex-col lg:flex-row justify-between items-end gap-6 mb-12 lg:mb-20">
                    <div className="max-w-2xl">
                        <h2 className="text-sm font-bold text-[var(--color-primary-dark)] uppercase tracking-widest mb-2">
                            Premium Coaching
                        </h2>
                        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 uppercase italic tracking-tight">
                            Specialized Services
                        </h3>
                    </div>
                    <p className="text-slate-600 max-w-md lg:text-right text-sm sm:text-base">
                        Tailored fitness programs designed to push your limits, transform your physique, and elevate your performance.
                    </p>
                </div>

                <div ref={gridRef} className="reveal-group grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {SERVICES.map((service, idx) => (
                        <div key={service.id} className={`reveal-up reveal-item delay-${(idx + 1) * 100}`}>
                            <ServiceCard service={service} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
