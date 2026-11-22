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

        /*
        |--------------------------------------------------------------------------
        | 7-15. Additional Catalog Products
        |--------------------------------------------------------------------------
        */

        $dumbbellsCat = Category::where('slug', 'dumbbells')->first();
        $resistanceCat = Category::where('slug', 'resistance-bands')->first();
        $benchesCat = Category::where('slug', 'benches')->first();
        $shakersCat = Category::where('slug', 'shaker-bottles')->first();
        $bagsCat = Category::where('slug', 'gym-bags')->first();
        $beltsCat = Category::where('slug', 'lifting-belts')->first();
        $digitalCat = Category::where('slug', 'ebooks-guides')->first() ?? Category::where('slug', 'programmes-digitaux')->first();

        $extraProducts = [
            7 => ['title' => 'Haltères Hexagonaux 15kg (Paire)', 'slug' => 'halteres-hexagonaux-15kg', 'price' => 599.00, 'sale' => 549.00, 'cat' => $dumbbellsCat?->id, 'type' => ProductType::PHYSICAL, 'stock' => 25],
            8 => ['title' => 'Bandes de Résistance Élastiques Pro', 'slug' => 'bandes-resistance-pro', 'price' => 179.00, 'sale' => 149.00, 'cat' => $resistanceCat?->id, 'type' => ProductType::PHYSICAL, 'stock' => 60],
            9 => ['title' => 'Banc de Musculation Réglable Multiposition', 'slug' => 'banc-musculation-reglable', 'price' => 1499.00, 'sale' => 1299.00, 'cat' => $benchesCat?->id, 'type' => ProductType::PHYSICAL, 'stock' => 15],
            10 => ['title' => 'Shaker Pro Inox 750ml Isotherme', 'slug' => 'shaker-pro-inox-750ml', 'price' => 149.00, 'sale' => 119.00, 'cat' => $shakersCat?->id, 'type' => ProductType::PHYSICAL, 'stock' => 80],
            11 => ['title' => 'Sac de Sport Gym Duffel Bag 45L', 'slug' => 'sac-de-sport-gym-45l', 'price' => 349.00, 'sale' => 299.00, 'cat' => $bagsCat?->id, 'type' => ProductType::PHYSICAL, 'stock' => 35],
            12 => ['title' => 'Ceinture de Force Cuir Véritable', 'slug' => 'ceinture-de-force-cuir', 'price' => 399.00, 'sale' => 349.00, 'cat' => $beltsCat?->id, 'type' => ProductType::PHYSICAL, 'stock' => 45],
            13 => ['title' => 'Whey Isolate Native 2kg Chocolat', 'slug' => 'whey-isolate-native-2kg', 'price' => 849.00, 'sale' => 799.00, 'cat' => $protein->id, 'type' => ProductType::PHYSICAL, 'stock' => 30],
            14 => ['title' => 'Créatine Creapure 500g Ultra Pure', 'slug' => 'creatine-creapure-500g', 'price' => 349.00, 'sale' => 319.00, 'cat' => $creatine->id, 'type' => ProductType::PHYSICAL, 'stock' => 50],
            15 => ['title' => 'Booster Pre-Workout Explosion 300g', 'slug' => 'booster-pre-workout-explosion', 'price' => 459.00, 'sale' => 419.00, 'cat' => $preWorkout->id, 'type' => ProductType::PHYSICAL, 'stock' => 40],
        ];

        foreach ($extraProducts as $id => $data) {
            $p = Product::create([
                'id' => $id,
                'title' => $data['title'],
                'slug' => $data['slug'],
                'type' => $data['type'],
                'price' => $data['price'],
                'sale_price' => $data['sale'],
                'stock_quantity' => $data['stock'],
                'manage_stock' => true,
                'is_active' => true,
                'description' => '<p>Produit de haute performance pour vos séances d\'entraînement intensives et votre récupération.</p>',
            ]);
            if (!empty($data['cat'])) {
                $p->categories()->attach($data['cat']);
            }
        }

        /*
        |--------------------------------------------------------------------------
        | 16. Digital Product: Programme Transformation 12 Semaines
        |--------------------------------------------------------------------------
        */

        $digitalProduct16 = Product::create([
            'id' => 16,
            'title' => 'Programme Transformation 12 Semaines (Digital)',
            'slug' => 'programme-transformation-12-semaines-digital',
            'type' => ProductType::DIGITAL,
            'price' => 199.00,
            'sale_price' => 149.00,
            'stock_quantity' => null,
            'manage_stock' => false,
            'is_active' => true,
            'description' => '<p>Programme digital complet d\'entraînement et de nutrition sur 12 semaines pour prise de masse sèche et transformation physique. Accès immédiat en téléchargement PDF avec plans d\'exercices détaillés, conseils macro et vidéos de démonstration.</p>',
        ]);

        if ($digitalCat) {
            $digitalProduct16->categories()->attach($digitalCat->id);
        }

        /*
        |--------------------------------------------------------------------------
        | 17. Digital Product: Guide Nutrition & Recettes Fitness
        |--------------------------------------------------------------------------
        */

        $digitalProduct17 = Product::create([
            'id' => 17,
            'title' => 'Guide Nutrition & Recettes Fitness (E-book)',
            'slug' => 'guide-nutrition-recettes-fitness',
            'type' => ProductType::DIGITAL,
            'price' => 129.00,
            'sale_price' => 99.00,
            'stock_quantity' => null,
            'manage_stock' => false,
            'is_active' => true,
            'description' => '<p>Plus de 50 recettes équilibrées, délicieuses et faciles à préparer pour booster votre énergie, optimiser votre récupération musculaire et atteindre vos objectifs de composition corporelle.</p>',
        ]);

        if ($digitalCat) {
            $digitalProduct17->categories()->attach($digitalCat->id);
        }
    }
}