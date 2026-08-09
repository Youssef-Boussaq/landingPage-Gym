import React from 'react';

export default function ProductReviewCard({ review }) {
    return (
        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 transition-colors hover:bg-slate-50">
            <div className="flex items-center justify-between mb-4">
                <div className="font-semibold text-slate-900 font-inter">
                    {review.author}
                </div>
                <div className="text-sm text-slate-500">
                    {review.date}
                </div>
            </div>
            
            <div className="flex text-yellow-400 text-sm mb-3">
                {[...Array(5)].map((_, i) => (
                    <span key={i}>
                        {i < review.rating ? '★' : '☆'}
                    </span>
                ))}
            </div>
            
            <p className="text-slate-600 font-inter text-sm leading-relaxed">
                {review.content}
            </p>
        </div>
    );
}
