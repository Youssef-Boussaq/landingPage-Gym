import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import ProductReviewCard from './ProductReviewCard';
import {
    Star,
    MessageSquare,
    Plus,
    X,
    CheckCircle2,
    AlertCircle,
    Send,
    HelpCircle,
    Sparkles,
} from 'lucide-react';

export default function ProductReviews({ product = {}, reviews = [], stats = {} }) {
    const { auth, flash } = usePage().props;
    const currentUser = auth?.user;

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [filterTab, setFilterTab] = useState('all'); // 'all' | 'rated' | 'unrated'

    // Form initialization
    const { data, setData, post, processing, errors, reset } = useForm({
        reviewer_name:  currentUser?.name ?? '',
        reviewer_email: currentUser?.email ?? '',
        rating:         null, // optional: null | 1 | 2 | 3 | 4 | 5
        title:          '',
        comment:        '',
    });

    const hasRatings = Boolean(stats?.has_ratings && stats?.ratings_count > 0);
    const totalReviews = stats?.total_reviews ?? reviews.length;
    const ratingsCount = stats?.ratings_count ?? 0;
    const unratedCount = stats?.unrated_count ?? (totalReviews - ratingsCount);
    const averageRating = hasRatings ? Number(stats?.average_rating ?? 0).toFixed(1) : null;
    const distribution = stats?.distribution ?? { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    const distributionPercentages = stats?.distribution_percentages ?? { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    // Filter reviews list
    const filteredReviews = reviews.filter((review) => {
        const isRated = review.rating !== null && review.rating !== undefined && Number(review.rating) > 0;
        if (filterTab === 'rated') return isRated;
        if (filterTab === 'unrated') return !isRated;
        return true;
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('store.products.reviews.store', product.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset('rating', 'title', 'comment');
                if (!currentUser) {
                    reset('reviewer_name', 'reviewer_email');
                }
                setIsFormOpen(false);
            },
        });
    };

    return (
        <section className="space-y-8 pt-6 border-t border-slate-200/80">
            {/* Header & Main Call to Action */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black font-archivo text-slate-900 tracking-tight">
                        Avis & Retours Clients
                    </h2>
                    <p className="text-sm text-slate-500 mt-1 font-inter">
                        Partagez votre expérience réelle d'entraînement et d'utilisation de nos produits.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setIsFormOpen((prev) => !prev)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-[var(--color-primary)] shadow-md transition-all hover:bg-slate-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                    {isFormOpen ? (
                        <>
                            <X className="w-4 h-4" />
                            <span>Fermer le formulaire</span>
                        </>
                    ) : (
                        <>
                            <Plus className="w-4 h-4" />
                            <span>Donner mon avis / Message</span>
                        </>
                    )}
                </button>
            </div>

            {/* Flash success notice */}
            {flash?.success && (
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-emerald-900 shadow-xs animate-in fade-in">
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                    <p className="text-sm font-medium">{flash.success}</p>
                </div>
            )}

            {/* Collapsible Review Form */}
            {isFormOpen && (
                <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6 sm:p-8 shadow-inner transition-all">
                    <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-100 text-lime-800">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black font-archivo text-slate-900">
                                    Votre avis compte pour nous
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Une note étoilée est facultative. Vous pouvez laisser un message écrit uniquement.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsFormOpen(false)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* 1. Star rating selector (OPTIONAL) */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-slate-800 font-inter">
                                        Note par étoiles{' '}
                                        <span className="text-slate-400 font-normal lowercase">(optionnelle)</span>
                                    </label>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Cliquez sur une étoile pour noter, ou laissez vide pour envoyer uniquement votre message.
                                    </p>
                                </div>

                                {data.rating && (
                                    <button
                                        type="button"
                                        onClick={() => setData('rating', null)}
                                        className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline w-fit"
                                    >
                                        Effacer la note (message seul)
                                    </button>
                                )}
                            </div>

                            {/* Interactive Star Row */}
                            <div className="flex items-center gap-2 mt-3.5">
                                {[1, 2, 3, 4, 5].map((star) => {
                                    const activeScore = hoveredStar || data.rating || 0;
                                    const isFilled = star <= activeScore;

                                    return (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setData('rating', star)}
                                            onMouseEnter={() => setHoveredStar(star)}
                                            onMouseLeave={() => setHoveredStar(0)}
                                            className="p-1 rounded-lg transition-transform hover:scale-115 focus:outline-none"
                                            title={`${star} étoile${star > 1 ? 's' : ''}`}
                                        >
                                            <Star
                                                className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                                                    isFilled
                                                        ? 'fill-amber-400 text-amber-400'
                                                        : 'text-slate-200 hover:text-amber-300'
                                                }`}
                                            />
                                        </button>
                                    );
                                })}

                                <span className="ml-2 text-sm font-bold text-slate-700">
                                    {data.rating ? `${data.rating} / 5 étoiles` : 'Aucune note sélectionnée'}
                                </span>
                            </div>

                            {errors.rating && (
                                <p className="mt-2 text-xs font-semibold text-rose-600">{errors.rating}</p>
                            )}
                        </div>

                        {/* 2. Reviewer Name & Email */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                                    Votre nom ou prénom *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.reviewer_name}
                                    onChange={(e) => setData('reviewer_name', e.target.value)}
                                    placeholder="Ex: Youssef B."
                                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-lime-500 focus:ring-2 focus:ring-lime-100"
                                />
                                {errors.reviewer_name && (
                                    <p className="mt-1 text-xs font-semibold text-rose-600">{errors.reviewer_name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                                    Email{' '}
                                    <span className="text-slate-400 font-normal lowercase">(pour badge achat vérifié)</span>
                                </label>
                                <input
                                    type="email"
                                    value={data.reviewer_email}
                                    onChange={(e) => setData('reviewer_email', e.target.value)}
                                    placeholder="votre-email@exemple.com"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-lime-500 focus:ring-2 focus:ring-lime-100"
                                />
                                {errors.reviewer_email && (
                                    <p className="mt-1 text-xs font-semibold text-rose-600">{errors.reviewer_email}</p>
                                )}
                            </div>
                        </div>

                        {/* 3. Review Title (Optional) */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                                Titre de votre retour{' '}
                                <span className="text-slate-400 font-normal lowercase">(optionnel)</span>
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Ex: Excellente qualité et digestion facile"
                                maxLength={150}
                                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-lime-500 focus:ring-2 focus:ring-lime-100"
                            />
                            {errors.title && (
                                <p className="mt-1 text-xs font-semibold text-rose-600">{errors.title}</p>
                            )}
                        </div>

                        {/* 4. Review Comment (REQUIRED) */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                                Votre message / expérience *
                            </label>
                            <textarea
                                required
                                rows={4}
                                value={data.comment}
                                onChange={(e) => setData('comment', e.target.value)}
                                placeholder="Partagez votre retour d'expérience avec ce produit : goût, résultats, confort d'entraînement, conseils..."
                                maxLength={2000}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-lime-500 focus:ring-2 focus:ring-lime-100"
                            />
                            <div className="flex justify-between items-center mt-1">
                                {errors.comment ? (
                                    <p className="text-xs font-semibold text-rose-600">{errors.comment}</p>
                                ) : (
                                    <span className="text-[11px] text-slate-400">Minimum 5 caractères.</span>
                                )}
                                <span className="text-[11px] text-slate-400">
                                    {data.comment.length} / 2000
                                </span>
                            </div>
                        </div>

                        {/* Submit Actions */}
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsFormOpen(false)}
                                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100 transition"
                            >
                                Annuler
                            </button>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-xl bg-lime-500 px-6 py-2.5 text-sm font-black text-slate-950 shadow-md transition hover:bg-lime-400 hover:shadow-lime-200 disabled:opacity-50"
                            >
                                <Send className="w-4 h-4" />
                                <span>{processing ? 'Envoi en cours...' : 'Envoyer mon avis'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Statistics & Distribution Breakdown */}
            {hasRatings ? (
                <div className="grid gap-6 sm:grid-cols-12 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
                    {/* Overall Score */}
                    <div className="sm:col-span-5 flex flex-col justify-center items-center text-center sm:border-r sm:border-slate-100 sm:pr-8">
                        <span className="text-5xl sm:text-6xl font-black font-archivo text-slate-900 tracking-tight">
                            {averageRating}
                        </span>
                        <div className="flex items-center gap-1 mt-2 text-amber-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-5 h-5 ${
                                        star <= Math.round(Number(averageRating))
                                            ? 'fill-amber-400 text-amber-400'
                                            : 'text-slate-200'
                                    }`}
                                />
                            ))}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-2">
                            Basé sur {ratingsCount} note{ratingsCount > 1 ? 's' : ''} étoilée{ratingsCount > 1 ? 's' : ''}
                        </p>
                        {unratedCount > 0 && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                                <MessageSquare className="w-3 h-3 text-lime-600" />
                                <span>+ {unratedCount} retour{unratedCount > 1 ? 's' : ''} sans note</span>
                            </span>
                        )}
                    </div>

                    {/* Progress Bars by Star */}
                    <div className="sm:col-span-7 flex flex-col justify-center space-y-2 sm:pl-4">
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = distribution[star] ?? 0;
                            const percentage = distributionPercentages[star] ?? 0;

                            return (
                                <div key={star} className="flex items-center gap-3 text-xs">
                                    <span className="flex items-center gap-1 w-10 font-bold text-slate-700">
                                        <span>{star}</span>
                                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                    </span>
                                    <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                                        <div
                                            className="h-full bg-lime-500 rounded-full transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="w-12 text-right tabular-nums text-slate-400 font-medium">
                                        {count} ({percentage}%)
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : totalReviews > 0 ? (
                /* Reviews exist, but no ratings were given */
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 flex items-center gap-3 text-slate-700">
                    <MessageSquare className="w-5 h-5 text-lime-600 shrink-0" />
                    <p className="text-sm">
                        <strong className="text-slate-900">{totalReviews} retour{totalReviews > 1 ? 's' : ''} d'expérience</strong>{' '}
                        partagé{totalReviews > 1 ? 's' : ''} par nos clients (sans note chiffrée par étoiles).
                    </p>
                </div>
            ) : null}

            {/* Filter Tabs & Review Cards */}
            <div className="space-y-4">
                {totalReviews > 0 && (
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setFilterTab('all')}
                                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                                    filterTab === 'all'
                                        ? 'bg-slate-900 text-white'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                Tous ({totalReviews})
                            </button>

                            {ratingsCount > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setFilterTab('rated')}
                                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                                        filterTab === 'rated'
                                            ? 'bg-slate-900 text-white'
                                            : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                                >
                                    Avec note ({ratingsCount})
                                </button>
                            )}

                            {unratedCount > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setFilterTab('unrated')}
                                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                                        filterTab === 'unrated'
                                            ? 'bg-slate-900 text-white'
                                            : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                                >
                                    Messages seuls ({unratedCount})
                                </button>
                            )}
                        </div>

                        <span className="text-xs text-slate-400">
                            {filteredReviews.length} affiché{filteredReviews.length > 1 ? 's' : ''}
                        </span>
                    </div>
                )}

                {/* Reviews Grid */}
                {filteredReviews.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {filteredReviews.map((review) => (
                            <ProductReviewCard key={review.id} review={review} />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center">
                        <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <h4 className="text-base font-bold text-slate-800">
                            {totalReviews === 0
                                ? 'Aucun avis pour ce produit pour le moment.'
                                : 'Aucun avis ne correspond à ce filtre.'}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                            {totalReviews === 0
                                ? 'Soyez le premier à partager votre ressenti, avec ou sans note étoilée !'
                                : 'Essayez de sélectionner un autre onglet pour afficher les retours clients.'}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
