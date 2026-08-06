import { ArrowRight, Dumbbell, Flame, Zap, Activity } from 'lucide-react';

const categories = [
    {
        id: 1,
        title: "Muscle Building",
        image: "/images/Catigories/catBuilding.jpg",
        description: "Build solid muscle mass with hyper-targeted progressive overload training and customized hypertrophy plans.",
        tag: "Hypertrophy",
        icon: Dumbbell
    },
    {
        id: 2,
        title: "Powerlifting",
        image: "/images/Catigories/PowerLifting.jpg",
        description: "Master the Big Three—Squat, Bench, and Deadlift—with specialized strength block periodization.",
        tag: "Max Strength",
        icon: Zap
    },
    {
        id: 3,
        title: "Stretching & Mobility",
        image: "/images/Catigories/Stretching.jpg",
        description: "Eliminate joint pain, improve movement patterns, and boost recovery with structured mobility flows.",
        tag: "Flexibility",
        icon: Activity
    },
    {
        id: 4,
        title: "Weight Loss",
        image: "/images/Catigories/WeightLosse.jpg",
        description: "Shred body fat while maintaining hard-earned muscle using optimal caloric cycling and conditioning.",
        tag: "Fat Burn",
        icon: Flame
    }
];

export default function PainPoints() {
    return (
        <section className="py-16 px-4 max-w-7xl mx-auto">
            {/* Section Heading */}
            <div className="text-center mb-12">
                <span className="text-[#9de500] font-semibold text-xs tracking-widest uppercase bg-[#9de500]/10 px-3 py-1 rounded-full border border-[#9de500]/30">
                    Training Programs
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 uppercase tracking-tight">
                    Choose Your Transformation
                </h2>
                <p className="text-slate-600 mt-2 max-w-xl mx-auto text-sm sm:text-base">
                    Hover over any discipline to discover how our tailored coaching system works for your goals.
                </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((cat) => {
                    const IconComponent = cat.icon;
                    return (
                        <div
                            key={cat.id}
                            className="group relative h-[420px] rounded-3xl overflow-hidden shadow-lg border border-slate-800/20 bg-slate-900 cursor-pointer"
                        >
                            {/* 1. Background Image with Zoom Effect */}
                            <img
                                src={cat.image}
                                alt={cat.title}
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                            />

                            {/* 2. Default Visible Label (Fades out when overlay slides in) */}
                            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent transition-opacity duration-300 group-hover:opacity-0">
                                <span className="inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#9de500] bg-[#9de500]/20 rounded-md border border-[#9de500]/40 mb-2">
                                    {cat.tag}
                                </span>
                                <h3 className="text-2xl font-bold text-white leading-tight">
                                    {cat.title}
                                </h3>
                            </div>

                            {/* 3. Left-to-Right Sliding Glassy Overlay */}
                            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md p-6 flex flex-col justify-between -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out border-r border-[#9de500]/30">
                                {/* Top Content */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-2.5 rounded-xl bg-[#9de500] text-black">
                                            <IconComponent className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs font-bold text-[#9de500] uppercase tracking-wider">
                                            {cat.tag}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-3 leading-snug">
                                        {cat.title}
                                    </h3>

                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        {cat.description}
                                    </p>
                                </div>

                                {/* Bottom CTA inside Overlay */}
                                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[#9de500] font-semibold text-sm">
                                    <span>Explore Program</span>
                                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}