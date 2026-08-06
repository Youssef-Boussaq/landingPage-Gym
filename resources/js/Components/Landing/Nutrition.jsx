import { Utensils, Flame, Scale, TrendingUp, ShoppingBag, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Nutrition() {
    const nutritionPoints = [
        {
            icon: Scale,
            title: "Calorie & Macro Precision",
            description: "Custom daily targets calculated specifically for your body composition, metabolism, and energy expenditure."
        },
        {
            icon: Utensils,
            title: "100% Customized Meal Plans",
            description: "Built around foods you actually enjoy. No bland diets or unnecessary food group exclusions."
        },
        {
            icon: ShoppingBag,
            title: "Grocery Lists & Prep Guides",
            description: "Streamlined weekly shopping lists and time-saving meal prep strategies built for busy schedules."
        },
        {
            icon: TrendingUp,
            title: "Weekly Bio-Feedback Adjustments",
            description: "Regular macro tweaks based on your actual scale weight, bio-feedback, energy levels, and gym performance."
        },
        {
            icon: Zap,
            title: "Supplementation Strategy",
            description: "Science-backed supplement recommendations tailored to fix deficiencies and accelerate recovery."
        }
    ];

    return (
        <section className="relative bg-white py-16 lg:py-24 text-slate-900 overflow-hidden border-b border-slate-100">
            {/* Background Ambient Light Glows */}
            <div className="absolute top-1/3 -left-32 w-96 h-96 bg-[#9de500]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-0 w-96 h-96 bg-lime-200/40 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    
                    {/* LEFT COLUMN: Text & Nutrition Points */}
                    <div className="lg:col-span-7 flex flex-col justify-center">
                        
                        {/* Section Tag Badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-[#9de500] w-fit mb-6 shadow-sm">
                            <Utensils className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">
                                Precision Nutrition Coaching
                            </span>
                        </div>

                        {/* Main Title */}
                        <h1 className="font-archivo text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-slate-900 leading-tight">
                            Fuel Your Body. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-lime-600 to-slate-900">
                                Lock In Your Results.
                            </span>
                        </h1>

                        {/* Overview Paragraph */}
                        <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                            Training is only half the battle. Our nutrition protocol is designed to eliminate guesswork, 
                            allowing you to burn stubborn fat and build clean muscle without giving up your favorite foods.
                        </p>

                        {/* Bullet Points with Icons */}
                        <div className="mt-8 space-y-4">
                            {nutritionPoints.map((point, index) => {
                                const IconComponent = point.icon;
                                return (
                                    <div 
                                        key={index} 
                                        className="group p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 transition-all duration-300 hover:border-[#9de500] hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 flex items-start gap-4"
                                    >
                                        <div className="p-3 rounded-xl bg-[#9de500] text-slate-950 shrink-0 group-hover:scale-110 transition-all duration-300 shadow-sm">
                                            <IconComponent className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-base transition-colors">
                                                {point.title}
                                            </h3>
                                            <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
                                                {point.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* CTA Button */}
                        <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                            <a
                                href="#meal-plan"
                                className="inline-flex items-center justify-center gap-3 rounded-full bg-[#9de500] px-8 py-4 text-sm font-bold uppercase tracking-wider text-slate-950 transition-all duration-300 hover:bg-[#8cd000] hover:scale-105 hover:shadow-lg hover:shadow-[#9de500]/30 shadow-md"
                            >
                                <span>Get Your Custom Meal Plan</span>
                                <ArrowRight className="w-4 h-4" />
                            </a>

                            <div className="flex items-center justify-center gap-2 text-slate-600 text-xs uppercase font-semibold tracking-wider">
                                <CheckCircle2 className="w-4 h-4 text-lime-600" />
                                <span>100% Guaranteed Satisfaction</span>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Nutrition Image with White Glass Accent Overlays */}
                    <div className="lg:col-span-5 relative flex justify-center">
                        
                        {/* Outer Ambient Glow */}
                        <div className="absolute -inset-2 bg-gradient-to-r from-[#9de500]/30 to-slate-200/60 rounded-3xl blur-xl opacity-80" />

                        {/* Main Image Container */}
                        <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-2xl w-full max-w-md lg:max-w-none">
                            <img
                                src="/images/nutrition.jpg"
                                alt="Nutrition and meal preparation"
                                className="w-full h-[520px] lg:h-[620px] object-cover object-center"
                            />

                            {/* Floating White Glassmorphism Badge 1 */}
                            <div className="absolute top-6 left-6 p-4 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-xl flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
                                    <Flame className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Macro Optimized</div>
                                    <div className="text-sm font-extrabold text-slate-900">High Protein & Whole Foods</div>
                                </div>
                            </div>

                            {/* Floating White Glassmorphism Badge 2 */}
                            <div className="absolute bottom-6 right-6 p-4 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-xl flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-[#9de500]/20 text-slate-950 border border-[#9de500]/40">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Metabolism</div>
                                    <div className="text-sm font-extrabold text-slate-900">Continuous Fat Loss</div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}