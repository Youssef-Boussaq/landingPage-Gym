import { ArrowRight, Flame } from 'lucide-react';
import { useEffect, useState } from 'react';

/* =========================================================
   DEVICE DETECTION
   ---------------------------------------------------------
   - useIsDesktop: drives conditional mounting of the 
     desktop-only decoration (background image, diagonal cut, 
     lime slashes).
========================================================= */

function useIsDesktop() {
    // Matches the Tailwind `lg` breakpoint used elsewhere in this file.
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia('(min-width: 1024px)');
        const update = () => setIsDesktop(mql.matches);

        update();
        mql.addEventListener('change', update);

        return () => mql.removeEventListener('change', update);
    }, []);

    return isDesktop;
}

/* =========================================================
   COMPONENT (NO ANIMATION - PURE STATIC LAYOUT)
========================================================= */

export default function Hero() {
    const isDesktop = useIsDesktop();

    return (
        <section
            id="hero"
            className="
                relative
                w-full
                min-h-[450px]
                lg:min-h-screen
                flex
                items-center
                bg-white
                lg:bg-[var(--color-slate-950)]
                text-[var(--color-slate-900)]
                p-0
                m-0
                pt-4
                lg:pt-20
                overflow-hidden
                select-none
            "
        >
            {/* =====================================================
                BACKGROUND IMAGE — DESKTOP ONLY (STATIC)
            ===================================================== */}

            {isDesktop && (
                <div
                    className="
                        absolute
                        inset-0
                        pointer-events-none
                    "
                >
                    <img
                        src="/images/1.jpg"
                        alt=""
                        aria-hidden="true"
                        fetchPriority="low"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="
                            absolute
                            inset-0
                            w-full
                            h-full
                            object-cover
                            object-center
                            opacity-15
                            pointer-events-none
                        "
                    />
                </div>
            )}

            {/* =====================================================
                WHITE DIAGONAL CUT — DESKTOP ONLY (STATIC)
            ===================================================== */}

            {isDesktop && (
                <div
                    className="
                        absolute
                        inset-0
                        bg-white
                        z-10
                        pointer-events-none
                        shadow-2xl
                    "
                    style={{
                        clipPath:
                            'polygon(0 0, 52% 0, 36% 100%, 0 100%)',
                    }}
                />
            )}

            {/* =====================================================
                CONTENT (STATIC)
            ===================================================== */}

            <div
                className="
                    relative
                    z-40
                    w-full
                    max-w-7xl
                    mx-auto
                    flex
                    items-center
                    justify-start
                    px-4
                    sm:px-8
                    lg:px-12
                    pointer-events-none
                    py-6
                    lg:py-0
                "
            >
                <div
                    className="
                        w-7/12
                        sm:w-1/2
                        lg:w-full
                        lg:max-w-xl
                        text-[var(--color-slate-900)]
                        pointer-events-auto
                        flex
                        flex-col
                        items-start
                    "
                >
                    {/* =================================================
                        BADGE
                    ================================================= */}

                    <div
                        className="
                            mb-2
                            sm:mb-4
                            inline-flex
                            items-center
                            gap-1.5
                            px-3
                            py-1
                            rounded-full
                            bg-[var(--color-slate-900)]
                            text-[var(--color-primary)]
                            text-[10px]
                            sm:text-xs
                            md:text-sm
                            font-black
                            tracking-widest
                            uppercase
                            shadow-xl
                        "
                    >
                        <Flame
                            aria-hidden="true"
                            className="
                                w-3.5
                                h-3.5
                                fill-[var(--color-primary)]
                            "
                        />

                        <span>FIT YOUNESS</span>
                    </div>

                    {/* =================================================
                        TITLE
                    ================================================= */}

                    <h1
                        className="
                            text-2xl
                            sm:text-4xl
                            md:text-5xl
                            lg:text-7xl
                            font-black
                            uppercase
                            tracking-tighter
                            italic
                            leading-[0.95]
                            mb-2
                            sm:mb-4
                        "
                    >
                        TRANSFORME.
                        <br />

                        <span
                            className="
                                text-transparent
                                bg-clip-text
                                bg-gradient-to-r
                                from-[var(--color-primary-dark)]
                                to-emerald-600
                            "
                        >
                            DÉPASSE-TOI.
                        </span>

                        <br />

                        RÉUSSIS.
                    </h1>

                    {/* =================================================
                        KEYWORDS
                    ================================================= */}

                    <p
                        className="
                            text-[var(--color-slate-700)]
                            font-extrabold
                            text-[10px]
                            sm:text-xs
                            md:text-base
                            uppercase
                            tracking-wider
                            mb-4
                            sm:mb-8
                        "
                    >
                        Coaching Sur-Mesure • Nutrition • Suivi 24/7
                    </p>

                    {/* =================================================
                        CTA
                    ================================================= */}

                    <div className="w-full sm:w-auto">
                        <a
                            href="#contact"
                            className="
                                relative
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                sm:gap-3
                                px-5
                                py-3
                                sm:px-9
                                sm:py-4.5
                                bg-[var(--color-primary)]
                                text-[var(--color-slate-950)]
                                font-black
                                text-xs
                                sm:text-base
                                md:text-lg
                                uppercase
                                tracking-wider
                                rounded-xl
                                sm:rounded-2xl
                                shadow-[var(--shadow-glow)]
                                cursor-pointer
                                overflow-hidden
                            "
                        >
                            <span className="relative z-10">
                                DÉMARRER
                            </span>

                            <ArrowRight
                                aria-hidden="true"
                                className="
                                    relative
                                    z-10
                                    w-4
                                    h-4
                                    sm:w-5
                                    sm:h-5
                                "
                            />
                        </a>
                    </div>
                </div>
            </div>

            {/* =====================================================
                COACH IMAGE (STATIC)
            ===================================================== */}

            <div
                className="
                    absolute
                    inset-0
                    right-0
                    z-30
                    flex
                    items-center
                    justify-end
                    lg:justify-center
                    pointer-events-none
                "
            >
                <div
                    className="
                        relative
                        w-[75vw]
                        sm:w-[60vw]
                        md:w-[48vw]
                        max-w-[550px]
                        aspect-square
                        drop-shadow-2xl
                    "
                >
                    <img
                        src="/images/2.png"
                        alt="Coach Fit Youness"
                        width="550"
                        height="550"
                        fetchPriority="high"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="
                            w-full
                            h-full
                            object-contain
                            object-bottom
                            select-none
                        "
                    />
                </div>
            </div>

            {/* =====================================================
                LIME SLASHES — DESKTOP ONLY (STATIC)
            ===================================================== */}

            {isDesktop && (
                <div
                    className="
                        absolute
                        inset-0
                        pointer-events-none
                        z-20
                    "
                >
                    {/* Slash 1 */}
                    <div
                        className="
                            absolute
                            inset-0
                            bg-[var(--color-primary)]
                        "
                        style={{
                            clipPath:
                                'polygon(46.5% 0, 47.5% 0, 41% 40%, 40% 40%)',
                            WebkitMaskImage:
                                'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0) 40%)',
                            maskImage:
                                'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0) 40%)',
                        }}
                    />

                    {/* Slash 2 */}
                    <div
                        className="
                            absolute
                            inset-0
                            bg-[var(--color-primary)]
                        "
                        style={{
                            clipPath:
                                'polygon(38.5% 55%, 39.5% 55%, 32.5% 100%, 31.5% 100%)',
                            WebkitMaskImage:
                                'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 55%, rgba(0,0,0,0.1) 85%, rgba(0,0,0,0) 100%)',
                            maskImage:
                                'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 55%, rgba(0,0,0,0.1) 85%, rgba(0,0,0,0) 100%)',
                        }}
                    />

                    {/* Slash 3 */}
                    <div
                        className="
                            absolute
                            inset-0
                            bg-[var(--color-primary)]
                        "
                        style={{
                            clipPath:
                                'polygon(49% 0, 52% 0, 37% 100%, 34% 100%)',
                            WebkitMaskImage:
                                'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 5%, rgba(0,0,0,0.1) 85%, rgba(0,0,0,0) 100%)',
                            maskImage:
                                'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 5%, rgba(0,0,0,0.1) 85%, rgba(0,0,0,0) 100%)',
                        }}
                    />

                    {/* Slash 4 */}
                    <div
                        className="
                            absolute
                            inset-0
                            bg-[var(--color-primary)]
                            z-10
                        "
                        style={{
                            clipPath:
                                'polygon(53.5% 0, 54.5% 0, 48% 45%, 47% 45%)',
                            WebkitMaskImage:
                                'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.1) 35%, rgba(0,0,0,0) 45%)',
                            maskImage:
                                'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.1) 35%, rgba(0,0,0,0) 45%)',
                        }}
                    />
                </div>
            )}
        </section>
    );
}
