import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Flame } from 'lucide-react';
import { useEffect, useState } from 'react';

/* =========================================================
   ANIMATION CONSTANTS
========================================================= */

const CUSTOM_EASE = [0.16, 1, 0.3, 1];
const IMAGE_ZOOM_EASE = [0.215, 0.61, 0.355, 1];

/* =========================================================
   FRAMER MOTION VARIANTS
========================================================= */

const containerVariants = {
    hidden: {
        opacity: 0,
    },

    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

const fadeSlideLeft = {
    hidden: {
        opacity: 0,
        x: -20,
    },

    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.7,
            ease: CUSTOM_EASE,
        },
    },
};

const imageZoomIn = {
    hidden: {
        opacity: 0,
        scale: 0.3,
    },

    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 1.3,
            delay: 0.2,
            ease: IMAGE_ZOOM_EASE,
        },
    },
};

/* =========================================================
   DEVICE / PREFERENCE DETECTION
   ---------------------------------------------------------
   - useIsAndroid: disables the infinite floating animation on
     Android specifically (kept from the original behavior).
   - useIsDesktop: drives ACTUAL conditional mounting (not just
     CSS `hidden`) of the desktop-only decoration (background
     image, diagonal cut, lime slashes). CSS `hidden` still lets
     the browser fetch the image and still lets Framer Motion
     run its infinite loops in the background on mobile - both
     were happening before despite the comments saying otherwise.
     Mounting conditionally fixes that for real.
   - useReducedMotion (from framer-motion): respects the user's
     OS-level motion preference, which also meaningfully helps
     battery/perf on mobile.
========================================================= */

function useIsAndroid() {
    const [isAndroid, setIsAndroid] = useState(false);

    useEffect(() => {
        const ua = navigator.userAgent || '';
        const platform = navigator.userAgentData?.platform || '';

        setIsAndroid(
            /Android/i.test(ua) ||
            /Android/i.test(platform)
        );
    }, []);

    return isAndroid;
}

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
   COMPONENT
========================================================= */

export default function Hero() {
    const isAndroid = useIsAndroid();
    const isDesktop = useIsDesktop();
    const prefersReducedMotion = useReducedMotion();

    // Android keeps its own quirk from before; reduced-motion now
    // also turns off the infinite float, for anyone (any device).
    const disableFloat = isAndroid || prefersReducedMotion;

    return (
        <section
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
                BACKGROUND IMAGE — DESKTOP ONLY

                Actually unmounted on mobile now (not just CSS-hidden),
                so the image is never fetched and the infinite y-loop
                never runs on phones.
            ===================================================== */}

            {isDesktop && (
                <div
                    className="
                        absolute
                        inset-0
                        pointer-events-none
                    "
                >
                    <motion.img
                        initial={{
                            opacity: 0,
                            scale: 1.05,
                        }}
                        animate={{
                            opacity: 0.12,
                            scale: 1,
                            y: prefersReducedMotion ? 0 : [0, 8, 0],
                        }}
                        transition={{
                            scale: {
                                duration: 1.5,
                            },
                            opacity: {
                                duration: 1.5,
                            },
                            y: prefersReducedMotion
                                ? { duration: 0 }
                                : {
                                    duration: 4,
                                    repeat: Infinity,
                                    repeatType: 'reverse',
                                    ease: 'easeInOut',
                                },
                        }}
                        src="/images/1.jpg"
                        alt=""
                        aria-hidden="true"
                        fetchPriority="low"
                        decoding="async"
                        className="
                            absolute
                            inset-0
                            w-full
                            h-full
                            object-cover
                            object-center
                            pointer-events-none
                        "
                    />
                </div>
            )}

            {/* =====================================================
                WHITE DIAGONAL CUT — DESKTOP ONLY
            ===================================================== */}

            {isDesktop && (
                <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    transition={{
                        duration: 1,
                        ease: CUSTOM_EASE,
                    }}
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
                CONTENT
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
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
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

                    <motion.div
                        variants={fadeSlideLeft}
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
                    </motion.div>

                    {/* =================================================
                        TITLE
                    ================================================= */}

                    <motion.h1
                        variants={fadeSlideLeft}
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
                    </motion.h1>

                    {/* =================================================
                        KEYWORDS
                    ================================================= */}

                    <motion.p
                        variants={fadeSlideLeft}
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
                    </motion.p>

                    {/* =================================================
                        CTA
                    ================================================= */}

                    <motion.div
                        variants={fadeSlideLeft}
                        className="w-full sm:w-auto"
                    >
                        <motion.a
                            href="#contact"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
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
                                hover:shadow-[var(--shadow-glow-strong)]
                                transition-[box-shadow,transform]
                                duration-300
                                cursor-pointer
                                group
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
                                    group-hover:translate-x-1.5
                                    transition-transform
                                    duration-300
                                "
                            />

                            <span
                                aria-hidden="true"
                                className="
                                    absolute
                                    inset-0
                                    bg-white/30
                                    translate-y-full
                                    group-hover:translate-y-0
                                    transition-transform
                                    duration-300
                                "
                            />
                        </motion.a>
                    </motion.div>
                </motion.div>
            </div>

            {/* =====================================================
                COACH IMAGE

                Single element tree for every device now (no more
                Android vs. iPhone/Desktop branches). Only the
                `animate`/`transition` props on the inner wrapper
                change based on device/preference, so React reuses
                the same <img> instead of unmounting and remounting
                it - that remount was forcing an extra image
                decode/paint (and on some browsers a re-fetch) every
                time the Android check resolved after first paint.
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
                <motion.div
                    variants={imageZoomIn}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div
                        animate={
                            disableFloat
                                ? { y: 0 }
                                : { y: [0, -12, 0] }
                        }
                        transition={
                            disableFloat
                                ? { duration: 0 }
                                : {
                                    duration: 4,
                                    repeat: Infinity,
                                    repeatType: 'reverse',
                                    ease: 'easeInOut',
                                }
                        }
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
                            alt="Coach"
                            width="550"
                            height="550"
                            fetchPriority="high"
                            decoding="async"
                            className="
                                w-full
                                h-full
                                object-cover
                                object-center
                                select-none
                            "
                        />
                    </motion.div>
                </motion.div>
            </div>

            {/* =====================================================
                LIME SLASHES — DESKTOP ONLY

                Now genuinely unmounted on mobile instead of just
                CSS-hidden, matching what the original comments said
                was already happening.
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

                    <motion.div
                        initial={{
                            y: '-100%',
                            opacity: 0,
                        }}
                        animate={{
                            y: 0,
                            opacity: 1,
                        }}
                        transition={{
                            duration: 0.8,
                            delay: 0.5,
                            ease: 'easeOut',
                        }}
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

                    <motion.div
                        initial={{
                            y: '100%',
                            opacity: 0,
                        }}
                        animate={{
                            y: 0,
                            opacity: 1,
                        }}
                        transition={{
                            duration: 0.8,
                            delay: 0.6,
                            ease: 'easeOut',
                        }}
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

                    <motion.div
                        initial={{
                            scaleY: 0,
                            opacity: 0,
                        }}
                        animate={{
                            scaleY: 1,
                            opacity: 1,
                        }}
                        transition={{
                            duration: 0.9,
                            delay: 0.4,
                            ease: CUSTOM_EASE,
                        }}
                        className="
                            absolute
                            inset-0
                            bg-[var(--color-primary)]
                            origin-top
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

                    <motion.div
                        initial={{
                            y: '-100%',
                            opacity: 0,
                        }}
                        animate={{
                            y: 0,
                            opacity: 1,
                        }}
                        transition={{
                            duration: 0.8,
                            delay: 0.7,
                            ease: 'easeOut',
                        }}
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