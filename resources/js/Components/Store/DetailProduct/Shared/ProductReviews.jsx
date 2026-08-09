import React from 'react';
import ProductReviewCard from './ProductReviewCard';

// Static data as requested by user
const staticReviews = [
    {
        id: 1,
        author: 'Jean Dupont',
        rating: 5,
        date: '12 Mars 2024',
        content: 'Super produit, la qualité est incroyable. Je recommande vivement pour tous vos entrainements !'
    },
    {
        id: 2,
        author: 'Marie Martin',
        rating: 4,
        date: '05 Mars 2024',
        content: 'Très bon article, livraison rapide. Un peu cher mais la qualité est au rendez-vous.'
    }
];

export default function ProductReviews() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black font-archivo text-slate-900">
                    Avis clients
                </h2>
                <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    {staticReviews.length} avis
                </span>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2">
                {staticReviews.map(review => (
                    <ProductReviewCard key={review.id} review={review} />
                ))}
            </div>
        </div>
    );
}
