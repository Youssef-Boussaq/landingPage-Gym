
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Play } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Reduce unnecessary callbacks caused by mobile viewport changes.
    ScrollTrigger.config({
        ignoreMobileResize: true,
        limitCallbacks: true,
    });
}

const CARDS_DATA = [
    {
        id: 0,
        tag: 'GRID SHATTER',
        title: 'Dynamic Power',
        desc: 'High velocity 3D shatter transitions driven by natural scroll physics.',
        img: '/images/6.png',
    },
    {
        id: 1,
        tag: 'CREATIVE MOTION',
        title: 'Core Stability',
        desc: 'Balanced fluid motion and architectural visual alignment for maximum engagement.',
        img: '/images/5.png',
    },
    {
        id: 2,
        tag: 'VISUAL EXPERIENCE',
        title: 'High Intensity',
        desc: 'Dynamic athletic performance framed with high precision camera dynamics.',
        img: '/images/7.png',
    },
    {
        id: 3,
        tag: 'PREMIUM ANIMATION',
        title: 'Flexibility Flow',
        desc: 'Smooth progressive transitions, ergonomic mobile interactions, and kinetic harmony.',
        img: '/images/8.png',
    },
];

export default function FitYounessStudio() {
    const containerRef = useRef(null);
    const carouselTrackRef = useRef(null);
    const centerSlotRef = useRef(null);
    const heroMorphRef = useRef(null);
    const heroContentRef = useRef(null);
    const heroTextContainerRef = useRef(null);
    const heroPlayBtnRef = useRef(null);
    const showcaseHeaderRef = useRef(null);
    const gridOverlayRef = useRef(null);

    const [openCardId, setOpenCardId] = useState(null);
    const [activeDot, setActiveDot] = useState(0);
    const [isMorphedState, setIsMorphedState] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    /*
    =========================================================
    GSAP / SCROLL PERFORMANCE
    =========================================================
    */

    useEffect(() => {
        if (
            typeof window === 'undefined' ||
            !containerRef.current ||
            !centerSlotRef.current ||
            !heroMorphRef.current
        ) {
            return;
        }

        const ctx = gsap.context(() => {
            const container = containerRef.current;
            const centerSlot = centerSlotRef.current;
            const heroMorph = heroMorphRef.current;

            const GRID_SIZE = 6;
            const TILE_COUNT = GRID_SIZE * GRID_SIZE;

            const isMobile = window.matchMedia(
                '(max-width: 639px)'
            ).matches;

            const bgImage = isMobile
                ? '/images/mobil2.png'
                : '/images/hero.jpg';

            /*
            =====================================================
            GRID SHATTER
            =====================================================
            */

            const gridOverlay = gridOverlayRef.current;

            if (gridOverlay) {
                gridOverlay.replaceChildren();

                const fragment = document.createDocumentFragment();

                for (let r = 0; r < GRID_SIZE; r++) {
                    for (let c = 0; c < GRID_SIZE; c++) {
                        const tile = document.createElement('div');

                        tile.className =
                            'grid-tile absolute inset-0 w-full h-full pointer-events-none';

                        tile.style.backgroundImage = `url('${bgImage}')`;
                        tile.style.backgroundSize = 'cover';
                        tile.style.backgroundPosition = 'center';
                        tile.style.backgroundRepeat = 'no-repeat';

                        const top = (r / GRID_SIZE) * 100;
                        const bottom = ((r + 1) / GRID_SIZE) * 100;
                        const left = (c / GRID_SIZE) * 100;
                        const right = ((c + 1) / GRID_SIZE) * 100;

                        tile.style.clipPath = `
                            polygon(
                                ${left}% ${top}%,
                                ${right}% ${top}%,
                                ${right}% ${bottom}%,
                                ${left}% ${bottom}%
                            )
                        `;

                        fragment.appendChild(tile);
                    }
                }

                gridOverlay.appendChild(fragment);
            }

            /*
            =====================================================
            ELEMENTS
            =====================================================
            */

            const reelCards = container.querySelectorAll(
                '.reel-card-item'
            );

            const tiles = gridOverlay
                ? gridOverlay.querySelectorAll('.grid-tile')
                : [];

            /*
            =====================================================
            INITIAL STATES
            =====================================================
            */

            gsap.set(heroMorph, {
                x: 0,
                y: 0,
                scaleX: 1,
                scaleY: 1,
                borderRadius: 0,
                opacity: 0,
                visibility: 'visible',
                transformOrigin: 'center center',
                force3D: true,
            });

            if (heroTextContainerRef.current) {
                gsap.set(heroTextContainerRef.current, {
                    scale: 1,
                    force3D: true,
                });
            }

            if (heroPlayBtnRef.current) {
                gsap.set(heroPlayBtnRef.current, {
                    opacity: 0,
                    scale: 0.5,
                    force3D: true,
                });
            }

            if (showcaseHeaderRef.current) {
                gsap.set(showcaseHeaderRef.current, {
                    opacity: 0,
                    y: 50,
                    force3D: true,
                });
            }

            if (reelCards.length) {
                gsap.set(reelCards, {
                    opacity: 0,
                    y: 100,
                    force3D: true,
                });
            }

            /*
            =====================================================
            DOCK GEOMETRY
            =====================================================

            IMPORTANT:
            We no longer animate:

                top
                left
                width
                height

            Those properties can trigger layout/reflow.

            Instead we calculate the target geometry once and
            animate:

                x
                y
                scaleX
                scaleY

            These are compositor-friendly transforms.
            =====================================================
            */

            const getDockTransform = () => {
                const containerRect =
                    container.getBoundingClientRect();

                const slotRect =
                    centerSlot.getBoundingClientRect();

                const containerWidth = containerRect.width;
                const containerHeight = containerRect.height;

                if (
                    !containerWidth ||
                    !containerHeight
                ) {
                    return {
                        x: 0,
                        y: 0,
                        scaleX: 1,
                        scaleY: 1,
                    };
                }

                const containerCenterX =
                    containerWidth / 2;

                const containerCenterY =
                    containerHeight / 2;

                const slotCenterX =
                    slotRect.left -
                    containerRect.left +
                    slotRect.width / 2;

                const slotCenterY =
                    slotRect.top -
                    containerRect.top +
                    slotRect.height / 2;

                return {
                    x: slotCenterX - containerCenterX,
                    y: slotCenterY - containerCenterY,
                    scaleX: slotRect.width / containerWidth,
                    scaleY: slotRect.height / containerHeight,
                };
            };

            /*
            =====================================================
            MORPH STATE
            =====================================================
            */

            let previousMorphState = false;

            const updateMorphState = (progress) => {
                const nextState = progress > 0.85;

                // React state is updated ONLY when the value changes.
                if (nextState === previousMorphState) {
                    return;
                }

                previousMorphState = nextState;

                setIsMorphedState(nextState);
            };

            /*
            =====================================================
            MASTER TIMELINE
            =====================================================
            */

            const tl = gsap.timeline({
                defaults: {
                    overwrite: 'auto',
                },

                scrollTrigger: {
                    trigger: container,

                    start: 'top top',

                    end: '+=2600',

                    pin: true,

                    scrub: 1,

                    anticipatePin: 1,

                    invalidateOnRefresh: true,

                    onUpdate: (self) => {
                        updateMorphState(self.progress);
                    },
                },
            });

            /*
            =====================================================
            INITIAL HERO FADE
            =====================================================
            */

            if (heroContentRef.current) {
                tl.to(
                    heroContentRef.current,
                    {
                        opacity: 0,
                        y: -50,
                        scale: 0.95,
                        duration: 0.35,
                        ease: 'power2.out',
                    },
                    0
                );
            }

            /*
            =====================================================
            MORPH HERO
            =====================================================
            */

            tl.to(
                heroMorph,
                {
                    opacity: 1,
                    duration: 0.45,
                    ease: 'power2.inOut',
                },
                0.05
            );

            /*
            =====================================================
            GRID EXPLOSION
            =====================================================
            */

            if (tiles.length) {
                tiles.forEach((tile, index) => {
                    const angle =
                        (index / TILE_COUNT) *
                        Math.PI *
                        2;

                    const distance =
                        350 + (index % 5) * 80;

                    const xTarget =
                        Math.cos(angle) * distance;

                    const yTarget =
                        Math.sin(angle) * distance;

                    const rotationX =
                        (Math.random() - 0.5) * 800;

                    const rotationY =
                        (Math.random() - 0.5) * 800;

                    const rotationZ =
                        (Math.random() - 0.5) * 450;

                    const zTarget =
                        400 + Math.random() * 500;

                    tl.to(
                        tile,
                        {
                            x: xTarget,
                            y: yTarget,
                            z: zTarget,
                            rotationX,
                            rotationY,
                            rotationZ,
                            scale:
                                0.35 +
                                Math.random() * 0.4,
                            opacity: 0,
                            duration: 0.95,
                            ease: 'power2.inOut',
                            force3D: true,
                        },
                        0.08
                    );
                });
            }

            /*
            =====================================================
            DOCK HERO
            =====================================================

            No top / left / width / height animation.

            Everything uses transforms.
            =====================================================
            */

            tl.to(
                heroMorph,
                {
                    x: () => getDockTransform().x,
                    y: () => getDockTransform().y,
                    scaleX: () =>
                        getDockTransform().scaleX,
                    scaleY: () =>
                        getDockTransform().scaleY,

                    borderRadius: '24px',

                    duration: 1.25,

                    ease: 'power3.inOut',

                    force3D: true,
                },
                1.0
            );

            /*
            =====================================================
            SCALE HERO CONTENT
            =====================================================
            */

            if (heroTextContainerRef.current) {
                tl.to(
                    heroTextContainerRef.current,
                    {
                        scale: 0.65,
                        duration: 1.2,
                        ease: 'power3.inOut',
                        force3D: true,
                    },
                    1.05
                );
            }

            /*
            =====================================================
            PLAY BUTTON
            =====================================================
            */

            if (heroPlayBtnRef.current) {
                tl.to(
                    heroPlayBtnRef.current,
                    {
                        opacity: 1,
                        scale: 1,
                        duration: 0.45,
                        ease: 'back.out(1.5)',
                        force3D: true,
                    },
                    1.9
                );
            }

            /*
            =====================================================
            SHOWCASE HEADER
            =====================================================
            */

            if (showcaseHeaderRef.current) {
                tl.to(
                    showcaseHeaderRef.current,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.65,
                        ease: 'power2.out',
                        force3D: true,
                    },
                    1.5
                );
            }

            /*
            =====================================================
            CARDS
            =====================================================
            */

            if (reelCards.length) {
                tl.to(
                    reelCards,
                    {
                        opacity: 1,
                        y: 0,
                        stagger: 0.08,
                        duration: 0.75,
                        ease: 'power2.out',
                        force3D: true,
                    },
                    1.65
                );
            }

            /*
            =====================================================
            INITIAL REFRESH
            =====================================================

            One controlled refresh after setup instead of
            repeated refresh calls.
            =====================================================
            */

            ScrollTrigger.refresh();
        }, containerRef);

        return () => {
            /*
            ctx.revert() automatically kills:
                - GSAP tweens
                - timeline
                - ScrollTrigger
                - inline styles
                - event listeners created inside context
            */

            ctx.revert();
        };
    }, []);

    /*
    =========================================================
    CAROUSEL SCROLL
    =========================================================

    requestAnimationFrame prevents React state updates for
    every single native scroll event.
    =========================================================
    */

    const carouselRafRef = useRef(null);

    const handleCarouselScroll = () => {
        if (!carouselTrackRef.current) {
            return;
        }

        if (carouselRafRef.current) {
            return;
        }

        carouselRafRef.current = requestAnimationFrame(() => {
            carouselRafRef.current = null;

            const track =
                carouselTrackRef.current;

            if (!track) {
                return;
            }

            const scrollLeft = track.scrollLeft;

            const cardWidth = 270;

            const activeIndex = Math.min(
                Math.max(
                    Math.round(
                        scrollLeft / cardWidth
                    ),
                    0
                ),
                CARDS_DATA.length
            );

            setActiveDot((previous) => {
                if (previous === activeIndex) {
                    return previous;
                }

                return activeIndex;
            });
        });
    };

    /*
    =========================================================
    CAROUSEL CLEANUP
    =========================================================
    */

    useEffect(() => {
        return () => {
            if (carouselRafRef.current) {
                cancelAnimationFrame(
                    carouselRafRef.current
                );
            }
        };
    }, []);

    /*
    =========================================================
    CAROUSEL NAVIGATION
    =========================================================
    */

    const scrollToSlide = (index) => {
        if (!carouselTrackRef.current) {
            return;
        }

        const cardWidth = 270;

        carouselTrackRef.current.scrollTo({
            left: index * cardWidth,
            behavior: 'smooth',
        });

        setActiveDot(index);
    };

    /*
    =========================================================
    CARD DRAWER
    =========================================================
    */

    const toggleDrawer = (id) => {
        setOpenCardId((previous) =>
            previous === id ? null : id
        );
    };

    /*
    =========================================================
    HERO CLICK
    =========================================================
    */

    const handleHeroClick = () => {
        if (!isMorphedState) {
            return;
        }

        setIsPlaying((previous) => !previous);
    };

    return (
        <div className="fy-showcase overflow-x-hidden antialiased">

            <section
                ref={containerRef}
                className="
                    relative
                    w-full
                    h-screen
                    overflow-hidden
                    select-none
                    fy-showcase-bg
                "
            >

                <div className="
                    relative
                    w-full
                    h-full
                    overflow-hidden
                    flex
                    flex-col
                    items-center
                    justify-center
                    z-10
                ">

                    <div className="
                        absolute
                        inset-0
                        fy-showcase-overlay
                        pointer-events-none
                    " />

                    <div
                        className="
                            relative
                            z-20
                            w-full
                            max-w-[1500px]
                            h-full
                            px-3
                            sm:px-6
                            mx-auto
                            flex
                            flex-col
                            items-center
                            justify-center
                            py-4
                            sm:py-6
                            md:py-8
                        "
                    >

                        {/* HEADER */}

                        <div
                            ref={showcaseHeaderRef}
                            className="
                                text-center
                                mb-3
                                sm:mb-4
                                md:mb-6
                                lg:mb-8
                                flex
                                flex-col
                                items-center
                            "
                        >

                            <div className="
                                inline-flex
                                items-center
                                gap-2
                                px-3
                                py-1
                                rounded-full
                                text-[11px]
                                sm:text-xs
                                font-bold
                                tracking-wider
                                uppercase
                                mb-2
                                backdrop-blur-md
                                fy-pill
                            ">
                                <span className="
                                    w-1.5
                                    h-1.5
                                    rounded-full
                                    bg-[var(--color-primary)]
                                    animate-pulse
                                " />

                                Curated Motion
                            </div>

                            <h2 className="
                                fy-title
                                text-3xl
                                sm:text-4xl
                                md:text-5xl
                                lg:text-6xl
                                mb-1
                                tracking-tight
                            ">
                                Visual Showcase
                            </h2>

                            <p className="
                                fy-description
                                text-xs
                                sm:text-sm
                                md:text-base
                                max-w-xl
                                mx-auto
                                font-normal
                            ">
                                Precision engineering and fluid
                                choreography tuned for high performance.
                            </p>

                        </div>

                        {/* CAROUSEL */}

                        <div
                            ref={carouselTrackRef}
                            onScroll={handleCarouselScroll}
                            className="
                                w-full
                                flex
                                lg:grid
                                lg:grid-cols-5
                                gap-3
                                sm:gap-4
                                md:gap-5
                                lg:gap-6
                                items-center
                                justify-start
                                lg:justify-center
                                overflow-x-auto
                                lg:overflow-visible
                                no-scrollbar
                                snap-x
                                snap-mandatory
                                px-4
                                lg:px-0
                                py-2
                            "
                        >

                            {CARDS_DATA.slice(0, 2).map(
                                (card, idx) => (
                                    <CardItem
                                        key={card.id}
                                        card={card}
                                        bgIndex={idx}
                                        isOpen={
                                            openCardId ===
                                            card.id
                                        }
                                        onToggle={() =>
                                            toggleDrawer(
                                                card.id
                                            )
                                        }
                                    />
                                )
                            )}

                            {/* CENTER DOCK */}

                            <div
                                ref={centerSlotRef}
                                className={`
                                    shrink-0
                                    snap-center
                                    relative
                                    rounded-3xl
                                    w-[min(76vw,290px)]
                                    h-[min(52vh,440px)]
                                    sm:w-[260px]
                                    sm:h-[390px]
                                    md:w-[290px]
                                    md:h-[430px]
                                    lg:w-full
                                    lg:h-[min(55vh,460px)]
                                    flex
                                    items-center
                                    justify-center
                                    ${isMorphedState
                                        ? 'docked-active'
                                        : ''
                                    }
                                `}
                            >

                                <div className="
                                    w-full
                                    h-full
                                    rounded-3xl
                                    flex
                                    flex-col
                                    items-center
                                    justify-center
                                    p-4
                                    text-center
                                    backdrop-blur-md
                                    fy-card-dock
                                ">

                                    <div className="
                                        w-12
                                        h-12
                                        rounded-full
                                        flex
                                        items-center
                                        justify-center
                                        mb-2
                                        bg-[rgba(157,229,0,0.1)]
                                        border
                                        border-[rgba(157,229,0,0.3)]
                                        text-[var(--color-primary-dark)]
                                    ">
                                        <Play className="
                                            w-5
                                            h-5
                                            ml-0.5
                                            fill-current
                                        " />
                                    </div>

                                    <span className="
                                        text-[11px]
                                        font-bold
                                        text-[var(--color-primary-dark)]
                                        uppercase
                                        tracking-widest
                                    ">
                                        Featured Reel
                                    </span>

                                </div>

                            </div>

                            {CARDS_DATA.slice(2).map(
                                (card, idx) => (
                                    <CardItem
                                        key={card.id}
                                        card={card}
                                        bgIndex={idx + 2}
                                        isOpen={
                                            openCardId ===
                                            card.id
                                        }
                                        onToggle={() =>
                                            toggleDrawer(
                                                card.id
                                            )
                                        }
                                    />
                                )
                            )}

                        </div>

                        {/* MOBILE DOTS */}

                        <div className="
                            flex
                            lg:hidden
                            items-center
                            justify-center
                            gap-2
                            mt-4
                            z-30
                        ">
                            {CARDS_DATA.map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    aria-label={`Go to slide ${i + 1}`}
                                    onClick={() =>
                                        scrollToSlide(i)
                                    }
                                    className={`
                                        h-2
                                        rounded-full
                                        border-none
                                        transition-[width,opacity,background-color]
                                        duration-300
                                        cursor-pointer
                                        ${activeDot === i
                                            ? `
                                                    w-6
                                                    bg-[var(--color-primary)]
                                                    shadow-[var(--shadow-glow)]
                                                `
                                            : `
                                                    w-2
                                                    bg-[var(--color-slate-700)]
                                                    opacity-30
                                                `
                                        }
                                    `}
                                />
                            ))}
                        </div>

                    </div>

                </div>

                {/* HERO MORPH */}

                <div
                    ref={heroMorphRef}
                    onClick={handleHeroClick}
                    className={`
                        absolute
                        top-0
                        left-0
                        w-full
                        h-full
                        z-20
                        flex
                        items-center
                        justify-center
                        overflow-hidden
                        origin-center
                        invisible
                        select-none
                        group
                        cursor-pointer
                        fy-hero
                        ${isMorphedState
                            ? 'morphed-glow'
                            : ''
                        }
                    `}
                    style={{
                        backgroundImage:
                            "url('/images/dreamback.png')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        willChange: 'transform, opacity',
                    }}
                >

                    <div className="
                        absolute
                        inset-0
                        fy-hero-overlay
                        pointer-events-none
                    " />

                    <div className="
                        absolute
                        inset-0
                        fy-hero-grid
                        pointer-events-none
                    " />

                    <div
                        ref={heroTextContainerRef}
                        className="
                            w-full
                            flex
                            flex-col
                            items-center
                            justify-center
                            px-4
                            z-10
                        "
                    >

                        <div className="
                            flex
                            items-center
                            gap-2
                            mb-2
                        ">
                            <span className="
                                w-2.5
                                h-2.5
                                rounded-full
                                bg-[var(--color-primary)]
                                animate-pulse
                            " />

                            <span className="
                                fy-accent
                                font-bold
                                uppercase
                                tracking-[0.25em]
                                text-xs
                                sm:text-sm
                                md:text-base
                            ">
                                Fit Youness Studio
                            </span>
                        </div>

                        <h2 className="
                            fy-hero-title
                            font-bold
                            text-4xl
                            sm:text-5xl
                            md:text-6xl
                            lg:text-7xl
                            capitalize
                            leading-[1.1]
                            text-center
                        ">
                            You dream it
                            <br />
                            we ship it
                        </h2>

                        <p className="
                            fy-hero-subtitle
                            font-medium
                            text-xs
                            sm:text-sm
                            md:text-base
                            tracking-wider
                            mt-2
                            text-center
                            max-w-md
                        ">
                            High performance digital motion
                            & visual engineering
                        </p>

                        <div
                            ref={heroPlayBtnRef}
                            className="
                                mt-4
                                px-5
                                py-2
                                rounded-full
                                fy-accent-bg
                                font-extrabold
                                text-xs
                                uppercase
                                tracking-wider
                                shadow-[var(--shadow-glow)]
                            "
                        >
                            <span>
                                {isPlaying
                                    ? 'Playing Reel'
                                    : 'Watch Showcase'}
                            </span>
                        </div>

                    </div>

                </div>

                {/* GRID SHATTER */}

                <div
                    ref={gridOverlayRef}
                    className="
                        absolute
                        inset-0
                        w-full
                        h-full
                        pointer-events-none
                        z-30
                        perspective-1000
                        overflow-hidden
                    "
                />

                {/* INITIAL HERO CONTENT */}

                <div
                    ref={heroContentRef}
                    className="
                        absolute
                        inset-0
                        z-40
                        flex
                        flex-col
                        items-center
                        justify-start
                        pt-[14vh]
                        sm:pt-[18vh]
                        text-center
                        px-4
                        pointer-events-none
                    "
                >

                    <div className="
                        inline-flex
                        items-center
                        gap-2
                        px-3.5
                        py-1.5
                        rounded-full
                        fy-pill
                        font-bold
                        text-xs
                        uppercase
                        tracking-wider
                        mb-4
                        backdrop-blur-md
                    ">
                        <span className="
                            w-2
                            h-2
                            rounded-full
                            bg-[var(--color-primary)]
                            animate-pulse
                        " />

                        Scroll to explore
                    </div>

                    <h1 className="
                        fy-main-heading
                        text-3xl
                        sm:text-5xl
                        md:text-6xl
                        lg:text-7xl
                        capitalize
                        leading-[1.1]
                        tracking-tight
                        max-w-4xl
                        mx-auto
                    ">
                        Perfect destination
                        <br />
                        for your needs
                    </h1>

                    <p className="
                        fy-main-description
                        mt-3
                        text-sm
                        sm:text-base
                        md:text-xl
                        font-medium
                        max-w-xl
                        mx-auto
                    ">
                        Transform your body, elevate your mind,
                        and experience fitness redefined.
                    </p>

                </div>

            </section>
        </div>
    );
}

/*
=========================================================
CARD
=========================================================
*/

function CardItem({
    card,
    bgIndex,
    isOpen,
    onToggle,
}) {
    return (
        <div
            className={`
                reel-card-item
                shrink-0
                snap-center
                relative
                rounded-3xl
                overflow-hidden
                cursor-pointer
                select-none
                w-[min(76vw,290px)]
                h-[min(52vh,440px)]
                sm:w-[260px]
                sm:h-[390px]
                md:w-[290px]
                md:h-[430px]
                lg:w-full
                lg:h-[min(55vh,460px)]
                card-bg-${bgIndex}
                glow-effect
            `}
        >

            {/* IMAGE */}

            <div className="
                absolute
                inset-0
                z-10
                flex
                items-center
                justify-center
                p-3
            ">
                <img
                    src={card.img}
                    alt={card.title}
                    loading="lazy"
                    decoding="async"
                    className="
                        w-full
                        h-full
                        object-contain
                        filter
                        drop-shadow-xl
                    "
                />
            </div>

            {/* CARD LABEL */}

            <div
                className={`
                    absolute
                    bottom-4
                    left-4
                    z-20
                    transition-opacity
                    duration-300
                    ${isOpen
                        ? 'opacity-0 pointer-events-none'
                        : 'opacity-100'
                    }
                `}
            >
                <span className="
                    text-[10px]
                    sm:text-xs
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    fy-accent
                ">
                    {card.tag}
                </span>

                <h3 className="
                    text-[var(--color-black)]
                    text-base
                    sm:text-lg
                    font-bold
                    leading-tight
                    mt-0.5
                ">
                    {card.title}
                </h3>
            </div>

            {/* ARROW */}

            <button
                type="button"
                onClick={onToggle}
                aria-label={
                    isOpen
                        ? 'Close details'
                        : 'Open details'
                }
                className={`
                    absolute
                    top-1/2
                    -translate-y-1/2
                    z-30
                    w-11
                    h-11
                    rounded-full
                    backdrop-blur-md
                    flex
                    items-center
                    justify-center
                    shadow-lg
                    transition-[transform,background-color,opacity]
                    duration-300
                    hover:scale-110
                    active:scale-95
                    cursor-pointer
                    ${isOpen
                        ? `
                                left-[calc(82%-1.375rem)]
                                fy-accent-bg
                            `
                        : `
                                right-3
                                bg-white/95
                                text-[var(--color-black)]
                            `
                    }
                `}
            >
                <ChevronRight
                    className={`
                        w-5
                        h-5
                        transition-transform
                        duration-300
                        ${isOpen
                            ? 'rotate-180'
                            : ''
                        }
                    `}
                />
            </button>

            {/* DRAWER */}

            <div
                className={`
                    absolute
                    top-0
                    left-0
                    w-[82%]
                    h-full
                    z-20
                    p-5
                    flex
                    flex-col
                    justify-end
                    fy-card-drawer
                    transition-transform
                    duration-500
                    ease-[cubic-bezier(0.2,0.8,0.2,1)]
                    ${isOpen
                        ? 'translate-x-0'
                        : '-translate-x-full'
                    }
                `}
            >

                <span className="
                    fy-accent
                    text-[11px]
                    uppercase
                    tracking-[0.2em]
                    font-bold
                    mb-1
                ">
                    {card.tag}
                </span>

                <h3 className="
                    text-[var(--color-black)]
                    text-xl
                    font-bold
                    leading-tight
                    mb-2
                ">
                    {card.title}
                </h3>

                <p className="
                    text-[var(--color-slate-700)]
                    text-xs
                    sm:text-sm
                    leading-relaxed
                ">
                    {card.desc}
                </p>

                <div className="
                    mt-4
                    pt-3
                    border-t
                    fy-card-meta
                    flex
                    items-center
                    justify-between
                    text-[11px]
                ">
                    <span className="
                        tracking-wider
                        text-[var(--color-slate-700)]
                    ">
                        FIT YOUNESS
                    </span>

                    <span className="
                        fy-accent
                        font-mono
                        font-bold
                    ">
                        #FY2026
                    </span>
                </div>

            </div>

        </div>
    );
}

