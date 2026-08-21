<?php

namespace App\Http\Requests\Admin;

use App\Models\Category;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class AdminCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        $category = $this->route('category');

        if ($category instanceof Category) {
            return $this->user()?->can('update', $category) ?? false;
        }

        return $this->user()?->can('create', Category::class) ?? false;
    }

    protected function prepareForValidation(): void
    {
        $parentId = $this->input('parent_id');

        $this->merge([
            'parent_id' => $parentId === '' || $parentId === null ? null : (int) $parentId,
            'slug' => is_string($this->input('slug')) ? trim($this->input('slug')) : $this->input('slug'),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $category = $this->route('category');
        $categoryId = $category instanceof Category ? $category->id : null;

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('categories', 'slug')->ignore($categoryId),
            ],
            'parent_id' => [
                'nullable',
                'integer',
                Rule::exists('categories', 'id')->where(function ($query) use ($categoryId) {
                    if ($categoryId) {
                        $query->where('id', '!=', $categoryId);
                    }
                }),
            ],
            'alt_text' => ['nullable', 'string', 'max:255'],
            'media' => ['nullable', 'array'],
            'media.*' => ['file', 'mimes:jpg,jpeg,png,webp,mp4,webm', 'max:20480'],
            'primary_index' => ['nullable', 'integer', 'min:0'],
            'existing_primary_id' => [
                'nullable',
                'integer',
                Rule::exists('category_media', 'id')->when(
                    $categoryId,
                    fn ($rule) => $rule->where('category_id', $categoryId)
                ),
            ],
            'removed_media_ids' => ['nullable', 'array'],
            'removed_media_ids.*' => [
                'integer',
                Rule::exists('category_media', 'id')->when(
                    $categoryId,
                    fn ($rule) => $rule->where('category_id', $categoryId)
                ),
            ],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator) {
                $category = $this->route('category');
                $parentId = $this->input('parent_id');

                if (!$category instanceof Category || $parentId === null) {
                    return;
                }

                if ($category->wouldCreateCycle((int) $parentId)) {
                    $validator->errors()->add(
                        'parent_id',
                        'This parent would create a circular category hierarchy.'
                    );
                }
            },
            function (Validator $validator) {
                $files = $this->file('media', []) ?? [];

                foreach ($files as $index => $file) {
                    if (!$file) {
                        continue;
                    }

                    $extension = strtolower($file->getClientOriginalExtension());
                    $size = $file->getSize();

                    if (in_array($extension, ['mp4', 'webm'], true) && $size > 20 * 1024 * 1024) {
                        $validator->errors()->add("media.{$index}", 'Videos must be 20 MB or smaller.');
                    }

                    if (in_array($extension, ['jpg', 'jpeg', 'png', 'webp'], true) && $size > 5 * 1024 * 1024) {
                        $validator->errors()->add("media.{$index}", 'Images must be 5 MB or smaller.');
                    }
                }
            },
        ];
    }
}
