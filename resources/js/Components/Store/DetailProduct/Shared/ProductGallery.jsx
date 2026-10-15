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
            {/* Conteneur d'image principale - Sans fond ni bordure */}
            <div className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-3xl p-6 sm:p-10 transition-all duration-300">
                <img
                    src={currentImageUrl}
                    alt={title}
                    className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                />

                {/* Badge de compteur d'images */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 right-4 rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-[11px] font-bold text-slate-700 backdrop-blur-md shadow-sm dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-300">
                        <span className="text-[var(--color-primary)]">{currentIndex + 1}</span> / {images.length}
                    </div>
                )}

                {/* Boutons de navigation flottants */}
                {images.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={goPrev}
                            aria-label="Image précédente"
                            className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/80 bg-white/90 text-slate-800 shadow-md backdrop-blur-md transition-all duration-200 hover:scale-110 hover:border-[var(--color-primary)] hover:bg-white active:scale-95 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:border-[var(--color-primary)] dark:hover:bg-slate-900"
                        >
                            <ChevronLeft className="h-5 w-5" strokeWidth={2.25} />
                        </button>
                        <button
                            type="button"
                            onClick={goNext}
                            aria-label="Image suivante"
                            className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/80 bg-white/90 text-slate-800 shadow-md backdrop-blur-md transition-all duration-200 hover:scale-110 hover:border-[var(--color-primary)] hover:bg-white active:scale-95 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:border-[var(--color-primary)] dark:hover:bg-slate-900"
                        >
                            <ChevronRight className="h-5 w-5" strokeWidth={2.25} />
                        </button>
                    </>
                )}
            </div>

            {/* Galerie de vignettes (Thumbnails) - Sans fond ni bordures par défaut */}
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
                                className={`relative flex h-20 w-20 flex-shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-2xl p-2 transition-all duration-200 ${isActive
                                        ? 'border-2 border-[var(--color-primary)] scale-95 opacity-100'
                                        : 'border-2 border-transparent opacity-60 hover:opacity-100'
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