import React from 'react';

export default function ProductDetailLayout({ gallery, info, details, reviews }) {
    return (
        <div className="w-full min-h-screen font-inter py-6 sm:py-10 text-slate-900 dark:text-slate-100">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Disposition 2 colonnes sans cartes */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 items-start">

                    {/* Colonne Gauche : Galerie */}
                    <div className="lg:col-span-7">
                        {gallery}
                    </div>

                    {/* Colonne Droite : Infos & Actions */}
                    <div className="flex flex-col gap-6 lg:col-span-5">
                        {info}
                        {details}
                    </div>
                </div>

                {/* Section Basse : Avis Clients */}
                {reviews && (
                    <div className="mt-16 border-t border-slate-200/60 pt-10 dark:border-slate-800/80">
                        {reviews}
                    </div>
                )}
            </div>
        </div>
    );
}