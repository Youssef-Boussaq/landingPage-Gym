<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\CategoryMedia;
use Illuminate\Database\Seeder;

class CategoryMediaSeeder extends Seeder
{
    public function run(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Supplements
        |--------------------------------------------------------------------------
        |
        | Category ID: 1
        | Slug: supplements
        |
        */

        $supplements = Category::where('slug', 'supplements')
            ->firstOrFail();

        $this->createMedia(
            category: $supplements,
            type: 'video',
            path: 'categories/supplements/video.mp4',
            alt: 'Supplements',
            sortOrder: 0,
            isPrimary: true,
        );


        /*
        |--------------------------------------------------------------------------
        | Gym Equipment
        |--------------------------------------------------------------------------
        |
        | Category ID: 7
        | Slug: gym-equipment
        |
        */

        $gymEquipment = Category::where('slug', 'gym-equipment')
            ->firstOrFail();

        $this->createMedia(
            category: $gymEquipment,
            type: 'image',
            path: 'categories/gym-equipment/cover.webp',
            alt: 'Gym Equipment',
            sortOrder: 0,
            isPrimary: true,
        );


        /*
        |--------------------------------------------------------------------------
        | Gym Accessories
        |--------------------------------------------------------------------------
        |
        | Category ID: 11
        | Slug: gym-accessories
        |
        */

        $gymAccessories = Category::where('slug', 'gym-accessories')
            ->firstOrFail();

        $this->createMedia(
            category: $gymAccessories,
            type: 'image',
            path: 'categories/accessories/cover.webp',
            alt: 'Gym Accessories',
            sortOrder: 0,
            isPrimary: false,
        );

        $this->createMedia(
            category: $gymAccessories,
            type: 'image',
            path: 'categories/accessories/accessories.webp',
            alt: 'Gym Accessories Collection',
            sortOrder: 1,
            isPrimary: true,
        );
        $this->createMedia(
            category: $gymAccessories,
            type: 'image',
            path: 'categories/accessories/front.webp',
            alt: 'Gym Accessories Collection',
            sortOrder: 2,
            isPrimary: false,
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Create / Update Category Media
    |--------------------------------------------------------------------------
    */

    private function createMedia(
        Category $category,
        string $type,
        string $path,
        ?string $alt = null,
        int $sortOrder = 0,
        bool $isPrimary = false,
    ): void {
        CategoryMedia::updateOrCreate(
            [
                'category_id' => $category->id,
                'path' => $path,
            ],
            [
                'type' => $type,
                'alt_text' => $alt,
                'sort_order' => $sortOrder,
                'is_primary' => $isPrimary,
            ]
        );
    }
}