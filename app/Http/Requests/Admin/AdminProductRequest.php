<?php

namespace App\Http\Requests\Admin;

use App\Enums\ProductType;
use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdminProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        $product = $this->route('product');

        if ($product instanceof Product) {
            return $this->user()?->can('update', $product) ?? false;
        }

        return $this->user()?->can('create', Product::class) ?? false;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'manage_stock' => $this->boolean('manage_stock'),
            'is_active' => $this->boolean('is_active'),
            'category_ids' => array_values(array_filter(
                (array) $this->input('category_ids', []),
                fn ($id) => $id !== null && $id !== ''
            )),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $product = $this->route('product');
        $productId = $product instanceof Product ? $product->id : null;
        $isUpdate = $productId !== null;

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('products', 'slug')->ignore($productId),
            ],
            'type' => ['required', Rule::enum(ProductType::class)],
            'price' => ['required', 'numeric', 'min:0'],
            'sale_price' => ['nullable', 'numeric', 'min:0', 'lt:price'],
            'stock_quantity' => ['nullable', 'integer', 'min:0'],
            'manage_stock' => ['required', 'boolean'],
            'is_active' => ['required', 'boolean'],
            'category_ids' => ['required', 'array', 'min:1'],
            'category_ids.*' => ['integer', 'exists:categories,id'],
            'images' => [$isUpdate ? 'nullable' : 'required', 'array', $isUpdate ? 'min:0' : 'min:1'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp,gif', 'max:5120'],
            'primary_index' => ['nullable', 'integer', 'min:0'],
            'existing_primary_id' => [
                'nullable',
                'integer',
                Rule::exists('product_images', 'id')->when(
                    $productId,
                    fn ($rule) => $rule->where('product_id', $productId)
                ),
            ],
            'removed_image_ids' => ['nullable', 'array'],
            'removed_image_ids.*' => [
                'integer',
                Rule::exists('product_images', 'id')->when(
                    $productId,
                    fn ($rule) => $rule->where('product_id', $productId)
                ),
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'category_ids.required' => 'Sélectionnez au moins une catégorie.',
            'images.required' => 'Ajoutez au moins une image produit.',
            'sale_price.lt' => 'Le prix promo doit être inférieur au prix normal.',
        ];
    }
}
