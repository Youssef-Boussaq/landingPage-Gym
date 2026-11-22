<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Anyone can submit an experience/review (guest or authenticated)
    }

    public function rules(): array
    {
        return [
            'reviewer_name'  => ['required', 'string', 'min:2', 'max:100'],
            'reviewer_email' => ['nullable', 'email', 'max:150'],
            'rating'         => ['nullable', 'integer', 'between:1,5'],
            'title'          => ['nullable', 'string', 'max:150'],
            'comment'        => ['required', 'string', 'min:5', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'reviewer_name.required' => 'Votre nom ou pseudo est requis.',
            'reviewer_name.min'      => 'Le nom doit comporter au moins 2 caractères.',
            'reviewer_name.max'      => 'Le nom ne peut pas dépasser 100 caractères.',
            'reviewer_email.email'   => 'Veuillez saisir une adresse email valide.',
            'rating.integer'         => 'La note doit être un nombre entier compris entre 1 et 5.',
            'rating.between'         => 'La note doit être comprise entre 1 et 5 étoiles.',
            'title.max'              => 'Le titre ne peut pas dépasser 150 caractères.',
            'comment.required'       => 'Veuillez rédiger votre retour ou message.',
            'comment.min'            => 'Votre message doit comporter au moins 5 caractères.',
            'comment.max'            => 'Votre message ne peut pas dépasser 2000 caractères.',
        ];
    }
}

