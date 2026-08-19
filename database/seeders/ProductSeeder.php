<?php

namespace Database\Seeders;

use App\Enums\ProductType;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Categories
        |--------------------------------------------------------------------------
        */

        $protein = Category::where('slug', 'protein')->firstOrFail();
        $creatine = Category::where('slug', 'creatine')->firstOrFail();
        $preWorkout = Category::where('slug', 'pre-workout')->firstOrFail();
        $bcaa = Category::where('slug', 'bcaa')->firstOrFail();
        $massGainer = Category::where('slug', 'mass-gainer')->firstOrFail();
        $straps = Category::where('slug', 'straps')->firstOrFail();

        /*
        |--------------------------------------------------------------------------
        | 1. Optimum Nutrition Gold Standard Whey
        |--------------------------------------------------------------------------
        */

        $whey = Product::create([
            'title' => 'Optimum Nutrition Gold Standard Whey',
            'slug' => 'optimum-nutrition-gold-standard-whey',
            'type' => ProductType::PHYSICAL,
            'price' => 749.00,
            'sale_price' => 699.00,
            'stock_quantity' => 50,
            'manage_stock' => true,
            'is_active' => true,
        ]);

        $whey->categories()->attach($protein->id);

        /*
        |--------------------------------------------------------------------------
        | 2. Creatine Monohydrate
        |--------------------------------------------------------------------------
        */

        $creatineProduct = Product::create([
            'title' => 'Creatine Monohydrate',
            'slug' => 'creatine-monohydrate',
            'type' => ProductType::PHYSICAL,
            'price' => 299.00,
            'sale_price' => 269.00,
            'stock_quantity' => 100,
            'manage_stock' => true,
            'is_active' => true,
        ]);

        $creatineProduct->categories()->attach($creatine->id);

        /*
        |--------------------------------------------------------------------------
        | 3. Serious Mass
        |--------------------------------------------------------------------------
        */

        $seriousMass = Product::create([
            'title' => 'Optimum Nutrition Serious Mass',
            'slug' => 'optimum-nutrition-serious-mass',
            'type' => ProductType::PHYSICAL,
            'price' => 899.00,
            'sale_price' => 849.00,
            'stock_quantity' => 40,
            'manage_stock' => true,
            'is_active' => true,
        ]);

        $seriousMass->categories()->attach($massGainer->id);

        /*
        |--------------------------------------------------------------------------
        | 4. Pre-Workout
        |--------------------------------------------------------------------------
        */

        $preWorkoutProduct = Product::create([
            'title' => 'Gold Standard Pre-Workout',
            'slug' => 'gold-standard-pre-workout',
            'type' => ProductType::PHYSICAL,
            'price' => 499.00,
            'sale_price' => 449.00,
            'stock_quantity' => 60,
            'manage_stock' => true,
            'is_active' => true,
        ]);

        $preWorkoutProduct->categories()->attach($preWorkout->id);

        /*
        |--------------------------------------------------------------------------
        | 5. BCAA
        |--------------------------------------------------------------------------
        */

        $bcaaProduct = Product::create([
            'title' => 'BCAA Amino Energy',
            'slug' => 'bcaa-amino-energy',
            'type' => ProductType::PHYSICAL,
            'price' => 429.00,
            'sale_price' => 389.00,
            'stock_quantity' => 70,
            'manage_stock' => true,
            'is_active' => true,
        ]);

        $bcaaProduct->categories()->attach($bcaa->id);

        /*
        |--------------------------------------------------------------------------
        | 6. Straps
        |--------------------------------------------------------------------------
        */

        $strapsProduct = Product::create([
            'title' => 'Straps',
            'slug' => 'straps',
            'type' => ProductType::PHYSICAL,
            'price' => 199.00,
            'sale_price' => 99.00,
            'stock_quantity' => 80,
            'manage_stock' => true,
            'is_active' => true,
        ]);

        $strapsProduct->categories()->attach($straps->id);
    }
}