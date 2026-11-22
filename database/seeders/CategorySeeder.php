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

        $protein = Category::create([
            'parent_id' => $supplements->id,
            'name' => 'Protein',
            'slug' => 'protein',
        ]);

        $creatine = Category::create([
            'parent_id' => $supplements->id,
            'name' => 'Creatine',
            'slug' => 'creatine',
        ]);

        $preWorkout = Category::create([
            'parent_id' => $supplements->id,
            'name' => 'Pre-Workout',
            'slug' => 'pre-workout',
        ]);

        $bcaa = Category::create([
            'parent_id' => $supplements->id,
            'name' => 'BCAA',
            'slug' => 'bcaa',
        ]);

        $massGainer = Category::create([
            'parent_id' => $supplements->id,
            'name' => 'Mass Gainer',
            'slug' => 'mass-gainer',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Gym Equipment
        |--------------------------------------------------------------------------
        */

        $equipment = Category::create([
            'name' => 'Gym Equipment',
            'slug' => 'gym-equipment',
        ]);

        Category::create([
            'parent_id' => $equipment->id,
            'name' => 'Dumbbells',
            'slug' => 'dumbbells',
        ]);

        Category::create([
            'parent_id' => $equipment->id,
            'name' => 'Resistance Bands',
            'slug' => 'resistance-bands',
        ]);

        Category::create([
            'parent_id' => $equipment->id,
            'name' => 'Benches',
            'slug' => 'benches',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Gym Accessories
        |--------------------------------------------------------------------------
        */

        $accessories = Category::create([
            'name' => 'Gym Accessories',
            'slug' => 'gym-accessories',
        ]);

        Category::create([
            'parent_id' => $accessories->id,
            'name' => 'Straps',
            'slug' => 'straps',
        ]);

        Category::create([
            'parent_id' => $accessories->id,
            'name' => 'Shaker Bottles',
            'slug' => 'shaker-bottles',
        ]);

        Category::create([
            'parent_id' => $accessories->id,
            'name' => 'Gym Bags',
            'slug' => 'gym-bags',
        ]);

        Category::create([
            'parent_id' => $accessories->id,
            'name' => 'Lifting Belts',
            'slug' => 'lifting-belts',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Digital Programs
        |--------------------------------------------------------------------------
        */

        $programsCategory = Category::create([
            'name' => 'Programmes Digitaux',
            'slug' => 'programmes-digitaux',
        ]);

        Category::create([
            'parent_id' => $programsCategory->id,
            'name' => 'E-books & Guides',
            'slug' => 'ebooks-guides',
        ]);

        Category::create([
            'parent_id' => $programsCategory->id,
            'name' => 'Plans Entraînement',
            'slug' => 'plans-entrainement',
        ]);
    }
}