<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class GymCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Supplements' => [
                'Whey Protein',
                'Creatine',
                'Mass Gainer',
                'Pre-Workout',
                'BCAA',
                'Vitamins',
                'Protein Bars',
            ],

            'Clothing' => [
                'T-Shirts',
                'Tank Tops',
                'Shorts',
                'Joggers',
                'Hoodies',
                'Leggings',
            ],

            'Equipment' => [
                'Dumbbells',
                'Kettlebells',
                'Resistance Bands',
                'Yoga Mats',
                'Ab Equipment',
            ],

            'Accessories' => [
                'Shakers',
                'Gym Bags',
                'Gloves',
                'Lifting Straps',
                'Wrist Wraps',
                'Weightlifting Belts',
            ],
        ];

        foreach ($categories as $parentName => $children) {

            $parent = Category::create([
                'name' => $parentName,
                'slug' => Str::slug($parentName),
                'parent_id' => null,
            ]);

            foreach ($children as $childName) {

                Category::create([
                    'name' => $childName,
                    'slug' => Str::slug($childName),
                    'parent_id' => $parent->id,
                ]);
            }
        }
    }
}