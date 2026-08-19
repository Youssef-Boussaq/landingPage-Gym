import React from 'react';
import { Sparkles, ShoppingBag, Film } from 'lucide-react';
import ProductCarousel from '@/Components/Store/ProductCarousel';

export default function CategoryShowcase({ category, products = [] }) {
    if (!category) return null;

    const categoryName = category.name ?? '';
    const description =
        category.description ??
        `Découvrez notre collection ${categoryName.toLowerCase()}.`;

    // Récupération des médias (limité aux 3 premiers items)
    const rawMedia = Array.isArray(category.media) ? category.media.filter((m) => m?.url) : [];

    // Remplissage automatique pour toujours garantir 3 emplacements
    const displayMedia = [...rawMedia];
    while (displayMedia.length > 0 && displayMedia.length < 3) {
        displayMedia.push(rawMedia[displayMedia.length % rawMedia.length]);
    }

    return (
        <section className="w-full space-y-8 sm:space-y-12 py-4 font-inter text-slate-900 dark:text-slate-100">
            {/* En-tête Catégorie */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center text-center">
                    <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-xs font-bold tracking-wider text-slate-800 uppercase border border-slate-200/80 dark:bg-slate-800/80 dark:border-slate-700/80 dark:text-slate-200">
                        <Sparkles className="w-3.5 h-3.5 text-[#9de500]" />
                        Collection
                    </span>

                    <h2 className="font-archivo text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl text-slate-900 dark:text-white uppercase">
                        {categoryName}
                    </h2>

                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
                        {description}
                    </p>

                    <div className="mt-5 flex items-center justify-center gap-2">
                        <div className="h-0.5 w-12 rounded-full bg-slate-200 dark:bg-slate-800" />
                        <div className="h-2.5 w-2.5 rounded-full bg-[#9de500] shadow-sm shadow-[#9de500]/50" />
                        <div className="h-0.5 w-12 rounded-full bg-slate-200 dark:bg-slate-800" />
                    </div>
                </div>
            </div>

            {/* Vitrine 3 Images en Slashes (Séparations Inclinées & Accordéon) */}
            <div className="w-full overflow-hidden bg-slate-950 border-y border-slate-800/80 shadow-2xl py-2">
                {displayMedia.length >= 3 ? (
                    <div className="flex w-full h-[380px] sm:h-[480px] lg:h-[580px] gap-1 sm:gap-2 px-2">
                        {displayMedia.slice(0, 3).map((item, index) => {
                            const isVideo = (item.type ?? 'image') === 'video';

                            return (
                                <div
                                    key={item.id ?? index}
                                    className="group relative h-full flex-1 transition-all duration-700 ease-out hover:flex-[1.8] overflow-hidden cursor-pointer -skew-x-6 sm:-skew-x-12 border-r-2 sm:border-r-4 border-slate-950 last:border-r-0"
                                >
                                    {/* Conteneur Annulation Inclinaison Image */}
                                    <div className="absolute inset-0 h-full w-[140%] -left-[20%] skew-x-6 sm:skew-x-12">
                                        {isVideo ? (
                                            <video
                                                src={item.url}
                                                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                                autoPlay
                                                muted
                                                loop
                                                playsInline
                                            />
                                        ) : (
                                            <img
                                                src={item.url}
                                                alt={item.alt_text ?? item.alt ?? categoryName}
                                                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                                loading="lazy"
                                            />
                                        )}

                                        {/* Gradation Sombre / Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent transition-opacity duration-300 group-hover:opacity-60" />
                                    </div>

                                    {/* Ligne Néon / Slash Lumineux au Survol */}
                                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#9de500] opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_15px_#9de500]" />

                                    {/* Numéro et Label au bas de chaque tranche */}
                                    <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10 skew-x-6 sm:skew-x-12 flex items-center gap-2">
                                        <span className="font-archivo text-2xl sm:text-4xl font-black text-[#9de500] drop-shadow-md">
                                            0{index + 1}
                                        </span>
                                        <div className="hidden sm:flex flex-col">
                                            <span className="font-archivo text-xs uppercase tracking-wider text-white">
                                                {categoryName}
                                            </span>
                                            {isVideo && (
                                                <span className="inline-flex items-center gap-1 text-[10px] text-[#9de500] font-bold uppercase">
                                                    <Film className="w-3 h-3" /> Vidéo
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex h-[250px] w-full items-center justify-center text-slate-500 text-sm">
                        Aucun visuel disponible
                    </div>
                )}
            </div>

            {/* Section Produits */}
            {products.length > 0 && (
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">
                                <ShoppingBag className="w-5 h-5 text-[#9de500]" />
                            </div>
                            <h3 className="font-archivo text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                                Produits
                            </h3>
                            <span className="rounded-full bg-[#9de500]/15 px-3 py-0.5 text-xs font-bold text-slate-900 dark:text-[#9de500] border border-[#9de500]/30">
                                {products.length}
                            </span>
                        </div>
                    </div>

                    <ProductCarousel products={products} />
                </div>
            )}
        </section>
    );
}