import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AboutCoachGSAP() {
    const containerRef = useRef(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            let mm = gsap.matchMedia();

            // MOBILE CONFIGURATION (< 768px)
            mm.add("(max-width: 767px)", () => {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top top",
                        end: "+=250%",
                        pin: true,
                        pinSpacing: true,
                        scrub: 0.8,
                        invalidateOnRefresh: true,
                    }
                });

                // Image starts centered (x: 0) and moves further left (-22vw)
                tl.fromTo(".img-container", { x: "0vw" }, { x: "-22vw", ease: "power2.inOut", duration: 1.2 }, 0)
                    .to(".text-phase-1", { opacity: 1, y: 0, ease: "power2.out", duration: 1 }, 0.3)

                    // Phase 1 -> Phase 2
                    .to(".text-phase-1", { opacity: 0, y: -20, ease: "power1.in", duration: 1 }, 1.6)
                    .to(".img-3", { opacity: 0, scale: 0.95, ease: "power2.inOut", duration: 1.2 }, 1.6)
                    .fromTo(".img-4", { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, ease: "power2.inOut", duration: 1.2 }, 1.6)
                    .fromTo(".text-phase-2", { opacity: 0, y: 20 }, { opacity: 1, y: 0, ease: "power2.out", duration: 1 }, 1.8)

                    // Phase 2 -> Phase 3
                    .to(".text-phase-2", { opacity: 0, y: -20, ease: "power1.in", duration: 1 }, 3.4)
                    .to(".img-4", { opacity: 0, scale: 0.95, ease: "power2.inOut", duration: 1.2 }, 3.4)
                    .to(".img-3", { opacity: 1, scale: 1, ease: "power2.inOut", duration: 1.2 }, 3.4)
                    .fromTo(".text-phase-3", { opacity: 0, y: 20 }, { opacity: 1, y: 0, ease: "power2.out", duration: 1 }, 3.6);
            });

            // DESKTOP CONFIGURATION (>= 768px)
            mm.add("(min-width: 768px)", () => {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top top",
                        end: "+=350%",
                        pin: true,
                        pinSpacing: true,
                        scrub: 1.2,
                        invalidateOnRefresh: true,
                    }
                });

                // Image starts centered (x: 0) and moves significantly further left (-35vw)
                tl.fromTo(".img-container", { x: "0vw" }, { x: "-35vw", ease: "power2.inOut", duration: 1.4 }, 0)
                    .to(".text-phase-1", { opacity: 1, y: 0, ease: "power2.out", duration: 1 }, 0.4)

                    // Phase 1 -> Phase 2
                    .to(".text-phase-1", { opacity: 0, y: -25, ease: "power1.in", duration: 1 }, 2.0)
                    .to(".img-3", { opacity: 0, scale: 0.96, ease: "power2.inOut", duration: 1.2 }, 2.0)
                    .fromTo(".img-4", { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, ease: "power2.inOut", duration: 1.2 }, 2.0)
                    .fromTo(".text-phase-2", { opacity: 0, y: 25 }, { opacity: 1, y: 0, ease: "power2.out", duration: 1 }, 2.2)

                    // Phase 2 -> Phase 3
                    .to(".text-phase-2", { opacity: 0, y: -25, ease: "power1.in", duration: 1 }, 4.0)
                    .to(".img-4", { opacity: 0, scale: 0.96, ease: "power2.inOut", duration: 1.2 }, 4.0)
                    .to(".img-3", { opacity: 1, scale: 1, ease: "power2.inOut", duration: 1.2 }, 4.0)
                    .fromTo(".text-phase-3", { opacity: 0, y: 25 }, { opacity: 1, y: 0, ease: "power2.out", duration: 1 }, 4.2);
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} id="about" className="relative w-full h-[65dvh] sm:h-[100dvh] bg-white text-zinc-900 overflow-hidden">
            {/* Top Gradient Blend */}
            <div className="absolute top-0 left-0 right-0 h-12 sm:h-32 bg-gradient-to-b from-white via-white/80 to-transparent z-40 pointer-events-none" />

            {/* Ambient Background Glows */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[200px] sm:w-[450px] lg:w-[650px] h-[200px] sm:h-[450px] lg:h-[650px] bg-[#8cd000]/[0.07] rounded-full blur-[60px] sm:blur-[130px] lg:blur-[160px]" />
                <div className="absolute bottom-1/3 right-1/4 translate-x-1/4 translate-y-1/2 w-[160px] sm:w-[380px] lg:w-[550px] h-[160px] sm:h-[380px] lg:h-[550px] bg-[#8cd000]/[0.05] rounded-full blur-[60px] sm:blur-[130px] lg:blur-[150px]" />
            </div>

            <div className="relative w-full max-w-[1700px] h-full mx-auto px-3 sm:px-8 flex flex-row items-center justify-center z-10">

                {/* Dead-Centered 9:16 Image Container with expanded viewport translation */}
                <div className="img-container absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-20 pointer-events-none will-change-transform">
                    <div className="relative w-[55vw] sm:w-[650px] lg:w-[950px] xl:w-[1150px] aspect-[9/16] h-[55vh] sm:h-[82vh] flex items-center justify-center">
                        <img
                            src="/images/3.png"
                            alt="Coach 3"
                            draggable="false"
                            className="img-3 absolute inset-0 w-full h-full object-contain drop-shadow-[0_10px_15px_rgba(15,23,42,0.1)] select-none will-change-[transform,opacity]"
                        />
                        <img
                            src="/images/4.png"
                            alt="Coach 4"
                            draggable="false"
                            className="img-4 absolute inset-0 w-full h-full object-contain drop-shadow-[0_10px_15px_rgba(15,23,42,0.1)] select-none opacity-0 will-change-[transform,opacity]"
                        />
                    </div>
                </div>

                {/* Text Container */}
                <div className="relative sm:absolute right-4 sm:right-12 lg:right-24 sm:top-1/2 sm:-translate-y-1/2 w-[45%] sm:w-full max-w-[280px] sm:max-w-lg h-44 sm:h-64 z-30 pointer-events-none flex flex-col justify-center ml-auto">

                    {/* Phase 1 */}
                    <div className="text-phase-1 absolute inset-0 flex flex-col justify-center gap-1 sm:gap-2 opacity-0 translate-y-2 will-change-[transform,opacity]">
                        <span className="w-fit px-2 py-0.5 rounded-full bg-[#8cd000]/15 border border-[#8cd000]/40 text-[#598400] font-bold uppercase text-[10px] sm:text-xs">
                            Phase 01 — Coaching
                        </span>
                        <h2 className="text-xl sm:text-4xl lg:text-5xl font-black uppercase italic leading-tight text-zinc-950">
                            PRÊT À CHANGER <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8cd000] to-[#598400]">
                                VOTRE VIE ?
                            </span>
                        </h2>
                        <p className="text-zinc-600 text-xs sm:text-base font-medium leading-tight">
                            Un accompagnement personnalisé.
                        </p>
                    </div>

                    {/* Phase 2 */}
                    <div className="text-phase-2 absolute inset-0 flex flex-col justify-center gap-1 sm:gap-2 opacity-0 will-change-[transform,opacity]">
                        <span className="w-fit px-2 py-0.5 rounded-full bg-[#8cd000]/15 border border-[#8cd000]/40 text-[#598400] font-bold uppercase text-[10px] sm:text-xs">
                            Phase 02 — Discipline
                        </span>
                        <h2 className="text-xl sm:text-4xl lg:text-5xl font-black uppercase italic leading-tight text-zinc-950">
                            DÉPASSEZ VOS <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8cd000] to-[#4e7500]">
                                LIMITES
                            </span>
                        </h2>
                        <p className="text-zinc-600 text-xs sm:text-base font-medium leading-tight">
                            Entraînements haute intensité.
                        </p>
                    </div>

                    {/* Phase 3 */}
                    <div className="text-phase-3 absolute inset-0 flex flex-col justify-center gap-1 sm:gap-2 opacity-0 will-change-[transform,opacity]">
                        <span className="w-fit px-2 py-0.5 rounded-full bg-[#8cd000]/15 border border-[#8cd000]/40 text-[#598400] font-bold uppercase text-[10px] sm:text-xs">
                            Phase 03 — Résultats
                        </span>
                        <h2 className="text-xl sm:text-4xl lg:text-5xl font-black uppercase italic leading-tight text-zinc-950">
                            TRANSFORMEZ <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8cd000] to-[#598400]">
                                VOTRE CORPS
                            </span>
                        </h2>
                        <p className="text-zinc-600 text-xs sm:text-base font-medium leading-tight">
                            Rejoignez les clients métamorphosés.
                        </p>
                    </div>

                </div>

            </div>
        </section>
    );
}