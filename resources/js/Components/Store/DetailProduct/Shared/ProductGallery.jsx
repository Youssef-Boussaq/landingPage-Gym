import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductGallery({
    images = [],
    activeImage,
    onImageClick,
    title = 'Product',
}) {
    if (!images || images.length === 0) return null;

    // Récupération sécurisée de l'URL d'une image (gère tableau d'objets ou de chaînes)
    const getImageUrl = (img) => (typeof img === 'string' ? img : img?.url);

    // Trouver l'index actuel
    const currentIndex = Math.max(
        0,
        images.findIndex((img) => getImageUrl(img) === activeImage)
    );

    const currentImageUrl =
        getImageUrl(images[currentIndex]) || activeImage || '/placeholder.svg';

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
            {/* Conteneur d'image principale - Lookbook 0px */}
            <div className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-none border border-[#e5e7eb] bg-white p-6 sm:p-10 transition-colors">
                <img
                    src={currentImageUrl}
                    alt={title}
                    className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                />

                {/* Badge de compteur d'images */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 right-4 rounded-none border border-[#000000] bg-white px-2 py-0.5 text-[10px] font-medium tracking-[0.05em] text-[#000000]">
                        <span>{currentIndex + 1}</span> / {images.length}
                    </div>
                )}

                {/* Boutons de navigation flottants */}
                {images.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={goPrev}
                            aria-label="Image précédente"
                            className="absolute left-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-[4px] border border-[#000000] bg-white text-[#000000] transition-colors hover:bg-[#000000] hover:text-white"
                        >
                            <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                        <button
                            type="button"
                            onClick={goNext}
                            aria-label="Image suivante"
                            className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-[4px] border border-[#000000] bg-white text-[#000000] transition-colors hover:bg-[#000000] hover:text-white"
                        >
                            <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                    </>
                )}
            </div>

            {/* Galerie de vignettes (Thumbnails) */}
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1 pt-0.5">
                    {images.map((image, index) => {
                        const url = getImageUrl(image);
                        const isActive =
                            url === activeImage || index === currentIndex;

                        return (
                            <button
                                key={index}
                                type="button"
                                onClick={() => onImageClick(url)}
                                aria-label={`Voir image ${index + 1}`}
                                aria-current={isActive}
                                className={`relative flex h-18 w-18 flex-shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-none p-2 bg-white transition-all ${isActive
                                        ? 'border-2 border-[#000000]'
                                        : 'border border-[#e5e7eb] opacity-60 hover:opacity-100 hover:border-[#000000]'
                                    }`}
                            >
                                <img
                                    src={url || '/placeholder.svg'}
                                    alt={`${title} - Vignette ${index + 1}`}
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