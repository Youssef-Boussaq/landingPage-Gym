<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Supplements
        |--------------------------------------------------------------------------
        */

        $supplements = Category::create([
            'name' => 'Supplements',
            'slug' => 'supplements',
        ]);

        foreach ([
            'Protein',
            'Creatine',
            'Mass Gainer',
            'Pre-Workout',
            'Amino Acids',
            'Vitamins & Minerals',
        ] as $name) {
            Category::create([
                'parent_id' => $supplements->id,
                'name' => $name,
                'slug' => Str::slug($name),
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Clothing
        |--------------------------------------------------------------------------
        */

        $clothing = Category::create([
            'name' => 'Clothing',
            'slug' => 'clothing',
        ]);

        foreach ([
            'T-Shirts',
            'Shorts',
            'Pants',
            'Hoodies',
            'Gym Accessories',
        ] as $name) {
            Category::create([
                'parent_id' => $clothing->id,
                'name' => $name,
                'slug' => Str::slug($name),
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Equipment
        |--------------------------------------------------------------------------
        */

        $equipment = Category::create([
            'name' => 'Equipment',
            'slug' => 'equipment',
        ]);

        foreach ([
            'Dumbbells',
            'Resistance Bands',
            'Benches',
            'Gym Accessories',
        ] as $name) {
            Category::create([
                'parent_id' => $equipment->id,
                'name' => $name,
                'slug' => Str::slug($name),
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Nutrition
        |--------------------------------------------------------------------------
        */

        $nutrition = Category::create([
            'name' => 'Nutrition',
            'slug' => 'nutrition',
        ]);

        foreach ([
            'Protein Bars',
            'Healthy Snacks',
            'Drinks',
        ] as $name) {
            Category::create([
                'parent_id' => $nutrition->id,
                'name' => $name,
                'slug' => Str::slug($name),
            ]);
        }
    }
}