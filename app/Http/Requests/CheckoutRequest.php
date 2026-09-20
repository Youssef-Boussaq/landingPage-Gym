<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'checkout_mode' => [
                'required',
                Rule::in(['cart', 'buy_now']),
            ],

            'customer_phone' => [
                'required',
                'string',
                'max:30',
            ],

            'shipping_address' => [
                'required',
                'string',
                'max:500',
            ],

            'city' => [
                'required',
                'string',
                'max:100',
            ],

            'postal_code' => [
                'nullable',
                'string',
                'max:20',
            ],

            'payment_method' => [
                'required',
                'in:stripe,cash',
            ],
        ];

        if (!auth()->check()) {
            $rules['customer_name'] = [
                'required',
                'string',
                'max:255',
            ];

            $rules['customer_email'] = [
                'required',
                'email',
                'max:255',
            ];
        }

        return $rules;
    }
}

