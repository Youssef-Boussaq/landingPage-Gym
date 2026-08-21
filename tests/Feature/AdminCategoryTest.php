<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('customers cannot manage categories', function () {
    $user = User::factory()->create(['role' => 'customer']);
    $category = Category::factory()->create();

    $this->actingAs($user)->get(route('admin.categories.index'))->assertForbidden();
    $this->actingAs($user)->get(route('admin.categories.create'))->assertForbidden();
    $this->actingAs($user)->get(route('admin.categories.show', $category))->assertForbidden();
    $this->actingAs($user)->get(route('admin.categories.edit', $category))->assertForbidden();
});

test('admin can create a root category and a child category', function () {
    Storage::fake('public');
    $admin = User::factory()->admin()->create();
    $parent = Category::factory()->create(['name' => 'Supplements', 'slug' => 'supplements-test']);

    $this->actingAs($admin)
        ->post(route('admin.categories.store'), [
            'name' => 'Protein Extra',
            'slug' => 'protein-extra',
            'parent_id' => $parent->id,
            'media' => [UploadedFile::fake()->image('cover.jpg')],
            'primary_index' => 0,
        ])
        ->assertRedirect();

    $child = Category::query()->where('slug', 'protein-extra')->first();

    expect($child)->not->toBeNull();
    expect($child->parent_id)->toBe($parent->id);
    expect($child->media)->toHaveCount(1);
    expect($child->media->first()->is_primary)->toBeTrue();
    expect($child->media->first()->type)->toBe('image');
});

test('admin cannot set a category as its own parent', function () {
    $admin = User::factory()->admin()->create();
    $category = Category::factory()->create();

    $this->actingAs($admin)
        ->put(route('admin.categories.update', $category), [
            'name' => $category->name,
            'slug' => $category->slug,
            'parent_id' => $category->id,
        ])
        ->assertSessionHasErrors('parent_id');
});

test('admin cannot create a circular hierarchy', function () {
    $admin = User::factory()->admin()->create();
    $root = Category::factory()->create(['name' => 'Supplements']);
    $child = Category::factory()->create([
        'name' => 'Protein',
        'parent_id' => $root->id,
    ]);

    $this->actingAs($admin)
        ->put(route('admin.categories.update', $root), [
            'name' => $root->name,
            'slug' => $root->slug,
            'parent_id' => $child->id,
        ])
        ->assertSessionHasErrors('parent_id');
});

test('admin cannot delete a category that has children', function () {
    $admin = User::factory()->admin()->create();
    $root = Category::factory()->create();
    Category::factory()->create(['parent_id' => $root->id]);

    $this->actingAs($admin)
        ->from(route('admin.categories.index'))
        ->delete(route('admin.categories.destroy', $root))
        ->assertRedirect(route('admin.categories.index'));

    expect(session('error'))->toBe('Cannot delete this category because it contains child categories.');
    expect($root->fresh())->not->toBeNull();
});

test('admin cannot delete a category that has products', function () {
    $admin = User::factory()->admin()->create();
    $category = Category::factory()->create();
    $product = Product::factory()->create();
    $category->products()->attach($product->id);

    $this->actingAs($admin)
        ->from(route('admin.categories.index'))
        ->delete(route('admin.categories.destroy', $category))
        ->assertRedirect(route('admin.categories.index'));

    expect(session('error'))->toBe('Cannot delete this category because products are attached to it.');
    expect($category->fresh())->not->toBeNull();
});

test('admin can delete an empty category', function () {
    $admin = User::factory()->admin()->create();
    $category = Category::factory()->create();

    $this->actingAs($admin)
        ->delete(route('admin.categories.destroy', $category))
        ->assertRedirect(route('admin.categories.index'));

    expect(Category::query()->find($category->id))->toBeNull();
});

test('admin can upload a video and mark one media as primary', function () {
    Storage::fake('public');
    $admin = User::factory()->admin()->create();
    $category = Category::factory()->create(['slug' => 'accessories-test']);

    $this->actingAs($admin)
        ->put(route('admin.categories.update', $category), [
            'name' => $category->name,
            'slug' => $category->slug,
            'parent_id' => null,
            'media' => [
                UploadedFile::fake()->image('cover.webp'),
                UploadedFile::fake()->create('video.mp4', 200, 'video/mp4'),
            ],
            'primary_index' => 1,
        ])
        ->assertRedirect();

    $category->refresh()->load('media');

    expect($category->media)->toHaveCount(2);
    expect($category->media->where('is_primary', true))->toHaveCount(1);
    expect($category->media->firstWhere('is_primary', true)->type)->toBe('video');
});
