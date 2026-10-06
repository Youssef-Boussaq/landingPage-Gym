
import React from "react";
import { ArrowUpRight, Award, Dumbbell } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { usePage } from "@inertiajs/react";

const About = () => {
    const headerRef = useReveal();
    const coachImageRef = useReveal();
    const coachContentRef = useReveal();

    const certificateImageRef = useReveal();
    const certificateContentRef = useReveal();
    const { appearance } = usePage().props;


    console.log(appearance);

    return (
        <section
            id="about"
            className="relative overflow-hidden bg-[#fbfdf7] text-[#0b0c0e]"
        >
            <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-32">

                {/* =====================================================
                    HEADER
                ===================================================== */}
                <div
                    ref={headerRef}
                    className="reveal mb-16 max-w-3xl lg:mb-24"
                >
                    <div className="mb-5 flex items-center gap-3">
                        <span className="h-px w-10 bg-[#9de500]" />

                        <span className="font-inter text-xs font-semibold uppercase tracking-[0.25em] text-black/50">
                            About the coach
                        </span>
                    </div>

                    <h2 className="font-archivo text-5xl uppercase leading-[0.9] tracking-[-0.04em] sm:text-6xl lg:text-8xl">
                        Built through
                        <span className="block text-[#9de500]">
                            discipline.
                        </span>
                    </h2>

                    <p className="mt-7 max-w-xl font-inter text-base leading-7 text-black/60 sm:text-lg">
                        A coaching philosophy built around discipline,
                        experience and measurable results.
                    </p>
                </div>

                {/* =====================================================
                    COACH
                ===================================================== */}
                <article className="grid items-center gap-12 lg:grid-cols-2 lg:gap-24">

                    {/* IMAGE */} <div ref={coachImageRef} className="reveal reveal-left relative mx-auto w-full max-w-[300px] sm:max-w-[320px] lg:max-w-[350px]" > <div className="group relative aspect-[9/16]"> <img src="/images/3.png" alt="Fit Youness coach" loading="lazy" decoding="async" className=" h-full w-full object-contain object-center transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform group-hover:-translate-y-1 group-hover:scale-[1.015] " /> <span className=" absolute left-0 top-4 font-archivo text-4xl leading-none text-black/[0.06] transition-all duration-700 ease-out group-hover:-translate-x-1 group-hover:text-[#9de500]/30 " > 01 </span> <div className=" absolute bottom-5 right-0 flex h-12 w-12 items-center justify-center rounded-full bg-[#9de500] shadow-[0_8px_25px_rgba(157,229,0,0.18)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-6 group-hover:scale-105 " > <Dumbbell size={19} strokeWidth={2} /> </div> </div> </div>

                    {/* CONTENT */}
                    <div
                        ref={coachContentRef}
                        className="reveal reveal-right max-w-xl"
                    >
                        <div className="mb-6 flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#9de500]/15">
                                <Dumbbell size={18} />
                            </span>

                            <span className="font-inter text-xs font-bold uppercase tracking-[0.2em] text-black/45">
                                The Coach
                            </span>
                        </div>

                        <h3 className="font-archivo text-4xl uppercase leading-[0.95] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
                            Discipline.
                            <br />
                            Experience.
                            <br />
                            <span className="text-black/25">
                                Results.
                            </span>
                        </h3>

                        <p className="mt-7 max-w-lg font-inter text-base leading-8 text-black/60 sm:text-lg">
                            A passion for fitness built through discipline,
                            consistency, and the constant pursuit of becoming
                            stronger — both physically and mentally.
                        </p>

                        <div className="mt-9 flex items-center gap-4">
                            <span className="h-px w-14 bg-[#9de500]" />

                            <span className="font-inter text-xs font-semibold uppercase tracking-[0.18em] text-black/40">
                                Strength is built daily
                            </span>
                        </div>
                    </div>
                </article>

                {/* =====================================================
                    IFBB CERTIFICATE
                ===================================================== */}
                <article className="mt-28 grid items-center gap-12 lg:mt-40 lg:grid-cols-2 lg:gap-24">

                    {/* CONTENT */}
                    <div
                        ref={certificateContentRef}
                        className="reveal reveal-left order-2 max-w-xl lg:order-1"
                    >
                        <div className="mb-6 flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#9de500]/15">
                                <Award size={19} />
                            </span>

                            <span className="font-inter text-xs font-bold uppercase tracking-[0.2em] text-black/45">
                                Professional certification
                            </span>
                        </div>

                        <h3 className="font-archivo text-4xl uppercase leading-[0.95] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
                            IFBB
                            <br />
                            <span className="text-[#9de500]">
                                Certified.
                            </span>
                        </h3>

                        <p className="mt-7 max-w-lg font-inter text-base leading-8 text-black/60 sm:text-lg">
                            Knowledge behind the training. Professional
                            certification in fitness and nutrition, combining
                            proven training principles with a personalized
                            approach to help every client progress with
                            confidence.
                        </p>

                        <div className="mt-9 inline-flex items-center gap-3">
                            <span className="h-2 w-2 rounded-full bg-[#9de500]" />

                            <span className="font-inter text-xs font-bold uppercase tracking-[0.15em] text-black/45">
                                Knowledge • Training • Nutrition
                            </span>
                        </div>
                    </div>

                    {/* CERTIFICATE IMAGE */} <div ref={certificateImageRef} className="reveal reveal-right order-1 relative mx-auto w-full max-w-[300px] sm:max-w-[320px] lg:max-w-[350px] lg:order-2" > <div className="group relative aspect-[9/16]"> <img src="/images/4.png" alt="IFBB certified coach" loading="lazy" decoding="async" className=" h-full w-full object-contain object-center transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform group-hover:-translate-y-1 group-hover:scale-[1.015] " /> <span className=" absolute right-0 top-4 font-archivo text-4xl leading-none text-black/[0.06] transition-all duration-700 ease-out group-hover:translate-x-1 group-hover:text-[#9de500]/30 " > 02 </span> <div className=" absolute bottom-5 left-0 flex h-12 w-12 items-center justify-center rounded-full bg-[#9de500] shadow-[0_8px_25px_rgba(157,229,0,0.18)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-6 group-hover:scale-105 " > <Award size={20} strokeWidth={2} /> </div> </div> </div>
                </article>

                {/* =====================================================
                    BOTTOM STATEMENT
                ===================================================== */}
                <div className="mt-28 border-t border-black/10 pt-10 lg:mt-40 lg:pt-14">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

                        <p className="font-archivo text-2xl uppercase leading-tight tracking-[-0.02em] sm:text-3xl">
                            Train with purpose.
                            <br />
                            <span className="text-black/25">
                                Progress with confidence.
                            </span>
                        </p>

                        <a
                            href="#contact"
                            className="
                                group
                                inline-flex
                                w-fit
                                items-center
                                gap-3
                                rounded-full
                                bg-[#0b0c0e]
                                px-6
                                py-3.5
                                font-inter
                                text-sm
                                font-semibold
                                text-white
                                transition-all
                                duration-300
                                hover:bg-[#9de500]
                                hover:text-[#0b0c0e]
                            "
                        >
                            Start your journey

                            <span
                                className="
                                    flex
                                    h-7
                                    w-7
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-white/10
                                    transition-transform
                                    duration-300
                                    group-hover:rotate-45
                                    group-hover:bg-black/10
                                "
                            >
                                <ArrowUpRight size={16} />
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;

