import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/Components/Store/ProductCard';

export default function ProductCarousel({
    products = [],
    isFilterOpen = false,
}) {
    const carouselRef = useRef(null);

    if (products.length === 0) {
        return (
            <div className="border border-stone-200 bg-white p-8 text-center text-xs text-stone-500 rounded-none tracking-[0.025em]">
                Aucun produit à afficher pour l'instant.
            </div>
        );
    }

    const scroll = (direction) => {
        if (!carouselRef.current) return;
        const container = carouselRef.current;
        const amount = container.clientWidth * 0.85;

        container.scrollBy({
            left: direction === 'next' ? amount : -amount,
            behavior: 'smooth',
        });
    };

    return (
        <div className="relative w-full group/carousel">
            {/* ARROW PREVIOUS */}
            {products.length > 2 && (
                <button
                    type="button"
                    onClick={() => scroll('prev')}
                    aria-label="Produits précédents"
                    className="absolute -left-3 top-1/3 -translate-y-1/2 z-10 hidden sm:flex h-9 w-9 items-center justify-center rounded-[4px] bg-white border border-black text-black transition-colors hover:bg-black hover:text-white"
                >
                    <ChevronLeft className="h-4 w-4 stroke-[2]" />
                </button>
            )}

            {/* CAROUSEL CONTAINER */}
            <div
                ref={carouselRef}
                className="flex w-full gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 no-scrollbar"
            >
                {products.map((product) => (
                    <div
                        key={product.id}
                        className={`flex-shrink-0 snap-start w-[85%] sm:w-[48%] ${
                            isFilterOpen
                                ? 'lg:w-[31%]'
                                : 'md:w-[31%] lg:w-[23.5%]'
                        }`}
                    >
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>

            {/* ARROW NEXT */}
            {products.length > 2 && (
                <button
                    type="button"
                    onClick={() => scroll('next')}
                    aria-label="Produits suivants"
                    className="absolute -right-3 top-1/3 -translate-y-1/2 z-10 hidden sm:flex h-9 w-9 items-center justify-center rounded-[4px] bg-white border border-black text-black transition-colors hover:bg-black hover:text-white"
                >
                    <ChevronRight className="h-4 w-4 stroke-[2]" />
                </button>
            )}
        </div>
    );
}
