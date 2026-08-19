import React from 'react';
import { Star } from 'lucide-react';

export default function ProductRating({ rating = 0, count = 0 }) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
        <div className="flex items-center gap-2.5">
            {/* Étoiles vectorielles Lucide */}
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => {
                    const isFull = i < fullStars;
                    const isHalf = i === fullStars && hasHalfStar;

                    return (
                        <div key={i} className="relative">
                            <Star className={`w-4 h-4 ${isFull
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-200 dark:text-slate-700'
                                }`} />
                            {isHalf && (
                                <div className="absolute inset-0 overflow-hidden w-[50%]">
                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Note numérique & nombre d'avis */}
            <div className="flex items-center gap-1.5 font-inter text-xs sm:text-sm">
                <span className="font-bold text-slate-900 dark:text-white">
                    {Number(rating).toFixed(1)}
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                    ({count} {count > 1 ? 'avis' : 'avis'})
                </span>
            </div>
        </div>
    );
}