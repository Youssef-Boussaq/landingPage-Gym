import React, { useRef } from 'react';
import ProductCard from '@/Components/Store/ProductCard';

export default function ProductCarousel({
    products = [],
    isFilterOpen = false,
}) {
    const carouselRef = useRef(null);

    if (products.length === 0) {
        return (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
                Aucun produit à afficher pour l'instant.
            </div>
        );
    }

    const scroll = (direction) => {
        if (!carouselRef.current) {
            return;
        }

        const container = carouselRef.current;

        const amount = container.clientWidth * 0.85;

        container.scrollBy({
            left: direction === 'next' ? amount : -amount,
            behavior: 'smooth',
        });
    };

    return (
        <div className="relative w-full">

            {/* =====================================================
                ARROW - PREVIOUS
            ====================================================== */}

            {products.length > 1 && (
                <button
                    type="button"
                    onClick={() => scroll('prev')}
                    aria-label="Previous products"
                    className="
                        absolute
                        left-2
                        top-1/2
                        -translate-y-1/2
                        z-10

                        flex
                        h-10
                        w-10
                        items-center
                        justify-center

                        rounded-full
                        bg-white
                        border
                        border-slate-200
                        shadow-lg

                        text-slate-900

                        transition-all
                        duration-200

                        hover:bg-slate-900
                        hover:text-white
                        hover:scale-105

                        focus:outline-none
                        focus:ring-2
                        focus:ring-slate-300

                        sm:left-3
                    "
                >
                    ←
                </button>
            )}

            {/* =====================================================
                CAROUSEL
            ====================================================== */}

            <div
                ref={carouselRef}
                className="
                    flex
                    w-full
                    gap-4
                    overflow-x-auto
                    scroll-smooth
                    snap-x
                    snap-mandatory

                    pb-4

                    scrollbar-hide

                    [&::-webkit-scrollbar]:hidden
                    [-ms-overflow-style:none]
                    [scrollbar-width:none]
                "
            >

                {products.map((product) => (
                    <div
                        key={product.id}
                        className={`
                            flex-shrink-0
                            snap-start

                            w-[82%]
                            sm:w-[48%]

                            ${isFilterOpen
                                ? 'lg:w-[31%]'
                                : 'md:w-[31%] lg:w-[24%]'
                            }
                        `}
                    >
                        <ProductCard product={product} />
                    </div>
                ))}

            </div>

            {/* =====================================================
                ARROW - NEXT
            ====================================================== */}

            {products.length > 1 && (
                <button
                    type="button"
                    onClick={() => scroll('next')}
                    aria-label="Next products"
                    className="
                        absolute
                        right-2
                        top-1/2
                        -translate-y-1/2
                        z-10

                        flex
                        h-10
                        w-10
                        items-center
                        justify-center

                        rounded-full
                        bg-white
                        border
                        border-slate-200
                        shadow-lg

                        text-slate-900

                        transition-all
                        duration-200

                        hover:bg-slate-900
                        hover:text-white
                        hover:scale-105

                        focus:outline-none
                        focus:ring-2
                        focus:ring-slate-300

                        sm:right-3
                    "
                >
                    →
                </button>
            )}

        </div>
    );
}