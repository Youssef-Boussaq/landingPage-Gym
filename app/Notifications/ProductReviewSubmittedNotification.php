<?php

namespace App\Notifications;

use App\Models\ProductReview;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ProductReviewSubmittedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public ProductReview $review
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $productTitle = $this->review->product?->title ?? 'un produit';
        $ratingText = $this->review->rating ? " ({$this->review->rating}★)" : ' (sans note)';

        return [
            'type'        => 'product_review_submitted',
            'title'       => 'Nouvel avis produit',
            'message'     => "Avis reçu de {$this->review->reviewer_name}{$ratingText} sur « {$productTitle} ».",
            'review_id'   => $this->review->id,
            'product_id'  => $this->review->product_id,
            'rating'      => $this->review->rating,
            'reviewer'    => $this->review->reviewer_name,
        ];
    }
}

