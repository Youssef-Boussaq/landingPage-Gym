import React from 'react';
import { ArrowRight, Play } from 'lucide-react';

import ProductCarousel from './ProductCarousel';

export default function CategoryShowcase({
    category,
    products = [],
}) {
    const primaryMedia = category?.media?.find(
        (media) => media.is_primary
    );

    const videoMedia =
        primaryMedia?.type === 'video'
            ? primaryMedia
            : category?.media?.find(
                (media) => media.type === 'video'
            );

    const videoUrl = videoMedia?.url;

    if (!category) {
        return null;
    }

    return (
        <section className="relative w-full overflow-hidden bg-white">

            {/* =====================================================
                FULL WIDTH VIDEO
            ====================================================== */}
            <div className="relative w-full px-2 sm:px-3 lg:px-4">
                <div
                    className="
                        group
                        relative
                        isolate
                        w-full
                        overflow-hidden

                        rounded-[18px]
                        border
                        border-black/[0.08]

                        bg-neutral-100

                        shadow-[0_20px_60px_rgba(0,0,0,0.08)]

                        sm:rounded-[22px]
                        lg:rounded-[28px]

                        transform-gpu
                    "
                >

                    {/* =================================================
                        VIDEO
                    ================================================== */}
                    {videoUrl ? (
                        <div
                            className="
                                relative
                                aspect-video
                                w-full
                                overflow-hidden

                                transform-gpu
                            "
                        >
                            <video
                                src={videoUrl}
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="metadata"
                                aria-label={category.name}
                                className="
                                    absolute
                                    inset-0

                                    block
                                    h-full
                                    w-full

                                    object-cover
                                    object-center

                                    transform-gpu
                                    backface-hidden

                                    will-change-transform

                                    transition-transform
                                    duration-700
                                    ease-[cubic-bezier(0.22,1,0.36,1)]

                                    group-hover:scale-[1.015]
                                "
                            />
                        </div>
                    ) : (
                        <div
                            className="
                                flex
                                aspect-video
                                w-full
                                items-center
                                justify-center
                                bg-neutral-100
                            "
                        >
                            <div className="text-center">
                                <Play
                                    className="
                                        mx-auto
                                        mb-4
                                        h-10
                                        w-10
                                        text-black/20
                                    "
                                />

                                <p
                                    className="
                                        text-xs
                                        font-medium
                                        uppercase
                                        tracking-[0.25em]
                                        text-black/40
                                    "
                                >
                                    {category.name}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* =================================================
                        CINEMATIC OVERLAY
                    ================================================== */}
                    <div
                        className="
                            pointer-events-none
                            absolute
                            inset-0
                            z-[1]

                            bg-gradient-to-t
                            from-black/75
                            via-black/20
                            to-transparent
                        "
                    />

                    {/* =================================================
                        SIDE ATMOSPHERE
                    ================================================== */}
                    <div
                        className="
                            pointer-events-none
                            absolute
                            inset-0
                            z-[1]

                            bg-gradient-to-r
                            from-black/25
                            via-transparent
                            to-transparent

                            opacity-70
                        "
                    />

                    {/* =================================================
                        TOP BORDER ACCENT
                    ================================================== */}
                    <div
                        className="
                            pointer-events-none
                            absolute
                            inset-x-0
                            top-0
                            z-20
                            h-px

                            bg-white/30
                        "
                    />

                    {/* =================================================
                        VIDEO CONTENT
                    ================================================== */}
                    <div
                        className="
                            absolute
                            inset-x-0
                            bottom-0
                            z-10
                        "
                    >
                        <div
                            className="
                                mx-auto
                                w-full
                                max-w-[1600px]

                                px-5
                                pb-8

                                sm:px-8
                                sm:pb-10

                                md:px-10
                                md:pb-12

                                lg:px-14
                                lg:pb-16

                                xl:px-20
                                xl:pb-20
                            "
                        >
                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-6

                                    md:flex-row
                                    md:items-end
                                    md:justify-between
                                "
                            >

                                {/* =================================================
                                    CATEGORY TITLE
                                ================================================== */}
                                <div className="max-w-4xl">
                                    <p
                                        className="
                                            mb-3
                                            text-[10px]
                                            font-semibold
                                            uppercase
                                            tracking-[0.35em]
                                            text-white/70

                                            sm:text-xs
                                        "
                                    >
                                        Fit Youness Store
                                    </p>

                                    <h2
                                        className="
                                            font-archivo
                                            text-5xl
                                            font-black
                                            uppercase
                                            leading-[0.88]
                                            tracking-[-0.045em]
                                            text-white

                                            sm:text-6xl

                                            md:text-7xl

                                            lg:text-8xl

                                            xl:text-[clamp(5rem,9vw,10rem)]
                                        "
                                    >
                                        {category.name}
                                    </h2>
                                </div>

                                {/* =================================================
                                    CTA
                                ================================================== */}
                                <a
                                    href={`/store/category/${category.slug}`}
                                    className="
                                        group/cta

                                        inline-flex
                                        w-fit
                                        shrink-0
                                        items-center
                                        gap-3

                                        rounded-full

                                        bg-[var(--color-primary)]

                                        px-5
                                        py-3

                                        text-xs
                                        font-bold
                                        uppercase
                                        tracking-[0.12em]
                                        text-black

                                        transform-gpu

                                        transition-transform
                                        duration-300
                                        ease-out

                                        hover:scale-105
                                    "
                                >
                                    <span>
                                        Explore collection
                                    </span>

                                    <span
                                        className="
                                            flex
                                            h-7
                                            w-7
                                            items-center
                                            justify-center

                                            rounded-full
                                            bg-black
                                            text-white

                                            transform-gpu

                                            transition-transform
                                            duration-300

                                            group-hover/cta:translate-x-1
                                        "
                                    >
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* =====================================================
                PRODUCTS
            ====================================================== */}
            {products.length > 0 && (
                <div
                    className="
                        mx-auto
                        w-full
                        max-w-[1600px]

                        px-5
                        py-14

                        sm:px-8
                        sm:py-16

                        md:px-10
                        md:py-20

                        lg:px-14
                        lg:py-24

                        xl:px-20
                    "
                >

                    {/* =================================================
                        PRODUCTS HEADER
                    ================================================== */}
                    <div
                        className="
                            mb-8
                            flex
                            items-end
                            justify-between
                            gap-6

                            md:mb-10
                        "
                    >
                        <div>
                            <p
                                className="
                                    mb-2
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.3em]
                                    text-black/40
                                "
                            >
                                Shop
                            </p>

                            <h3
                                className="
                                    font-archivo
                                    text-2xl
                                    font-black
                                    uppercase
                                    tracking-tight
                                    text-black

                                    sm:text-3xl

                                    md:text-4xl
                                "
                            >
                                {category.name}
                            </h3>
                        </div>

                        <a
                            href={`/store/category/${category.slug}`}
                            className="
                                group
                                hidden
                                items-center
                                gap-2

                                text-xs
                                font-semibold
                                uppercase
                                tracking-[0.15em]
                                text-black

                                sm:inline-flex
                            "
                        >
                            View all

                            <ArrowRight
                                className="
                                    h-4
                                    w-4

                                    transform-gpu

                                    transition-transform
                                    duration-300

                                    group-hover:translate-x-1
                                "
                            />
                        </a>
                    </div>

                    {/* =================================================
                        PRODUCT CAROUSEL
                    ================================================== */}
                    <ProductCarousel products={products} />
                </div>
            )}
        </section>
    );
}