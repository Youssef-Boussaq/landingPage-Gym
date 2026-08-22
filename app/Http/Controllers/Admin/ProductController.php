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

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Product::class);

        $threshold = (int) config('store.low_stock_threshold', 10);

        $query = Product::query()
            ->with(['categories', 'primaryImage'])
            ->withTrashed();

        if ($search = trim((string) $request->query('search', ''))) {
            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('title', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        if ($categoryId = $request->query('category')) {
            $query->whereHas('categories', function ($builder) use ($categoryId) {
                $builder->where('categories.id', $categoryId);
            });
        }

        $status = $request->query('status');

        if ($status === 'active') {
            $query->where('is_active', true)->whereNull('deleted_at');
        } elseif ($status === 'inactive') {
            $query->where('is_active', false)->whereNull('deleted_at');
        } elseif ($status === 'deleted') {
            $query->whereNotNull('deleted_at');
        } else {
            $query->whereNull('deleted_at');
        }

        $stock = $request->query('stock');

        if ($stock === 'low') {
            $query->where('manage_stock', true)
                ->whereNotNull('stock_quantity')
                ->where('stock_quantity', '<', $threshold);
        } elseif ($stock === 'out') {
            $query->where('manage_stock', true)
                ->where(function ($builder) {
                    $builder
                        ->where('stock_quantity', '<=', 0)
                        ->orWhereNull('stock_quantity');
                });
        } elseif ($stock === 'in') {
            $query->where(function ($builder) {
                $builder
                    ->where('manage_stock', false)
                    ->orWhere('stock_quantity', '>', 0);
            });
        }

        $products = $query
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'filters' => [
                'search' => $request->query('search', ''),
                'category' => $request->query('category', ''),
                'status' => $request->query('status', ''),
                'stock' => $request->query('stock', ''),
            ],
            'categories' => Category::query()->orderBy('name')->get(['id', 'name', 'parent_id']),
            'lowStockThreshold' => $threshold,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Product::class);

        return Inertia::render('Admin/Products/Create', [
            'categories' => $this->categoryOptions(),
            'types' => collect(ProductType::cases())->map(fn ($type) => $type->value),
        ]);
    }

    public function store(AdminProductRequest $request): RedirectResponse
    {
        $product = DB::transaction(function () use ($request) {
            $validated = $request->validated();

            $product = Product::create([
                'title' => $validated['title'],
                'slug' => $this->uniqueSlug($validated['slug'] ?? null, $validated['title']),
                'type' => $validated['type'],
                'price' => $validated['price'],
                'sale_price' => $validated['sale_price'] ?? null,
                'stock_quantity' => $validated['stock_quantity'] ?? null,
                'manage_stock' => $validated['manage_stock'],
                'is_active' => $validated['is_active'],
                ''
            ]);

            $product->categories()->sync($validated['category_ids']);
            $this->storeImages($product, $request->file('images', []), (int) $request->input('primary_index', 0));

            return $product;
        });

        return redirect()
            ->route('admin.products.show', $product)
            ->with('success', 'Produit créé.');
    }

    public function show(Product $product): Response
    {
        $this->authorize('view', $product);

        $product->load(['categories', 'images']);

        return Inertia::render('Admin/Products/Show', [
            'product' => $product,
        ]);
    }

    public function edit(Product $product): Response
    {
        $this->authorize('update', $product);

        $product->load(['categories', 'images']);

        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
            'categories' => $this->categoryOptions(),
            'types' => collect(ProductType::cases())->map(fn ($type) => $type->value),
        ]);
    }

    public function update(AdminProductRequest $request, Product $product): RedirectResponse
    {
        DB::transaction(function () use ($request, $product) {
            $validated = $request->validated();

            $product->update([
                'title' => $validated['title'],
                'slug' => $this->uniqueSlug($validated['slug'] ?? null, $validated['title'], $product->id),
                'type' => $validated['type'],
                'price' => $validated['price'],
                'sale_price' => $validated['sale_price'] ?? null,
                'stock_quantity' => $validated['stock_quantity'] ?? null,
                'manage_stock' => $validated['manage_stock'],
                'is_active' => $validated['is_active'],
            ]);

            $product->categories()->sync($validated['category_ids']);

            $removedIds = $validated['removed_image_ids'] ?? [];

            if ($removedIds !== []) {
                $product->images()
                    ->whereIn('id', $removedIds)
                    ->get()
                    ->each
                    ->delete();
            }

            $newFiles = $request->file('images', []) ?? [];
            $this->storeImages(
                $product->fresh('images'),
                $newFiles,
                (int) $request->input('primary_index', 0),
                $request->integer('existing_primary_id') ?: null
            );
        });

        return redirect()
            ->route('admin.products.show', $product)
            ->with('success', 'Produit mis à jour.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $this->authorize('delete', $product);

        $product->delete();

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Produit désactivé (corbeille).');
    }

    public function restore(int $id): RedirectResponse
    {
        $model = Product::withTrashed()->findOrFail($id);

        $this->authorize('restore', $model);

        $model->restore();

        return back()->with('success', 'Produit restauré.');
    }

    public function deactivate(Product $product): RedirectResponse
    {
        $this->authorize('update', $product);

        $product->update(['is_active' => false]);

        return back()->with('success', 'Produit désactivé.');
    }

    /**
     * @return \Illuminate\Support\Collection<int, array<string, mixed>>
     */
    private function categoryOptions()
    {
        return Category::query()
            ->with('parent:id,name')
            ->orderBy('name')
            ->get(['id', 'name', 'parent_id'])
            ->map(fn (Category $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'parent_id' => $category->parent_id,
                'label' => $category->parent
                    ? $category->parent->name.' / '.$category->name
                    : $category->name,
            ]);
    }

    private function uniqueSlug(?string $slug, string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($slug ?: $title) ?: 'product';
        $candidate = $base;
        $i = 1;

        while (
            Product::withTrashed()
                ->where('slug', $candidate)
                ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $candidate = $base.'-'.$i;
            $i++;
        }

        return $candidate;
    }

    /**
     * @param  array<int, \Illuminate\Http\UploadedFile>|null  $files
     */
    private function storeImages(
        Product $product,
        ?array $files,
        int $newPrimaryIndex = 0,
        ?int $existingPrimaryId = null
    ): void {
        $files = array_values(array_filter($files ?? []));
        $startOrder = (int) $product->images()->max('sort_order') + 1;

        foreach ($files as $index => $file) {
            $path = $file->store('products/'.$product->slug, 'public');

            $product->images()->create([
                'path' => $path,
                'alt_text' => $product->title,
                'sort_order' => $startOrder + $index,
                'is_primary' => false,
            ]);
        }

        $product->unsetRelation('images');
        $images = $product->images()->orderBy('sort_order')->get();

        if ($images->isEmpty()) {
            return;
        }

        $product->images()->update(['is_primary' => false]);

        if ($existingPrimaryId && $images->contains('id', $existingPrimaryId)) {
            ProductImage::query()
                ->where('id', $existingPrimaryId)
                ->update(['is_primary' => true]);

            return;
        }

        if ($files !== [] && isset($files[$newPrimaryIndex])) {
            $created = $images->slice(-count($files))->values();
            $primary = $created->get($newPrimaryIndex) ?? $created->first();
            $primary?->update(['is_primary' => true]);

            return;
        }

        $current = $images->firstWhere('is_primary', true) ?? $images->first();
        $current->update(['is_primary' => true]);
    }
}
