import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import AdminBreadcrumbs from '@/Components/Admin/AdminBreadcrumbs';
import AdminStatCard from '@/Components/Admin/AdminStatCard';
import AdminStatusBadge from '@/Components/Admin/AdminStatusBadge';
import AdminPagination from '@/Components/Admin/AdminPagination';
import AdminConfirmDialog from '@/Components/Admin/AdminConfirmDialog';
import AdminEmptyState from '@/Components/Admin/AdminEmptyState';
import Modal from '@/Components/Modal';
import {
    MessageSquare,
    Star,
    CheckCircle2,
    XCircle,
    Reply,
    Trash2,
    Search,
    ShieldCheck,
    AlertCircle,
    Check,
    X,
    ExternalLink,
    Filter,
} from 'lucide-react';

export default function ProductReviewsIndex({
    reviews = {},
    stats = {},
    products = [],
    filters = {},
}) {
    // Filter local state
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [ratingFilter, setRatingFilter] = useState(filters.rating || 'all');
    const [verifiedFilter, setVerifiedFilter] = useState(filters.verified || 'all');
    const [productFilter, setProductFilter] = useState(filters.product_id || '');

    // Modals
    const [replyingReview, setReplyingReview] = useState(null);
    const [pendingDelete, setPendingDelete] = useState(null);

    // Reply form
    const { data: replyData, setData: setReplyData, post: postReply, processing: replyProcessing, reset: resetReply } = useForm({
        admin_reply: '',
    });

    const applyFilters = (overrides = {}) => {
        const queryParams = {
            search:     searchTerm,
            status:     statusFilter,
            rating:     ratingFilter,
            verified:   verifiedFilter,
            product_id: productFilter,
            ...overrides,
        };

        // Remove empty keys
        Object.keys(queryParams).forEach((key) => {
            if (queryParams[key] === '' || queryParams[key] === 'all') {
                delete queryParams[key];
            }
        });

        router.get(route('admin.product-reviews.index'), queryParams, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        applyFilters({ search: searchTerm });
    };

    const handleStatusUpdate = (reviewId, newStatus) => {
        router.patch(
            route('admin.product-reviews.status', reviewId),
            { status: newStatus },
            { preserveScroll: true }
        );
    };

    const openReplyModal = (review) => {
        setReplyingReview(review);
        setReplyData('admin_reply', review.admin_reply || '');
    };

    const submitReply = (e) => {
        e.preventDefault();
        if (!replyingReview) return;

        postReply(route('admin.product-reviews.reply', replyingReview.id), {
            preserveScroll: true,
            onSuccess: () => {
                setReplyingReview(null);
                resetReply();
            },
        });
    };

    const confirmDelete = () => {
        if (!pendingDelete) return;

        router.delete(route('admin.product-reviews.destroy', pendingDelete.id), {
            preserveScroll: true,
            onSuccess: () => setPendingDelete(null),
        });
    };

    const reviewItems = reviews?.data || [];

    return (
        <AdminLayout title="Avis Produits">
            <Head title="Modération des Avis Produits" />

            <div className="space-y-6">
                {/* Header & Breadcrumbs */}
                <div>
                    <AdminBreadcrumbs
                        items={[
                            { label: 'Admin', href: route('admin.dashboard') },
                            { label: 'Commerce' },
                            { label: 'Avis Produits' },
                        ]}
                    />

                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-black font-archivo uppercase text-slate-900 tracking-tight">
                                Avis & Retours Produits
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-inter">
                                Modérez les avis clients, vérifiez les achats et répondez aux messages sur les produits de la boutique.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <AdminStatCard
                        label="Total Avis & Messages"
                        value={stats.total ?? 0}
                        icon={MessageSquare}
                        hint={`${stats.with_rating ?? 0} avec note, ${stats.unrated ?? 0} messages seuls`}
                    />
                    <AdminStatCard
                        label="En attente de modération"
                        value={stats.pending ?? 0}
                        icon={AlertCircle}
                        hint={stats.pending > 0 ? 'Action requise de votre part' : 'À jour'}
                    />
                    <AdminStatCard
                        label="Avis Approuvés"
                        value={stats.approved ?? 0}
                        icon={CheckCircle2}
                        hint="Visibles sur le site public"
                    />
                    <AdminStatCard
                        label="Note Moyenne Globale"
                        value={stats.average_rating ? `${stats.average_rating} / 5` : '—'}
                        icon={Star}
                        hint="Calculée sur les avis notés approuvés"
                    />
                </div>

                {/* Filters & Search Toolbar */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
                    <form onSubmit={handleSearchSubmit} className="flex flex-col lg:flex-row gap-3">
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Rechercher par client, email, produit, message..."
                                className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-lime-500 focus:ring-2 focus:ring-lime-100"
                            />
                        </div>

                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                applyFilters({ status: e.target.value });
                            }}
                            className="rounded-xl border-slate-300 text-sm py-2.5 px-3 focus:border-lime-500 focus:ring-lime-100"
                        >
                            <option value="all">Tous les statuts</option>
                            <option value="pending">En attente ({stats.pending ?? 0})</option>
                            <option value="approved">Approuvés</option>
                            <option value="rejected">Rejetés</option>
                        </select>

                        {/* Rating Filter */}
                        <select
                            value={ratingFilter}
                            onChange={(e) => {
                                setRatingFilter(e.target.value);
                                applyFilters({ rating: e.target.value });
                            }}
                            className="rounded-xl border-slate-300 text-sm py-2.5 px-3 focus:border-lime-500 focus:ring-lime-100"
                        >
                            <option value="all">Toutes les notes</option>
                            <option value="rated">Avec note (toutes)</option>
                            <option value="unrated">Sans note (message seul)</option>
                            <option value="5">5 étoiles ★★★★★</option>
                            <option value="4">4 étoiles ★★★★☆</option>
                            <option value="3">3 étoiles ★★★☆☆</option>
                            <option value="2">2 étoiles ★★☆☆☆</option>
                            <option value="1">1 étoile ★☆☆☆☆</option>
                        </select>

                        {/* Verified Purchase Filter */}
                        <select
                            value={verifiedFilter}
                            onChange={(e) => {
                                setVerifiedFilter(e.target.value);
                                applyFilters({ verified: e.target.value });
                            }}
                            className="rounded-xl border-slate-300 text-sm py-2.5 px-3 focus:border-lime-500 focus:ring-lime-100"
                        >
                            <option value="all">Tous les achats</option>
                            <option value="verified">Achat vérifié uniquement</option>
                            <option value="unverified">Non vérifié</option>
                        </select>

                        {/* Product Filter */}
                        <select
                            value={productFilter}
                            onChange={(e) => {
                                setProductFilter(e.target.value);
                                applyFilters({ product_id: e.target.value });
                            }}
                            className="rounded-xl border-slate-300 text-sm py-2.5 px-3 focus:border-lime-500 focus:ring-lime-100 max-w-xs truncate"
                        >
                            <option value="">Tous les produits</option>
                            {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.title}
                                </option>
                            ))}
                        </select>

                        <button
                            type="submit"
                            className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-[var(--color-primary)] hover:bg-slate-800 transition shadow-sm"
                        >
                            Filtrer
                        </button>
                    </form>
                </div>

                {/* Reviews List / Table */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    {reviewItems.length === 0 ? (
                        <div className="p-8 text-center">
                            <AdminEmptyState
                                icon={MessageSquare}
                                title="Aucun avis trouvé"
                                description="Aucun avis ou retour client ne correspond aux critères de recherche actuels."
                            />
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {reviewItems.map((review) => {
                                const product = review.product;
                                const primaryImage = product?.primary_image?.url || '/images/placeholder.png';
                                const hasRating = review.rating !== null && Number(review.rating) > 0;

                                return (
                                    <div
                                        key={review.id}
                                        className="p-5 sm:p-6 transition hover:bg-slate-50/60 flex flex-col lg:flex-row lg:items-start justify-between gap-5"
                                    >
                                        {/* Left Side: Product Info + Review Content */}
                                        <div className="flex-1 space-y-3">
                                            {/* Product Header Row */}
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={primaryImage}
                                                    alt={product?.title || 'Produit'}
                                                    className="w-11 h-11 rounded-xl object-cover border border-slate-200 bg-slate-100 shrink-0"
                                                />
                                                <div>
                                                    <Link
                                                        href={route('admin.products.edit', product?.id)}
                                                        className="font-bold text-slate-900 text-sm hover:underline flex items-center gap-1.5"
                                                    >
                                                        <span>{product?.title || 'Produit indisponible'}</span>
                                                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                                                    </Link>
                                                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                                                        <span>{review.created_at ? new Date(review.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Date inconnue'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Reviewer Details + Verified Badge + Rating */}
                                            <div className="flex flex-wrap items-center gap-2.5 pt-1">
                                                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                                                    <span className="w-6 h-6 rounded-full bg-slate-900 text-[10px] text-[var(--color-primary)] font-black flex items-center justify-center">
                                                        {review.reviewer_name?.charAt(0).toUpperCase() || 'C'}
                                                    </span>
                                                    <span>{review.reviewer_name}</span>
                                                    {review.reviewer_email && (
                                                        <span className="text-slate-400 font-normal text-xs">
                                                            ({review.reviewer_email})
                                                        </span>
                                                    )}
                                                </div>

                                                {review.is_verified_purchase ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200">
                                                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                                        <span>Achat vérifié</span>
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                                                        Non vérifié
                                                    </span>
                                                )}

                                                {hasRating ? (
                                                    <div className="inline-flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 text-amber-900 text-xs font-bold">
                                                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                                        <span>{review.rating} / 5</span>
                                                    </div>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full text-slate-600 text-xs font-medium">
                                                        <MessageSquare className="w-3 h-3 text-slate-400" />
                                                        <span>Message sans note</span>
                                                    </span>
                                                )}

                                                <AdminStatusBadge
                                                    status={review.status}
                                                    label={
                                                        review.status === 'pending'
                                                            ? 'En attente'
                                                            : review.status === 'approved'
                                                            ? 'Approuvé'
                                                            : 'Rejeté'
                                                    }
                                                />
                                            </div>

                                            {/* Review Title & Comment */}
                                            <div className="bg-slate-50/70 rounded-xl p-3.5 border border-slate-100">
                                                {review.title && (
                                                    <h4 className="font-bold text-sm text-slate-900 mb-1">
                                                        {review.title}
                                                    </h4>
                                                )}
                                                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                                                    {review.comment}
                                                </p>
                                            </div>

                                            {/* Existing Admin Reply */}
                                            {review.admin_reply && (
                                                <div className="rounded-xl border-l-4 border-lime-500 bg-lime-50/50 p-3 text-xs space-y-1">
                                                    <div className="flex items-center justify-between text-lime-900 font-bold uppercase tracking-wider text-[10px]">
                                                        <span className="flex items-center gap-1">
                                                            <ShieldCheck className="w-3.5 h-3.5 text-lime-700" />
                                                            <span>Réponse officielle du Coach</span>
                                                        </span>
                                                        <span className="text-slate-400 font-normal">
                                                            {review.admin_replied_at ? new Date(review.admin_replied_at).toLocaleDateString('fr-FR') : ''}
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-700 text-xs leading-normal">
                                                        {review.admin_reply}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Right Side: Quick Action Controls */}
                                        <div className="flex lg:flex-col items-center lg:items-end gap-2 shrink-0 pt-2 lg:pt-0">
                                            {/* Approve / Reject buttons */}
                                            {review.status !== 'approved' && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleStatusUpdate(review.id, 'approved')}
                                                    className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition shadow-2xs"
                                                    title="Approuver et publier sur la fiche produit"
                                                >
                                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                    <span>Approuver</span>
                                                </button>
                                            )}

                                            {review.status !== 'rejected' && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleStatusUpdate(review.id, 'rejected')}
                                                    className="inline-flex items-center gap-1 rounded-xl bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800 border border-amber-200 hover:bg-amber-100 transition shadow-2xs"
                                                    title="Rejeter l'avis (ne sera pas visible)"
                                                >
                                                    <X className="w-3.5 h-3.5 text-amber-600" />
                                                    <span>Rejeter</span>
                                                </button>
                                            )}

                                            {/* Reply Button */}
                                            <button
                                                type="button"
                                                onClick={() => openReplyModal(review)}
                                                className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
                                                title="Ajouter ou modifier une réponse officielle"
                                            >
                                                <Reply className="w-3.5 h-3.5 text-slate-500" />
                                                <span>{review.admin_reply ? 'Modifier réponse' : 'Répondre'}</span>
                                            </button>

                                            {/* Delete Button */}
                                            <button
                                                type="button"
                                                onClick={() => setPendingDelete(review)}
                                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                                title="Supprimer définitivement cet avis"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <AdminPagination links={reviews?.links} />
            </div>

            {/* Admin Reply Modal */}
            {replyingReview && (
                <Modal show={Boolean(replyingReview)} onClose={() => setReplyingReview(null)} maxWidth="lg">
                    <form onSubmit={submitReply} className="p-6">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-lime-600" />
                                <h3 className="font-bold text-slate-900 text-base">
                                    Réponse officielle du Coach
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setReplyingReview(null)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-600 space-y-1">
                            <p className="font-semibold text-slate-900">
                                Avis de {replyingReview.reviewer_name} sur « {replyingReview.product?.title} » :
                            </p>
                            <p className="italic line-clamp-3">« {replyingReview.comment} »</p>
                        </div>

                        <div className="mt-4">
                            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                                Votre message de réponse public
                            </label>
                            <textarea
                                rows={4}
                                value={replyData.admin_reply}
                                onChange={(e) => setReplyData('admin_reply', e.target.value)}
                                placeholder="Merci beaucoup pour votre retour d'entraînement ! Toute l'équipe Fit Youness vous souhaite de continuer sur cette lancée..."
                                className="w-full rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-100"
                            />
                            <p className="text-[11px] text-slate-400 mt-1">
                                Cette réponse sera affichée directement sous l'avis du client sur la fiche produit. Laissez vide pour supprimer une réponse existante.
                            </p>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setReplyingReview(null)}
                                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={replyProcessing}
                                className="inline-flex items-center gap-2 rounded-xl bg-lime-500 px-5 py-2 text-xs font-black text-slate-950 shadow-md hover:bg-lime-400 transition disabled:opacity-50"
                            >
                                <span>{replyProcessing ? 'Enregistrement...' : 'Enregistrer la réponse'}</span>
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Confirm Delete Dialog */}
            <AdminConfirmDialog
                show={Boolean(pendingDelete)}
                title="Supprimer cet avis ?"
                message={`Êtes-vous sûr de vouloir supprimer définitivement l'avis de "${pendingDelete?.reviewer_name}" sur le produit "${pendingDelete?.product?.title}" ? Cette action est irréversible.`}
                confirmLabel="Supprimer définitivement"
                onClose={() => setPendingDelete(null)}
                onConfirm={confirmDelete}
            />
        </AdminLayout>
    );
}

