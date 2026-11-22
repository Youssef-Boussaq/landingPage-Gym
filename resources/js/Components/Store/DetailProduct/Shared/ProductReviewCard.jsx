import React from 'react';
import { Star, CheckCircle2, MessageSquare, ShieldCheck, CornerDownRight } from 'lucide-react';

export default function ProductReviewCard({ review }) {
    if (!review) return null;

    const authorName = review.author || 'Client Fit Youness';
    const authorInitial = authorName.charAt(0).toUpperCase();
    const hasRating = review.rating !== null && review.rating !== undefined && Number(review.rating) > 0;
    const ratingValue = hasRating ? Number(review.rating) : 0;

    return (
        <article className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300">
            <div>
                {/* Header: Author Avatar + Name + Badges + Date */}
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-black text-[var(--color-primary)] shadow-sm">
                            {authorInitial}
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="font-bold text-slate-900 text-sm sm:text-base font-inter">
                                    {authorName}
                                </span>

                                {review.is_verified_purchase && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                        <span>Achat vérifié</span>
                                    </span>
                                )}
                            </div>

                            <span className="text-xs text-slate-400 block mt-0.5">
                                {review.date || 'Récemment'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Star rating (rendered ONLY if customer provided a rating) */}
                {hasRating ? (
                    <div className="flex items-center gap-1.5 mb-2.5">
                        <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-4 h-4 ${
                                        star <= ratingValue
                                            ? 'fill-amber-400 text-amber-400'
                                            : 'text-slate-200'
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-xs font-bold text-slate-700 ml-1">
                            {ratingValue} / 5
                        </span>
                    </div>
                ) : (
                    <div className="mb-2.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            <MessageSquare className="w-3 h-3 text-slate-400" />
                            <span>Retour d'expérience</span>
                        </span>
                    </div>
                )}

                {/* Review Title (only if provided) */}
                {review.title && (
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-1.5 font-inter">
                        {review.title}
                    </h4>
                )}

                {/* Review Message / Content */}
                <p className="text-slate-600 font-inter text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {review.content}
                </p>
            </div>

            {/* Official Admin / Coach Reply */}
            {review.admin_reply && (
                <div className="mt-5 pt-4 border-t border-slate-100">
                    <div className="rounded-xl border-l-4 border-lime-500 bg-slate-50/80 p-4 shadow-2xs">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 uppercase tracking-wider">
                                <ShieldCheck className="w-4 h-4 text-lime-600" />
                                <span>Réponse Fit Youness</span>
                            </div>
                            {review.admin_replied_at && (
                                <span className="text-[11px] text-slate-400">
                                    {review.admin_replied_at}
                                </span>
                            )}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 font-inter leading-relaxed">
                            {review.admin_reply}
                        </p>
                    </div>
                </div>
            )}
        </article>
    );
}
