import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductGallery({ images = [], activeImage, onImageClick, title = "Product" }) {
    if (!images || images.length === 0) return null;

    // Récupération sécurisée de l'URL d'une image (gère tableau d'objets ou de chaînes)
    const getImageUrl = (img) => (typeof img === 'string' ? img : img?.url);

    // Trouver l'index actuel
    const currentIndex = Math.max(
        0,
        images.findIndex((img) => getImageUrl(img) === activeImage)
    );

    const currentImageUrl = getImageUrl(images[currentIndex]) || activeImage || "/placeholder.svg";

    // Navigation
    const goPrev = () => {
        const prevIndex = (currentIndex - 1 + images.length) % images.length;
        onImageClick(getImageUrl(images[prevIndex]));
    };

    const goNext = () => {
        const nextIndex = (currentIndex + 1) % images.length;
        onImageClick(getImageUrl(images[nextIndex]));
    };

    return (
        <div className="flex w-full flex-col gap-4">
            {/* Main Image Container */}
            <div className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-3xl bg-[#f8f8f8] p-8">
                <img
                    src={currentImageUrl}
                    alt={title}
                    className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                />

                {/* Navigation Buttons */}
                {images.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={goPrev}
                            aria-label="Previous image"
                            className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-neutral-800 shadow-md transition-all hover:scale-105 hover:bg-white hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 active:scale-95"
                        >
                            <ChevronLeft className="h-5 w-5" strokeWidth={2.25} />
                        </button>
                        <button
                            type="button"
                            onClick={goNext}
                            aria-label="Next image"
                            className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-neutral-800 shadow-md transition-all hover:scale-105 hover:bg-white hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 active:scale-95"
                        >
                            <ChevronRight className="h-5 w-5" strokeWidth={2.25} />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                    {images.map((image, index) => {
                        const url = getImageUrl(image);
                        const isActive = url === activeImage || index === currentIndex;

                        return (
                            <button
                                key={index}
                                type="button"
                                onClick={() => onImageClick(url)}
                                aria-label={`View image ${index + 1}`}
                                aria-current={isActive}
                                className={`relative flex h-20 w-20 flex-shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-[#f8f8f8] p-2 transition-all ${isActive
                                    ? "ring-2 ring-black ring-offset-2 ring-offset-white"
                                    : "ring-1 ring-transparent hover:ring-neutral-300"
                                    }`}
                            >
                                <img
                                    src={url || "/placeholder.svg"}
                                    alt={`${title} - Thumbnail ${index + 1}`}
                                    className="h-full w-full object-contain"
                                />
                            </button>
                        );
                    })}

                </div>
            )}
        </div>
    );
}