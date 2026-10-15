
import { ArrowRight, Flame } from 'lucide-react';
import { useEffect, useState } from 'react';

function useIsDesktop() {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 1024px)');
        const update = () => setIsDesktop(mediaQuery.matches);

        update();
        mediaQuery.addEventListener('change', update);

        return () => {
            mediaQuery.removeEventListener('change', update);
        };
    }, []);

    return isDesktop;
}

export const HERO_DEFAULTS = {
    badge: 'FIT YOUNESS',
    titleLine1: 'TRANSFORME.',
    titleLine2: 'DÉPASSE-TOI.',
    titleLine3: 'RÉUSSIS.',
    keywords: 'Coaching Sur-Mesure • Nutrition • Suivi 24/7',
    ctaText: 'DÉMARRER',
    ctaHref: '#contact',
    backgroundImage: '/images/1.jpg',
    coachImage: '/images/2.png',
    coachImageAlt: 'Coach Fit Youness',
    showBadge: true,
    showTitle: true,
    showKeywords: true,
    showCta: true,
    showCoachImage: true,
    showBackgroundImage: true,
    showSlashes: true,
};

export default function Hero({ config = {} }) {
    const isDesktop = useIsDesktop();
    const hero = { ...HERO_DEFAULTS, ...config };

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
            {/* Desktop background image */}
            {isDesktop && hero.showBackgroundImage && hero.backgroundImage && (
                <div className="absolute inset-0 pointer-events-none">
                    <img
                        src={hero.backgroundImage}
                        alt=""
                        aria-hidden="true"
                        fetchPriority="low"
                        decoding="async"
                        className="
                            absolute inset-0
                            w-full h-full
                            object-cover object-center
                            opacity-15
                            pointer-events-none
                        "
                    />
                </div>
            )}

            {/* White diagonal cut */}
            {isDesktop && (
                <div
                    className="
                        absolute inset-0
                        bg-white
                        z-10
                        pointer-events-none
                        shadow-2xl
                    "
                    style={{
                        clipPath: 'polygon(0 0, 52% 0, 36% 100%, 0 100%)',
                    }}
                />
            )}

            {/* Text content */}
            <div
                className="
                    relative z-40
                    w-full max-w-7xl
                    mx-auto
                    flex items-center justify-start
                    px-4 sm:px-8 lg:px-12
                    pointer-events-none
                    py-6 lg:py-0
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
                        flex flex-col items-start
                    "
                >
                    {/* Badge */}
                    {hero.showBadge && (
                        <div
                            className="
                                mb-2 sm:mb-4
                                inline-flex items-center gap-1.5
                                px-3 py-1
                                rounded-full
                                bg-[var(--color-slate-900)]
                                text-[var(--color-primary)]
                                text-[10px] sm:text-xs md:text-sm
                                font-black tracking-widest uppercase
                                shadow-xl
                            "
                        >
                            <Flame
                                aria-hidden="true"
                                className="
                                    w-3.5 h-3.5
                                    fill-[var(--color-primary)]
                                "
                            />

                            <span>{hero.badge}</span>
                        </div>
                    )}

                    {/* Main title */}
                    {hero.showTitle && (
                        <h1
                            className="
                                text-2xl sm:text-4xl md:text-5xl lg:text-7xl
                                font-black uppercase tracking-tighter italic
                                leading-[0.95]
                                mb-2 sm:mb-4
                            "
                        >
                            {hero.titleLine1}
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
                                {hero.titleLine2}
                            </span>

                            <br />

                            {hero.titleLine3}
                        </h1>
                    )}

                    {/* Keywords */}
                    {hero.showKeywords && (
                        <p
                            className="
                                text-[var(--color-slate-700)]
                                font-extrabold
                                text-[10px] sm:text-xs md:text-base
                                uppercase tracking-wider
                                mb-4 sm:mb-8
                            "
                        >
                            {hero.keywords}
                        </p>
                    )}

                    {/* Call to action */}
                    {hero.showCta && (
                        <div className="w-full sm:w-auto">
                            <a
                                href={hero.ctaHref}
                                className="
                                    relative
                                    inline-flex items-center justify-center
                                    gap-2 sm:gap-3
                                    px-5 py-3 sm:px-9 sm:py-4.5
                                    bg-[var(--color-primary)]
                                    text-[var(--color-slate-950)]
                                    font-black
                                    text-xs sm:text-base md:text-lg
                                    uppercase tracking-wider
                                    rounded-xl sm:rounded-2xl
                                    shadow-[var(--shadow-glow)]
                                    cursor-pointer
                                    overflow-hidden
                                "
                            >
                                <span className="relative z-10">
                                    {hero.ctaText}
                                </span>

                                <ArrowRight
                                    aria-hidden="true"
                                    className="
                                        relative z-10
                                        w-4 h-4 sm:w-5 sm:h-5
                                    "
                                />
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* Coach image */}
            {hero.showCoachImage && hero.coachImage && (
                <div
                    className="
                        absolute inset-0 right-0
                        z-30
                        flex items-center justify-end
                        lg:justify-center
                        pointer-events-none
                    "
                >
                    <div
                        className="
                            relative
                            w-[70vw]
                            sm:w-[70vw]
                            md:w-[65vw]
                            max-w-[800px]
                            aspect-square
                            translate-x-[12%]
                            sm:translate-x-[8%]
                            lg:translate-x-0
                            drop-shadow-2xl
                        "
                    >
                        <img
                            src={hero.coachImage}
                            alt={hero.coachImageAlt}
                            width="800"
                            height="800"
                            fetchPriority="high"
                            decoding="async"
                            className="
                                w-full h-full
                                object-contain
                                object-right-bottom
                                lg:object-bottom
                                select-none
                            "
                        />
                    </div>
                </div>
            )}

            {/* Desktop lime slashes */}
            {isDesktop && hero.showSlashes && (
                <div
                    className="
                        absolute inset-0
                        pointer-events-none
                        z-20
                    "
                >
                    {/* Slash 1 */}
                    <div
                        className="absolute inset-0 bg-[var(--color-primary)]"
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
                        className="absolute inset-0 bg-[var(--color-primary)]"
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
                        className="absolute inset-0 bg-[var(--color-primary)]"
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
                            absolute inset-0
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
