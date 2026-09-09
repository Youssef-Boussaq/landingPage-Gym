import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';
import { generateWhatsAppLink } from '@/lib/utils';

export default function AboutCoach() {
    const revealRef = useReveal();
    const whatsappLink = generateWhatsAppLink('06 17 93 37 97', 'Hello, I am interested in starting my fitness transformation.');

    return (
        <section id="about" className="py-16 lg:py-28 bg-[#f9fbf6] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    ref={revealRef}
                    className="reveal-up grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
                >

                    {/* Images Column */}
                    <div className="relative order-2 lg:order-1 flex justify-center lg:justify-start">
                        <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl group">
                            <img
                                src="/images/1.png"
                                alt="Fitness Coach"
                                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                        </div>

                        {/* Certification Card Overlay */}
                        <div className="absolute -bottom-8 -right-4 lg:-right-8 w-48 sm:w-56 bg-white p-3 rounded-2xl shadow-xl border border-slate-100 flex flex-col gap-2 transform transition-transform duration-500 hover:-translate-y-2">
                            <img
                                src="/images/2.png"
                                alt="Coach Certifications"
                                className="w-full h-auto rounded-xl object-cover"
                            />
                            <div className="text-center pb-1">
                                <p className="text-[10px] sm:text-xs font-bold text-slate-900 uppercase tracking-wider">Certified Expert</p>
                                <p className="text-[9px] sm:text-[10px] text-slate-500">FBBA • Nutrition • Coaching</p>
                            </div>
                        </div>
                    </div>

                    {/* Text Column */}
                    <div className="order-1 lg:order-2 flex flex-col items-start space-y-6 lg:space-y-8">
                        <div>
                            <h2 className="text-sm font-bold text-[var(--color-primary-dark)] uppercase tracking-widest mb-2">
                                Meet Your Coach
                            </h2>
                            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 uppercase italic tracking-tight leading-tight">
                                Transform Your Body, <br />
                                <span className="text-[var(--color-primary-dark)]">Elevate Your Life.</span>
                            </h3>
                        </div>

                        <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                            <p>
                                I am driven by a deep passion for fitness, discipline, and a healthy lifestyle. For me, coaching isn't just about workouts; it's about building a sustainable and confident version of you.
                            </p>
                            <p>
                                With extensive experience and formal certifications in FBBA Nutrition and Training, I provide personalized coaching tailored to your unique goals. Whether you want to build muscle, lose weight, or simply live healthier, I'm here to guide you every step of the way.
                            </p>
                        </div>

                        <ul className="space-y-3">
                            {[
                                "Personalized Nutrition & Training",
                                "Sustainable, Long-term Results",
                                "Continuous Support & Motivation"
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-slate-800 font-semibold text-sm sm:text-base">
                                    <CheckCircle2 className="w-5 h-5 text-[var(--color-primary-dark)]" />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <div className="pt-4">
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 active:scale-95"
                            >
                                Start Your Transformation
                                <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
