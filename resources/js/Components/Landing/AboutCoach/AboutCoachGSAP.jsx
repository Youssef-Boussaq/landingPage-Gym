import React, {
    useLayoutEffect,
    useRef,
    useState,
} from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import PhaseContent from './PhaseContent';

import {
    PHASES,
    PHASE_NAVIGATION_RATIOS,
    BREAKPOINTS,
    ANIMATION_CONFIG,
} from './aboutCoachData';

gsap.registerPlugin(ScrollTrigger);

/* =========================================================
   HELPERS
========================================================= */

function getActivePhase(progress) {
    if (progress < 0.35) return 1;
    if (progress < 0.7) return 2;
    return 3;
}

function createScrollUpdateHandler({
    activePhaseRef,
    setActivePhase,
    progressBarRef,
    progressTextRef,
}) {
    let lastPercent = -1;

    return (self) => {
        const progress = self.progress;

        /* =====================================================
           SCROLL PROGRESS
           Update DOM nodes directly via refs.
           Zero React re-renders on scroll frames.
        ===================================================== */
        const percent = Math.round(progress * 100);

        if (percent !== lastPercent) {
            lastPercent = percent;

            if (progressBarRef.current) {
                progressBarRef.current.style.width = `${percent}%`;
            }

            if (progressTextRef.current) {
                progressTextRef.current.textContent = `${percent}%`;
            }
        }

        /* =====================================================
           ACTIVE PHASE
           React state updates ONLY when integer phase changes (1, 2, 3).
        ===================================================== */
        const nextPhase = getActivePhase(progress);

        if (nextPhase !== activePhaseRef.current) {
            activePhaseRef.current = nextPhase;
            setActivePhase(nextPhase);
        }
    };
}

/* =========================================================
   IMAGE FALLBACK
========================================================= */

function getImageFallbackHandler(fallbackUrl) {
    return (event) => {
        const image = event.currentTarget;

        if (image.dataset.fallback) {
            return;
        }

        image.dataset.fallback = 'true';
        image.src = fallbackUrl;
    };
}

/* =========================================================
   GSAP TIMELINE
========================================================= */

function createPhaseTimeline({
    container,
    config,
    activePhaseRef,
    setActivePhase,
    progressBarRef,
    progressTextRef,
}) {
    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: config.end,
            pin: true,
            pinSpacing: true,
            scrub: config.scrub,
            invalidateOnRefresh: true,

            onUpdate: createScrollUpdateHandler({
                activePhaseRef,
                setActivePhase,
                progressBarRef,
                progressTextRef,
            }),
        },
    });

    timeline
        /* =====================================================
           IMAGE MOVEMENT (SUBTLE ON MOBILE: -10vw)
        ===================================================== */
        .fromTo(
            '.img-container',
            {
                x: '0vw',
                scale: config.imageScaleFrom,
            },
            {
                x: config.imageX,
                scale: config.imageScaleTo,
                ease: 'power2.inOut',
                duration: config.imageDuration,
            },
            0
        )

        /* =====================================================
           PHASE 1 (VISIBLE AT TOP, FADES/MOVES OUT AT PHASE 2)
        ===================================================== */
        .fromTo(
            '.text-phase-1',
            {
                opacity: 1,
                y: 0,
            },
            {
                opacity: 1,
                y: 0,
                duration: config.phaseStart.text,
            },
            0
        )

        .fromTo(
            '.badge-phase-1',
            {
                opacity: 1,
                scale: 1,
            },
            {
                opacity: 1,
                scale: 1,
                duration: config.phaseStart.badge,
            },
            0
        )

        /* =====================================================
           PHASE 1 → PHASE 2 TRANSITION
        ===================================================== */
        .to(
            '.text-phase-1',
            {
                opacity: 0,
                y: -config.textOffset,
                ease: 'power1.in',
                duration: 1,
            },
            config.phaseTwoStart
        )

        .to(
            '.badge-phase-1',
            {
                opacity: 0,
                scale: 0.95,
                duration: 0.6,
            },
            config.phaseTwoStart
        )

        .to(
            '.img-3',
            {
                opacity: 0,
                scale: config.imageScaleFrom === 1 ? 0.95 : 0.96,
                ease: 'power2.inOut',
                duration: 1.2,
            },
            config.phaseTwoStart
        )

        .fromTo(
            '.img-4',
            {
                opacity: 0,
                scale: config.imageScaleFrom === 1 ? 0.95 : 0.96,
            },
            {
                opacity: 1,
                scale: 1,
                ease: 'power2.inOut',
                duration: 1.2,
            },
            config.phaseTwoStart
        )

        .fromTo(
            '.text-phase-2',
            {
                opacity: 0,
                y: config.textOffset,
            },
            {
                opacity: 1,
                y: 0,
                ease: 'power2.out',
                duration: 1,
            },
            config.phaseTwoStart + 0.2
        )

        .fromTo(
            '.badge-phase-2',
            {
                opacity: 0,
                scale: 0.95,
            },
            {
                opacity: 1,
                scale: 1,
                duration: config.badgeDuration,
            },
            config.phaseTwoStart + 0.2
        )

        /* =====================================================
           PHASE 2 → PHASE 3 TRANSITION
        ===================================================== */
        .to(
            '.text-phase-2',
            {
                opacity: 0,
                y: -config.textOffset,
                ease: 'power1.in',
                duration: 1,
            },
            config.phaseThreeStart
        )

        .to(
            '.badge-phase-2',
            {
                opacity: 0,
                scale: 0.95,
                duration: 0.6,
            },
            config.phaseThreeStart
        )

        .to(
            '.img-4',
            {
                opacity: 0,
                scale: config.imageScaleFrom === 1 ? 0.95 : 0.96,
                ease: 'power2.inOut',
                duration: 1.2,
            },
            config.phaseThreeStart
        )

        .to(
            '.img-3',
            {
                opacity: 1,
                scale: 1,
                ease: 'power2.inOut',
                duration: 1.2,
            },
            config.phaseThreeStart
        )

        .fromTo(
            '.text-phase-3',
            {
                opacity: 0,
                y: config.textOffset,
            },
            {
                opacity: 1,
                y: 0,
                ease: 'power2.out',
                duration: 1,
            },
            config.phaseThreeStart + 0.2
        )

        .fromTo(
            '.badge-phase-3',
            {
                opacity: 0,
                scale: 0.95,
            },
            {
                opacity: 1,
                scale: 1,
                duration: config.badgeDuration,
            },
            config.phaseThreeStart + 0.2
        );

    return timeline;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function AboutCoachGSAP({ onBookCall }) {
    const containerRef = useRef(null);
    const scrollTriggerRef = useRef(null);

    /*
     * React state: ONLY updates on discrete phase transitions.
     */
    const [activePhase, setActivePhase] = useState(1);

    /*
     * Mutable phase ref: Prevents unnecessary renders.
     */
    const activePhaseRef = useRef(1);

    /*
     * DOM refs for progress indicator: updated directly by GSAP.
     */
    const progressBarRef = useRef(null);
    const progressTextRef = useRef(null);

    /* =====================================================
       GSAP SETUP WITH RESPONSIVE MATCHMEDIA & REDUCED MOTION
    ===================================================== */
    useLayoutEffect(() => {
        const context = gsap.context(() => {
            const mediaQuery = gsap.matchMedia();

            mediaQuery.add(
                {
                    isMobile: BREAKPOINTS.mobile,
                    isDesktop: BREAKPOINTS.desktop,
                    reduceMotion: '(prefers-reduced-motion: reduce)',
                },
                (ctx) => {
                    const { isMobile, reduceMotion } = ctx.conditions;

                    if (reduceMotion) {
                        // Accessible static presentation without pinned scrub
                        gsap.set('.img-container', { x: 0, scale: 1 });
                        gsap.set('.text-phase-1', { opacity: 1, y: 0 });
                        gsap.set('.badge-phase-1', { opacity: 1, scale: 1 });
                        gsap.set('.img-3', { opacity: 1, scale: 1 });
                        gsap.set('.img-4', { opacity: 0 });
                        return;
                    }

                    const config = isMobile
                        ? ANIMATION_CONFIG.mobile
                        : ANIMATION_CONFIG.desktop;

                    const timeline = createPhaseTimeline({
                        container: containerRef.current,
                        config,
                        activePhaseRef,
                        setActivePhase,
                        progressBarRef,
                        progressTextRef,
                    });

                    scrollTriggerRef.current =
                        timeline.scrollTrigger || null;
                }
            );
        }, containerRef);

        return () => {
            scrollTriggerRef.current = null;
            context.revert();
        };
    }, []);

    /* =====================================================
       PHASE NAVIGATION
    ===================================================== */
    const scrollToPhase = (phaseNumber) => {
        const scrollTrigger = scrollTriggerRef.current;

        if (!scrollTrigger) {
            setActivePhase(phaseNumber);
            activePhaseRef.current = phaseNumber;
            return;
        }

        const ratio = PHASE_NAVIGATION_RATIOS[phaseNumber] ?? 0;

        const targetY =
            scrollTrigger.start +
            (scrollTrigger.end - scrollTrigger.start) * ratio;

        window.scrollTo({
            top: targetY,
            behavior: 'smooth',
        });
    };

    const activePhaseData = PHASES[activePhase] || PHASES[1];

    return (
        <section
            ref={containerRef}
            id="about"
            className="
                relative w-full h-[100svh] min-h-[640px]
                bg-[#fbfdf7] text-zinc-900 overflow-hidden select-none
                border-y border-zinc-200/80
                pb-[env(safe-area-inset-bottom)]
            "
        >
            {/* =====================================================
                TOP GRADIENT (DECORATIVE EDGE FADE)
            ===================================================== */}
            <div
                className="
                    absolute
                    top-0
                    left-0
                    right-0
                    h-12
                    sm:h-28
                    bg-gradient-to-b
                    from-[#fbfdf7]
                    via-[#fbfdf7]/80
                    to-transparent
                    z-40
                    pointer-events-none
                "
            />

            {/* =====================================================
                BOTTOM GRADIENT (DECORATIVE EDGE FADE)
            ===================================================== */}
            <div
                className="
                    absolute
                    bottom-0
                    left-0
                    right-0
                    h-12
                    sm:h-28
                    bg-gradient-to-t
                    from-[#fbfdf7]
                    via-[#fbfdf7]/80
                    to-transparent
                    z-40
                    pointer-events-none
                "
            />

            {/* =====================================================
                AMBIENT BACKGROUND (OPTIMIZED BLUR RADII FOR MOBILE)
            ===================================================== */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div
                    className="
                        absolute
                        top-1/3
                        left-1/4
                        -translate-x-1/2
                        -translate-y-1/2
                        w-[220px]
                        sm:w-[500px]
                        lg:w-[700px]
                        h-[220px]
                        sm:h-[500px]
                        lg:h-[700px]
                        bg-[var(--color-primary)]/[0.08]
                        rounded-full
                        blur-[50px]
                        sm:blur-[140px]
                        lg:blur-[180px]
                    "
                />

                <div
                    className="
                        absolute
                        bottom-1/3
                        right-1/4
                        translate-x-1/4
                        translate-y-1/2
                        w-[180px]
                        sm:w-[420px]
                        lg:w-[600px]
                        h-[180px]
                        sm:h-[420px]
                        lg:h-[600px]
                        bg-[var(--color-primary)]/[0.06]
                        rounded-full
                        blur-[50px]
                        sm:blur-[130px]
                        lg:blur-[160px]
                    "
                />

                <div
                    className="
                        absolute
                        inset-0
                        flex
                        items-center
                        justify-center
                        opacity-[0.03]
                        pointer-events-none
                        select-none
                    "
                >
                    <span
                        className="
                            font-archivo
                            text-[16vw]
                            uppercase
                            tracking-tighter
                            text-zinc-950
                        "
                    >
                        PERFORMANCE
                    </span>
                </div>
            </div>

            {/* =====================================================
                MAIN CONTENT WRAPPER
            ===================================================== */}
            <div
                className="
                    relative
                    w-full
                    max-w-[1700px]
                    h-full
                    mx-auto
                    px-4
                    sm:px-8
                    lg:px-12
                    flex
                    flex-row
                    items-center
                    justify-center
                    z-10
                "
            >
                {/* =================================================
                    TOP CONTROL BAR
                ================================================= */}
                <div
                    className="
                        absolute
                        top-4
                        sm:top-6
                        left-3
                        sm:left-8
                        lg:left-12
                        right-3
                        sm:right-8
                        lg:right-12
                        flex
                        items-center
                        justify-between
                        z-40
                        pointer-events-auto
                    "
                >
                    {/* Active Phase Pill */}
                    <div
                        className="
                            flex
                            items-center
                            gap-1.5
                            sm:gap-2
                            px-3
                            py-1
                            sm:px-3.5
                            sm:py-1.5
                            rounded-full
                            bg-white/95
                            border
                            border-[var(--color-primary)]/40
                            text-[var(--color-primary-dark)]
                            font-bold
                            text-[11px]
                            sm:text-xs
                            uppercase
                            tracking-wider
                            shadow-2xs
                            sm:shadow-xs
                            backdrop-blur-xs
                            sm:backdrop-blur-md
                        "
                    >
                        <span className="relative flex h-2 w-2">
                            <span
                                className="
                                    animate-ping
                                    absolute
                                    inline-flex
                                    h-full
                                    w-full
                                    rounded-full
                                    bg-[var(--color-primary)]
                                    opacity-75
                                "
                            />
                            <span
                                className="
                                    relative
                                    inline-flex
                                    rounded-full
                                    h-2
                                    w-2
                                    bg-[var(--color-primary-dark)]
                                "
                            />
                        </span>

                        <span className="font-mono">
                            PHASE 0{activePhase}
                        </span>

                        <span className="text-zinc-300">
                            /
                        </span>

                        <span className="hidden sm:inline text-zinc-700">
                            {activePhaseData.label}
                        </span>
                    </div>

                    {/* Phase Navigation Buttons */}
                    <div className="flex items-center gap-1 sm:gap-2">
                        {[1, 2, 3].map((phase) => {
                            const isActive = activePhase === phase;
                            const phaseData = PHASES[phase];

                            return (
                                <button
                                    key={phase}
                                    id={`phase-nav-btn-${phase}`}
                                    type="button"
                                    onClick={() => scrollToPhase(phase)}
                                    aria-label={`Aller à la phase ${phase}`}
                                    className={`
                                        px-2.5
                                        py-1
                                        sm:px-3
                                        sm:py-1.5
                                        rounded-md
                                        sm:rounded-lg
                                        text-[11px]
                                        sm:text-xs
                                        font-mono
                                        font-bold
                                        transition-all
                                        duration-200
                                        cursor-pointer
                                        shadow-2xs
                                        ${isActive
                                            ? `
                                                bg-[var(--color-primary-dark)]
                                                text-white
                                                shadow-xs
                                                shadow-[var(--color-primary-dark)]/25
                                            `
                                            : `
                                                bg-white/90
                                                border
                                                border-zinc-200
                                                text-zinc-600
                                                hover:text-zinc-950
                                                hover:bg-white
                                            `
                                        }
                                    `}
                                >
                                    <span>0{phase}</span>
                                    <span
                                        className="
                                            hidden
                                            md:inline
                                            ml-1.5
                                            font-sans
                                            font-medium
                                            text-xs
                                        "
                                    >
                                        {phaseData.navLabel}
                                    </span>
                                </button>
                            );
                        })}

                        {/* Scroll Progress (Desktop) */}
                        <div
                            className="
                                hidden
                                lg:flex
                                items-center
                                gap-2
                                pl-3
                                border-l
                                border-zinc-200
                                text-xs
                                font-mono
                                text-zinc-500
                            "
                        >
                            <div
                                className="
                                    w-16
                                    h-1.5
                                    rounded-full
                                    overflow-hidden
                                    bg-zinc-200
                                "
                            >
                                <div
                                    ref={progressBarRef}
                                    className="
                                        h-full
                                        bg-[var(--color-primary-dark)]
                                    "
                                    style={{ width: '0%' }}
                                />
                            </div>

                            <span
                                ref={progressTextRef}
                                className="
                                    w-8
                                    text-right
                                    font-medium
                                "
                            >
                                0%
                            </span>
                        </div>
                    </div>
                </div>

                {/* =================================================
                    COACH IMAGERY (LEFT ON MOBILE, NEVER OVERLAPS TEXT)
                ================================================= */}
                <div
                    className="
                        img-container
                        absolute
                        left-[29%]
                        top-[52%]
                        -translate-x-1/2
                        -translate-y-1/2
                        z-20
                        flex
                        items-center
                        justify-center
                        pointer-events-none
                        will-change-transform
                        sm:left-1/2
                        sm:top-1/2
                    "
                >
                    <div
                        className="
                            relative
                            w-[52vw]
                            h-[53svh]
                            aspect-[9/16]
                            sm:w-[540px]
                            sm:h-[80vh]
                            lg:w-[720px]
                            xl:w-[840px]
                            flex
                            items-center
                            justify-center
                        "
                    >
                        {/* Contact Ground Shadow */}
                        <div
                            className="
                                absolute
                                bottom-2
                                sm:bottom-3
                                left-1/2
                                -translate-x-1/2
                                w-4/5
                                h-6
                                sm:h-10
                                rounded-[100%]
                                bg-zinc-950/15
                                blur-md
                                sm:blur-xl
                                pointer-events-none
                            "
                        />

                        {/* Image 3: Phase 1 & 3 */}
                        <img
                            src="/images/3.png"
                            alt="Coach Sportif - Phase Préparation"
                            width="540"
                            height="960"
                            loading="eager"
                            decoding="async"
                            draggable="false"
                            referrerPolicy="no-referrer"
                            onError={getImageFallbackHandler(
                                'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200&auto=format&fit=crop'
                            )}
                            className="
                                img-3
                                absolute
                                inset-0
                                w-full
                                h-full
                                object-contain
                                drop-shadow-[0_10px_20px_rgba(15,23,42,0.14)]
                                sm:drop-shadow-[0_15px_30px_rgba(15,23,42,0.18)]
                                select-none
                                will-change-[transform,opacity]
                            "
                        />

                        {/* Image 4: Phase 2 */}
                        <img
                            src="/images/4.png"
                            alt="Coach Sportif - Phase Action"
                            width="540"
                            height="960"
                            loading="lazy"
                            decoding="async"
                            draggable="false"
                            referrerPolicy="no-referrer"
                            onError={getImageFallbackHandler(
                                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop'
                            )}
                            className="
                                img-4
                                absolute
                                inset-0
                                w-full
                                h-full
                                object-contain
                                drop-shadow-[0_10px_20px_rgba(15,23,42,0.14)]
                                sm:drop-shadow-[0_15px_30px_rgba(15,23,42,0.18)]
                                select-none
                                opacity-0
                                will-change-[transform,opacity]
                            "
                        />

                        {/* Dynamic Coach Badge */}
                        <div
                            className="
                                absolute
                                bottom-2
                                sm:bottom-4
                                left-1/2
                                -translate-x-1/2
                                z-30
                                pointer-events-auto
                            "
                        >
                            <div
                                className="
                                    px-2.5
                                    py-0.5
                                    sm:px-3.5
                                    sm:py-1
                                    rounded-full
                                    bg-white/95
                                    border
                                    border-zinc-200/90
                                    text-zinc-900
                                    shadow-xs
                                    sm:shadow-md
                                    flex
                                    items-center
                                    gap-1.5
                                    sm:gap-2
                                    backdrop-blur-xs
                                    sm:backdrop-blur-md
                                "
                            >
                                <div
                                    className="
                                        w-1.5
                                        h-1.5
                                        sm:w-2
                                        sm:h-2
                                        rounded-full
                                        bg-[var(--color-primary-dark)]
                                    "
                                />

                                <span
                                    className="
                                        font-mono
                                        text-[9px]
                                        sm:text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wider
                                        whitespace-nowrap
                                    "
                                >
                                    {activePhaseData.coachBadge}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* =================================================
                    TEXT CONTENT (DEDICATED RIGHT POSITIONING)
                ================================================= */}
                <div
                    className="
                        absolute
                        right-3
                        top-[50%]
                        -translate-y-1/2
                        w-[52%]
                        max-w-[205px]
                        h-[315px]
                        z-30
                        flex
                        flex-col
                        justify-center
                        pointer-events-none
                        sm:right-10
                        sm:w-full
                        sm:max-w-lg
                        sm:h-[460px]
                        lg:right-20
                        lg:max-w-xl
                        xl:right-28
                    "
                >
                    <PhaseContent
                        phase={1}
                        onBookCall={onBookCall}
                    />

                    <PhaseContent
                        phase={2}
                        onBookCall={onBookCall}
                    />

                    <PhaseContent
                        phase={3}
                        onBookCall={onBookCall}
                    />
                </div>

                {/* =================================================
                    BOTTOM HELPER (SCROLL HINT)
                ================================================= */}
                <div
                    className="
                        absolute
                        bottom-3
                        sm:bottom-4
                        left-1/2
                        -translate-x-1/2
                        flex
                        flex-col
                        items-center
                        gap-1
                        z-30
                        pointer-events-none
                        opacity-60
                    "
                >
                    <span
                        className="
                            font-mono
                            text-[9px]
                            sm:text-[10px]
                            tracking-widest
                            uppercase
                            text-zinc-500
                        "
                    >
                        Faites défiler pour naviguer
                    </span>

                    <svg
                        className="
                            w-3.5
                            h-3.5
                            sm:w-4
                            sm:h-4
                            animate-bounce
                            text-zinc-600
                        "
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </div>
            </div>
        </section>
    );
}
