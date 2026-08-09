import React from 'react';

export default function ProductRating({ rating = 0, count = 0 }) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
        <div className="flex items-center gap-2">
            <div className="flex text-yellow-400 text-lg">
                {[...Array(5)].map((_, i) => (
                    <span key={i}>
                        {i < fullStars ? '★' : (i === fullStars && hasHalfStar ? '★' : '☆')}
                    </span>
                ))}
            </div>
            <span className="text-sm text-slate-500 font-inter mt-1">
                ({count} avis)
            </span>
        </div>
    );
}
