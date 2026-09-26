<?php

namespace App\Http\Requests;

use App\Support\CustomerIdentity;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare and normalize input before validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'customer_name' => $this->filled('customer_name')
                ? trim($this->input('customer_name'))
                : null,

            'customer_email' => $this->filled('customer_email')
                ? strtolower(trim($this->input('customer_email')))
                : null,

            'customer_phone' => $this->filled('customer_phone')
                ? trim($this->input('customer_phone'))
                : null,

            'shipping_address' => $this->filled('shipping_address')
                ? trim($this->input('shipping_address'))
                : null,

            'city' => $this->filled('city')
                ? trim($this->input('city'))
                : null,

            'shipping_postal_code' => $this->filled('shipping_postal_code')
                ? trim($this->input('shipping_postal_code'))
                : null,
        ]);
    }

    /**
     * Validation rules.
     */
    public function rules(): array
    {
        $identity = CustomerIdentity::resolve($this);

        return [
            /*
            |--------------------------------------------------------------------------
            | Customer
            |--------------------------------------------------------------------------
            */

           'checkout_mode' => [
    'required',
    'string',
    Rule::in([
        'cart',
        'buy_now',
    ]),
],

            'customer_name' => [
                $identity->isGuest() ? 'required' : 'nullable',
                'string',
                'min:2',
                'max:255',
            ],

            'customer_email' => [
                'nullable',
                'email:rfc',
                'max:255',
            ],

            'customer_phone' => [
                $identity->isGuest() ? 'required' : 'nullable',
                'string',
                'min:8',
                'max:30',
            ],

            /*
            |--------------------------------------------------------------------------
            | Shipping
            |--------------------------------------------------------------------------
            */

            'shipping_address' => [
                'required',
                'string',
                'min:5',
                'max:500',
            ],

            'city' => [
                'nullable',
                'string',
                'min:2',
                'max:100',
            ],

            'shipping_postal_code' => [
                'nullable',
                'string',
                'max:20',
            ],

            /*
            |--------------------------------------------------------------------------
            | Payment
            |--------------------------------------------------------------------------
            */

            'payment_method' => [
                'required',
                'string',
                Rule::in([
                    'cash',
                    'stripe',
                ]),
            ],
        ];
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [
            /*
            |--------------------------------------------------------------------------
            | Customer
            |--------------------------------------------------------------------------
            */

            'customer_name.required' =>
                'Le nom du client est obligatoire.',

            'customer_name.string' =>
                'Le nom du client doit être une chaîne de caractères.',

            'customer_name.min' =>
                'Le nom du client doit contenir au moins :min caractères.',

            'customer_name.max' =>
                'Le nom du client ne doit pas dépasser :max caractères.',

            'customer_email.email' =>
                'Veuillez fournir une adresse email valide.',

            'customer_email.max' =>
                'L’adresse email ne doit pas dépasser :max caractères.',

            'customer_phone.required' =>
                'Le numéro de téléphone est obligatoire.',

            'customer_phone.string' =>
                'Le numéro de téléphone doit être valide.',

            'customer_phone.min' =>
                'Le numéro de téléphone doit contenir au moins :min caractères.',

            'customer_phone.max' =>
                'Le numéro de téléphone ne doit pas dépasser :max caractères.',

            /*
            |--------------------------------------------------------------------------
            | Shipping
            |--------------------------------------------------------------------------
            */

            'shipping_address.required' =>
                'L’adresse de livraison est obligatoire.',

            'shipping_address.string' =>
                'L’adresse de livraison doit être valide.',

            'shipping_address.min' =>
                'L’adresse de livraison doit contenir au moins :min caractères.',

            'shipping_address.max' =>
                'L’adresse de livraison ne doit pas dépasser :max caractères.',

            'city.required' =>
                'La ville est obligatoire.',

            'city.string' =>
                'La ville doit être valide.',

            'city.min' =>
                'Le nom de la ville doit contenir au moins :min caractères.',

            'city.max' =>
                'Le nom de la ville ne doit pas dépasser :max caractères.',

            'shipping_postal_code.string' =>
                'Le code postal doit être valide.',

            'shipping_postal_code.max' =>
                'Le code postal ne doit pas dépasser :max caractères.',

            /*
            |--------------------------------------------------------------------------
            | Payment
            |--------------------------------------------------------------------------
            */

            'payment_method.required' =>
                'Veuillez sélectionner un mode de paiement.',

            'payment_method.in' =>
                'Le mode de paiement sélectionné est invalide.',
        ];
    }

    /**
     * Custom attribute names used in Laravel validation messages.
     */
    public function attributes(): array
    {
        return [
            'customer_name' => 'nom du client',
            'customer_email' => 'adresse email',
            'customer_phone' => 'numéro de téléphone',
            'shipping_address' => 'adresse de livraison',
            'city' => 'ville',
            'shipping_postal_code' => 'code postal',
            'payment_method' => 'mode de paiement',
        ];
    }
}