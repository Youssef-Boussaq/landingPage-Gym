import React from 'react';
import { Star, MessageSquare } from 'lucide-react';

export default function ProductRating({ rating = null, count = 0, ratingsCount = 0 }) {
    const hasNumericRating = ratingsCount > 0 && rating !== null && Number(rating) > 0;
    const numericRating = hasNumericRating ? Number(rating) : 0;
    const fullStars = Math.floor(numericRating);
    const hasHalfStar = numericRating % 1 >= 0.5;

    // Case 1: Actual ratings exist (with stars)
    if (hasNumericRating) {
        return (
            <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => {
                        const isFull = i < fullStars;
                        const isHalf = i === fullStars && hasHalfStar;

                        return (
                            <div key={i} className="relative">
                                <Star
                                    className={`w-4 h-4 ${
                                        isFull
                                            ? 'fill-amber-400 text-amber-400'
                                            : 'text-slate-200 dark:text-slate-700'
                                    }`}
                                />
                                {isHalf && (
                                    <div className="absolute inset-0 overflow-hidden w-[50%]">
                                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="flex items-center gap-1.5 font-inter text-xs sm:text-sm">
                    <span className="font-bold text-slate-900 dark:text-white">
                        {numericRating.toFixed(1)}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                        ({count} {count > 1 ? 'avis' : 'avis'})
                    </span>
                </div>
            </div>
        );
    }

    // Case 2: Customer messages/reviews exist, but no star ratings were given
    if (count > 0) {
        return (
            <div className="flex items-center gap-1.5 font-inter text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                <MessageSquare className="w-3.5 h-3.5 text-lime-600" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {count} {count > 1 ? 'retours clients' : 'retour client'}
                </span>
                <span className="text-xs text-slate-400">(sans note chiffrée)</span>
            </div>
        );
    }

    // Case 3: No reviews yet
    return (
        <div className="flex items-center gap-1.5 font-inter text-xs text-slate-400">
            <span className="italic">Aucun avis pour le moment</span>
        </div>
    );
}
