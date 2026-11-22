<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ProductType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    use AuthorizesRequests;

    /*
    |--------------------------------------------------------------------------
    | INDEX
    |--------------------------------------------------------------------------
    */

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Product::class);

        $threshold = (int) config(
            'store.low_stock_threshold',
            10
        );

        $query = Product::query()
            ->with([
                'categories',
                'primaryImage',
            ])
            ->withTrashed();

        if ($search = trim(
            (string) $request->query('search', '')
        )) {
            $query->where(function ($builder) use ($search) {
                $builder
                    ->where(
                        'title',
                        'like',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'slug',
                        'like',
                        "%{$search}%"
                    );
            });
        }

        if ($categoryId = $request->query('category')) {
            $query->whereHas(
                'categories',
                function ($builder) use ($categoryId) {
                    $builder->where(
                        'categories.id',
                        $categoryId
                    );
                }
            );
        }

        $status = $request->query('status');

        if ($status === 'active') {
            $query
                ->where('is_active', true)
                ->whereNull('deleted_at');
        } elseif ($status === 'inactive') {
            $query
                ->where('is_active', false)
                ->whereNull('deleted_at');
        } elseif ($status === 'deleted') {
            $query->whereNotNull('deleted_at');
        } else {
            $query->whereNull('deleted_at');
        }

        $stock = $request->query('stock');

        if ($stock === 'low') {
            $query
                ->where('manage_stock', true)
                ->whereNotNull('stock_quantity')
                ->where(
                    'stock_quantity',
                    '<',
                    $threshold
                );
        } elseif ($stock === 'out') {
            $query
                ->where('manage_stock', true)
                ->where(function ($builder) {
                    $builder
                        ->where(
                            'stock_quantity',
                            '<=',
                            0
                        )
                        ->orWhereNull(
                            'stock_quantity'
                        );
                });
        } elseif ($stock === 'in') {
            $query->where(function ($builder) {
                $builder
                    ->where(
                        'manage_stock',
                        false
                    )
                    ->orWhere(
                        'stock_quantity',
                        '>',
                        0
                    );
            });
        }

        $products = $query
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render(
            'Admin/Products/Index',
            [
                'products' => $products,

                'filters' => [
                    'search' => $request->query(
                        'search',
                        ''
                    ),

                    'category' => $request->query(
                        'category',
                        ''
                    ),

                    'status' => $request->query(
                        'status',
                        ''
                    ),

                    'stock' => $request->query(
                        'stock',
                        ''
                    ),
                ],

                'categories' => Category::query()
                    ->orderBy('name')
                    ->get([
                        'id',
                        'name',
                        'parent_id',
                    ]),

                'lowStockThreshold' => $threshold,
            ]
        );
    }

    /*
    |--------------------------------------------------------------------------
    | CREATE
    |--------------------------------------------------------------------------
    */

    public function create(): Response
    {
        $this->authorize(
            'create',
            Product::class
        );



        return Inertia::render(
            'Admin/Products/Create',
            [
                'categories' =>
                    $this->categoryOptions(),

                'types' =>
                    collect(ProductType::cases())
                        ->map(
                            fn ($type) =>
                                $type->value
                        ),
            ]
        );
    }

    /*
    |--------------------------------------------------------------------------
    | STORE
    |--------------------------------------------------------------------------
    */

    public function store(
        AdminProductRequest $request
    ): RedirectResponse {
        try {
            $product = DB::transaction(
                function () use ($request) {

                    $validated =
                        $request->validated();

                    $productData = [
                        'title' =>
                            $validated['title'],

                        'description' =>
                            $validated['description']
                            ?? null,

                        'slug' =>
                            $this->uniqueSlug(
                                $validated['slug']
                                    ?? null,
                                $validated['title']
                            ),

                        'type' =>
                            $validated['type'],

                        'price' =>
                            $validated['price'],

                        'sale_price' =>
                            $validated['sale_price']
                            ?? null,

                        'stock_quantity' =>
                            $validated['stock_quantity']
                            ?? null,

                        'manage_stock' =>
                            $validated['manage_stock'],

                        'is_active' =>
                            $validated['is_active'],

                        'digital_download_link' =>
                            $validated['digital_download_link']
                            ?? null,
                    ];

                    if ($request->hasFile('digital_file')) {
                        $digitalFile = $request->file('digital_file');
                        $path = $digitalFile->store('digital_products', 'public');
                        $productData['digital_file_path'] = $path;
                        $productData['digital_file_name'] = $digitalFile->getClientOriginalName();
                        $productData['digital_file_size'] = $digitalFile->getSize();
                    }

                    $product = Product::create($productData);

                    $product->categories()->sync(
                        $validated['category_ids']
                    );

                    $this->storeImages(
                        $product,
                        $request->file('images', []) ?? [],
                        null,
                        $request->input('primary_index') !== null
                            ? (int) $request->input('primary_index')
                            : null
                    );

                    $this->finalizeDescriptionImages(
                        $product,
                        $request->input(
                            'upload_token'
                        )
                    );

                    return $product;
                }
            );

            return redirect()
                ->route(
                    'admin.products.show',
                    $product
                )
                ->with(
                    'success',
                    'Produit créé.'
                );
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('[ADMIN PRODUCT STORE] ' . $e->getMessage(), [
                'exception' => $e,
            ]);

            return back()
                ->withErrors([
                    'error' => 'Erreur lors de la création du produit : ' . $e->getMessage(),
                ])
                ->withInput();
        }
    }

    /*
    |--------------------------------------------------------------------------
    | SHOW
    |--------------------------------------------------------------------------
    */

    public function show(
        Product $product
    ): Response {
        $this->authorize(
            'view',
            $product
        );

        $product->load([
            'categories',
            'images',
        ]);

        return Inertia::render(
            'Admin/Products/Show',
            [
                'product' => $product,
            ]
        );
    }

    /*
    |--------------------------------------------------------------------------
    | EDIT
    |--------------------------------------------------------------------------
    */

    public function edit(
        Product $product
    ): Response {
        $this->authorize(
            'update',
            $product
        );

        $product->load([
            'categories',
            'images',
        ]);

        return Inertia::render(
            'Admin/Products/Edit',
            [
                'product' => $product,

                'categories' =>
                    $this->categoryOptions(),

                'types' =>
                    collect(ProductType::cases())
                        ->map(
                            fn ($type) =>
                                $type->value
                        ),
            ]
        );
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE
    |--------------------------------------------------------------------------
    */

    public function update(
        AdminProductRequest $request,
        Product $product
    ): RedirectResponse {
        try {
            DB::transaction(
                function () use (
                    $request,
                    $product
                ) {

                    $validated =
                        $request->validated();

                    /*
                    |--------------------------------------------------------------------------
                    | Product
                    |--------------------------------------------------------------------------
                    */

                    $updateData = [
                        'title' =>
                            $validated['title'],

                        'slug' =>
                            $this->uniqueSlug(
                                $validated['slug']
                                    ?? null,
                                $validated['title'],
                                $product->getKey()
                            ),

                        'description' =>
                            $validated['description']
                            ?? null,

                        'type' =>
                            $validated['type'],

                        'price' =>
                            $validated['price'],

                        'sale_price' =>
                            $validated['sale_price']
                            ?? null,

                        'stock_quantity' =>
                            $validated['stock_quantity']
                            ?? null,

                        'manage_stock' =>
                            $validated['manage_stock'],

                        'is_active' =>
                            $validated['is_active'],

                        'digital_download_link' =>
                            $validated['digital_download_link']
                            ?? null,
                    ];

                    if ($request->hasFile('digital_file')) {
                        if ($product->digital_file_path && Storage::disk('public')->exists($product->digital_file_path)) {
                            Storage::disk('public')->delete($product->digital_file_path);
                        }
                        $digitalFile = $request->file('digital_file');
                        $path = $digitalFile->store('digital_products', 'public');
                        $updateData['digital_file_path'] = $path;
                        $updateData['digital_file_name'] = $digitalFile->getClientOriginalName();
                        $updateData['digital_file_size'] = $digitalFile->getSize();
                    } elseif ($request->boolean('remove_digital_file')) {
                        if ($product->digital_file_path && Storage::disk('public')->exists($product->digital_file_path)) {
                            Storage::disk('public')->delete($product->digital_file_path);
                        }
                        $updateData['digital_file_path'] = null;
                        $updateData['digital_file_name'] = null;
                        $updateData['digital_file_size'] = null;
                    }

                    $product->update($updateData);

                    /*
                    |--------------------------------------------------------------------------
                    | Categories
                    |--------------------------------------------------------------------------
                    */

                    $product->categories()->sync(
                        $validated['category_ids']
                    );

                    /*
                    |--------------------------------------------------------------------------
                    | Remove existing images
                    |--------------------------------------------------------------------------
                    */

                    $removedPaths =
                        $validated[
                            'removed_image_paths'
                        ] ?? [];

                    if ($removedPaths !== []) {

                        $imagesToDelete =
                            $product
                                ->images()
                                ->whereIn(
                                    'path',
                                    $removedPaths
                                )
                                ->get();

                        foreach (
                            $imagesToDelete
                            as $image
                        ) {

                            Storage::disk('public')
                                ->delete(
                                    $image->path
                                );

                            ProductImage::query()
                                ->where(
                                    'product_id',
                                    $product->getKey()
                                )
                                ->where(
                                    'path',
                                    $image->path
                                )
                                ->delete();
                        }
                    }

                    /*
                    |--------------------------------------------------------------------------
                    | New images
                    |--------------------------------------------------------------------------
                    */

                    $newFiles =
                        $request->file(
                            'images',
                            []
                        ) ?? [];

                    /*
                    |--------------------------------------------------------------------------
                    | Store images
                    |--------------------------------------------------------------------------
                    */

                    $this->storeImages(
                        $product->fresh('images'),
                        $newFiles,
                        $request->input('existing_primary_id') !== null
                            ? (int) $request->input('existing_primary_id')
                            : null,
                        $request->input('primary_index') !== null
                            ? (int) $request->input('primary_index')
                            : null
                    );

                    /*
                    |--------------------------------------------------------------------------
                    | Description images
                    |--------------------------------------------------------------------------
                    */

                    $this->finalizeDescriptionImages(
                        $product->fresh(),
                        $request->input(
                            'upload_token'
                        )
                    );
                }
            );

            return redirect()
                ->route(
                    'admin.products.show',
                    $product
                )
                ->with(
                    'success',
                    'Produit mis à jour.'
                );
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('[ADMIN PRODUCT UPDATE] ' . $e->getMessage(), [
                'exception' => $e,
                'product_id' => $product->id,
            ]);

            return back()
                ->withErrors([
                    'error' => 'Erreur lors de la mise à jour du produit : ' . $e->getMessage(),
                ])
                ->withInput();
        }
    }

    /*
    |--------------------------------------------------------------------------
    | DESTROY
    |--------------------------------------------------------------------------
    */

    public function destroy(
        Product $product
    ): RedirectResponse {
        $this->authorize(
            'delete',
            $product
        );

        $product->delete();

        return redirect()
            ->route(
                'admin.products.index'
            )
            ->with(
                'success',
                'Produit désactivé (corbeille).'
            );
    }

    /*
    |--------------------------------------------------------------------------
    | RESTORE
    |--------------------------------------------------------------------------
    */

    public function restore(
        int $id
    ): RedirectResponse {
        $model =
            Product::withTrashed()
                ->findOrFail($id);

        $this->authorize(
            'restore',
            $model
        );

        $model->restore();

        return back()->with(
            'success',
            'Produit restauré.'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | DEACTIVATE
    |--------------------------------------------------------------------------
    */

    public function deactivate(
        Product $product
    ): RedirectResponse {
        $this->authorize(
            'update',
            $product
        );

        $product->update([
            'is_active' => false,
        ]);

        return back()->with(
            'success',
            'Produit désactivé.'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | CATEGORY OPTIONS
    |--------------------------------------------------------------------------
    */

    private function categoryOptions()
    {
        return Category::query()
            ->with('parent:id,name')
            ->orderBy('name')
            ->get([
                'id',
                'name',
                'parent_id',
            ])
            ->map(
                fn (Category $category) => [
                    'id' =>
                        $category->id,

                    'name' =>
                        $category->name,

                    'parent_id' =>
                        $category->parent_id,

                    'label' =>
                        $category->parent
                            ? $category->parent->name
                                . ' / '
                                . $category->name
                            : $category->name,
                ]
            );
    }

    /*
    |--------------------------------------------------------------------------
    | UNIQUE SLUG
    |--------------------------------------------------------------------------
    */

    private function uniqueSlug(
        ?string $slug,
        string $title,
        ?int $ignoreId = null
    ): string {
        $base =
            Str::slug(
                $slug ?: $title
            ) ?: 'product';

        $candidate = $base;

        $i = 1;

        while (
            Product::withTrashed()
                ->where(
                    'slug',
                    $candidate
                )
                ->when(
                    $ignoreId,
                    fn ($query) =>
                        $query->where(
                            'id',
                            '!=',
                            $ignoreId
                        )
                )
                ->exists()
        ) {
            $candidate =
                $base . '-' . $i;

            $i++;
        }

        return $candidate;
    }


private function storeProductImage(
    Product $product,
    $file
): string {
    $directory = "products/{$product->slug}";

    $filename =
        Str::uuid()
        . '.'
        . $file->extension();

    return $file->storeAs(
        $directory,
        $filename,
        'public'
    );
}

    /*
    |--------------------------------------------------------------------------
    | STORE PRODUCT IMAGES
    |--------------------------------------------------------------------------
    */

    private function storeImages(
    Product $product,
    array $files,
    ?int $primaryImageId = null,
    ?int $primaryIndex = null
): void {
    $existingImages = $product
        ->images()
        ->orderBy('sort_order')
        ->get();

    $newImages = collect();

    foreach ($files as $file) {
        $path = $file->store(
            "products/{$product->slug}",
            'public'
        );

        $newImages->push(
            $product->images()->create([
                'path' => $path,
                'alt_text' => $product->title,
                'sort_order' => $existingImages->count()
                    + $newImages->count()
                    + 1,
                'is_primary' => false,
            ])
        );
    }

    $primaryImage = null;

    /*
    |--------------------------------------------------------------------------
    | 1. Existing image explicitly selected
    |--------------------------------------------------------------------------
    */
    if ($primaryImageId !== null) {
        $primaryImage = $product
            ->images()
            ->whereKey($primaryImageId)
            ->first();
    }

    /*
    |--------------------------------------------------------------------------
    | 2. Newly uploaded image explicitly selected
    |--------------------------------------------------------------------------
    */
    if (
        !$primaryImage &&
        $primaryIndex !== null &&
        $newImages->has($primaryIndex)
    ) {
        $primaryImage = $newImages->get($primaryIndex);
    }

    /*
    |--------------------------------------------------------------------------
    | 3. Preserve existing primary
    |--------------------------------------------------------------------------
    */
    if (!$primaryImage) {
        $primaryImage = $existingImages
            ->firstWhere('is_primary', true);
    }

    /*
    |--------------------------------------------------------------------------
    | 4. Fallback to first image
    |--------------------------------------------------------------------------
    */
    if (!$primaryImage) {
        $primaryImage = $product
            ->images()
            ->orderBy('sort_order')
            ->first();
    }

    if (!$primaryImage) {
        return;
    }

    /*
    |--------------------------------------------------------------------------
    | Ensure only ONE primary image
    |--------------------------------------------------------------------------
    */
    $product->images()->update([
        'is_primary' => false,
    ]);

    $primaryImage->update([
        'is_primary' => true,
    ]);
}
    /*
    |--------------------------------------------------------------------------
    | DESCRIPTION IMAGE UPLOAD
    |--------------------------------------------------------------------------
    */

    public function uploadDescriptionImage(
        Request $request
    ) {
        $request->validate([
            'image' => [
                'required',
                'image',
                'mimes:jpeg,png,webp,gif',
                'max:5120',
            ],

            'upload_token' => [
                'required',
                'string',
                'max:100',
            ],
        ]);

        $token =
            $request->input(
                'upload_token'
            );

        if (
            !preg_match(
                '/^[a-zA-Z0-9_-]+$/',
                $token
            )
        ) {
            abort(
                422,
                'Upload token invalide.'
            );
        }

        $directory =
            "products/tmp/{$token}/description";

        $filename =
            'image-'
            . Str::uuid()
            . '.'
            . $request
                ->file('image')
                ->extension();

        $path =
            $request
                ->file('image')
                ->storeAs(
                    $directory,
                    $filename,
                    'public'
                );

        return response()->json([
            'url' =>
                Storage::disk('public')
                    ->url($path),

            'path' =>
                $path,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | FINALIZE DESCRIPTION IMAGES
    |--------------------------------------------------------------------------
    */

    private function finalizeDescriptionImages(
        Product $product,
        ?string $uploadToken
    ): void {

        if (!$uploadToken) {
            return;
        }

        if (
            !preg_match(
                '/^[a-zA-Z0-9_-]+$/',
                $uploadToken
            )
        ) {
            return;
        }

        $disk =
            Storage::disk('public');

        $temporaryDirectory =
            "products/tmp/{$uploadToken}/description";

        if (
            !$disk->exists(
                $temporaryDirectory
            )
        ) {
            return;
        }

        $finalDirectory =
            "products/{$product->slug}/description";

        $disk->makeDirectory(
            $finalDirectory
        );

        $files =
            $disk->files(
                $temporaryDirectory
            );

        if ($files === []) {
            return;
        }

        $description =
            $product->description;

        foreach ($files as $file) {
    $filename = basename($file);
    $newPath = $finalDirectory . '/' . $filename;

    // Don't overwrite an existing file.
    if ($disk->exists($newPath)) {
        throw new \RuntimeException(
            "Description image already exists: {$newPath}"
        );
    }

    $oldUrl = $disk->url($file);

    if (!$disk->move($file, $newPath)) {
        throw new \RuntimeException(
            "Failed to move description image: {$file}"
        );
    }

    $newUrl = $disk->url($newPath);

    $description = str_replace(
        $oldUrl,
        $newUrl,
        $description ?? ''
    );
}

        $product->update([
            'description' =>
                $description,
        ]);

        $disk->deleteDirectory(
            "products/tmp/{$uploadToken}"
        );
    }
} 