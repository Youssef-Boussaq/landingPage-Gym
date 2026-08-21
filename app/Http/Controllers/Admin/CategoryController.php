<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminCategoryRequest;
use App\Models\Category;
use App\Models\CategoryMedia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    use AuthorizesRequests;

    public function index(): Response
    {
        $this->authorize('viewAny', Category::class);

        $categories = Category::query()
            ->whereNull('parent_id')
            ->with([
                'primaryMedia',
                'children' => fn ($query) => $query
                    ->orderBy('name')
                    ->with('primaryMedia')
                    ->withCount(['children', 'products']),
            ])
            ->withCount(['children', 'products'])
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
            'stats' => [
                'total' => Category::query()->count(),
                'roots' => Category::query()->whereNull('parent_id')->count(),
                'children' => Category::query()->whereNotNull('parent_id')->count(),
            ],
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Category::class);

        return Inertia::render('Admin/Categories/Create', [
            'parentOptions' => $this->parentOptions(),
        ]);
    }

    public function store(AdminCategoryRequest $request): RedirectResponse
    {
        $category = DB::transaction(function () use ($request) {
            $validated = $request->validated();

            $category = Category::create([
                'name' => $validated['name'],
                'slug' => $this->uniqueSlug($validated['slug'] ?? null, $validated['name']),
                'parent_id' => $validated['parent_id'] ?? null,
            ]);

            $this->syncMedia(
                $category,
                $request->file('media', []) ?? [],
                (int) $request->input('primary_index', 0),
                null,
                $validated['alt_text'] ?? null,
            );

            return $category;
        });

        return redirect()
            ->route('admin.categories.show', $category)
            ->with('success', 'Category created successfully.');
    }

    public function show(Category $category): Response
    {
        $this->authorize('view', $category);

        $category->load([
            'parent:id,name,slug,parent_id',
            'children' => fn ($query) => $query->orderBy('name')->with('primaryMedia')->withCount('products'),
            'media',
            'products' => fn ($query) => $query
                ->with(['images', 'categories', 'primaryImage'])
                ->orderBy('title'),
        ]);

        return Inertia::render('Admin/Categories/Show', [
            'category' => $category,
        ]);
    }

    public function edit(Category $category): Response
    {
        $this->authorize('update', $category);

        $category->load(['media', 'parent:id,name']);

        return Inertia::render('Admin/Categories/Edit', [
            'category' => $category,
            'parentOptions' => $this->parentOptions($category),
        ]);
    }

    public function update(AdminCategoryRequest $request, Category $category): RedirectResponse
    {
        DB::transaction(function () use ($request, $category) {
            $validated = $request->validated();

            $category->update([
                'name' => $validated['name'],
                'slug' => $this->uniqueSlug($validated['slug'] ?? null, $validated['name'], $category->id),
                'parent_id' => $validated['parent_id'] ?? null,
            ]);

            $removedIds = $validated['removed_media_ids'] ?? [];

            if ($removedIds !== []) {
                $category->media()
                    ->whereIn('id', $removedIds)
                    ->get()
                    ->each
                    ->delete();
            }

            $this->syncMedia(
                $category->fresh('media'),
                $request->file('media', []) ?? [],
                (int) $request->input('primary_index', 0),
                $request->integer('existing_primary_id') ?: null,
                $validated['alt_text'] ?? null,
            );
        });

        return redirect()
            ->route('admin.categories.show', $category)
            ->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        $this->authorize('delete', $category);

        if ($category->children()->exists()) {
            return back()->with(
                'error',
                'Cannot delete this category because it contains child categories.'
            );
        }

        if ($category->products()->exists()) {
            return back()->with(
                'error',
                'Cannot delete this category because products are attached to it.'
            );
        }

        DB::transaction(function () use ($category) {
            $category->media()->get()->each->delete();
            $category->delete();
        });

        return redirect()
            ->route('admin.categories.index')
            ->with('success', 'Category deleted successfully.');
    }

    /**
     * @return \Illuminate\Support\Collection<int, array<string, mixed>>
     */
    private function parentOptions(?Category $current = null)
    {
        $excluded = $current
            ? array_merge([$current->id], $current->descendantIds())
            : [];

        return Category::query()
            ->with('parent:id,name')
            ->when($excluded !== [], fn ($query) => $query->whereNotIn('id', $excluded))
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

    private function uniqueSlug(?string $slug, string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($slug ?: $name) ?: 'category';
        $candidate = $base;
        $i = 1;

        while (
            Category::query()
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
     * @param  array<int, UploadedFile>|null  $files
     */
    private function syncMedia(
        Category $category,
        ?array $files,
        int $newPrimaryIndex = 0,
        ?int $existingPrimaryId = null,
        ?string $altText = null
    ): void {
        $files = array_values(array_filter($files ?? []));
        $startOrder = (int) $category->media()->max('sort_order');

        foreach ($files as $index => $file) {
            $extension = strtolower($file->getClientOriginalExtension());
            $type = in_array($extension, ['mp4', 'webm'], true) ? 'video' : 'image';
            $path = $file->store('categories/'.$category->slug, 'public');

            $category->media()->create([
                'type' => $type,
                'path' => $path,
                'alt_text' => $altText ?: $category->name,
                'sort_order' => $startOrder + $index + 1,
                'is_primary' => false,
            ]);
        }

        $category->unsetRelation('media');
        $media = $category->media()->orderBy('sort_order')->get();

        if ($media->isEmpty()) {
            return;
        }

        $primaryId = null;

        if ($existingPrimaryId && $media->contains('id', $existingPrimaryId)) {
            $primaryId = $existingPrimaryId;
        } elseif ($files !== [] && isset($files[$newPrimaryIndex])) {
            $created = $media->slice(-count($files))->values();
            $primaryId = optional($created->get($newPrimaryIndex) ?? $created->first())->id;
        } else {
            $primaryId = optional($media->firstWhere('is_primary', true) ?? $media->first())->id;
        }

        if (!$primaryId) {
            return;
        }

        CategoryMedia::query()
            ->where('category_id', $category->id)
            ->update(['is_primary' => false]);

        CategoryMedia::query()
            ->where('category_id', $category->id)
            ->where('id', $primaryId)
            ->update(['is_primary' => true]);
    }
}
