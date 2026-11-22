<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;

class ProductImageSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            'optimum-nutrition-gold-standard-whey' => [
                'folder' => 'whey',
                'images' => [
                    ['file' => 'cover.webp', 'primary' => true],
                    ['file' => 'front.webp', 'primary' => false],
                    ['file' => 'nutrition.webp', 'primary' => false],
                ],
            ],

            'creatine-monohydrate' => [
                'folder' => 'creatine',
                'images' => [
                    ['file' => 'cover.webp', 'primary' => true],
                    ['file' => 'front.webp', 'primary' => false],
                ],
            ],

            'optimum-nutrition-serious-mass' => [
                'folder' => 'serious-mass',
                'images' => [
                    ['file' => 'cover.webp', 'primary' => true],
                    ['file' => 'front.webp', 'primary' => false],
                ],
            ],
            'straps' => [
                'folder' => 'straps',
                'images' => [
                    ['file' => 'cover.webp', 'primary' => true],
                    ['file' => 'front.webp', 'primary' => false],
                ],
            ],

            'gold-standard-pre-workout' => [
                'folder' => 'pre-workout',
                'images' => [
                    ['file' => 'cover.webp', 'primary' => true],
                    ['file' => 'front.webp', 'primary' => false],
                ],
            ],

            'bcaa-amino-energy' => [
                'folder' => 'bcaa',
                'images' => [
                    ['file' => 'cover.webp', 'primary' => true],
                    ['file' => 'front.webp', 'primary' => false],
                ],
            ],

            'programme-transformation-12-semaines-digital' => [
                'custom_paths' => [
                    ['path' => 'images/tran1.jpeg', 'primary' => true],
                    ['path' => 'images/tran1after.jpeg', 'primary' => false],
                ],
            ],

            'guide-nutrition-recettes-fitness' => [
                'custom_paths' => [
                    ['path' => 'images/nutrition.jpg', 'primary' => true],
                    ['path' => 'images/1.jpg', 'primary' => false],
                ],
            ],
        ];

        foreach ($products as $slug => $data) {

            $product = Product::where('slug', $slug)->first();

            if (!$product) {
                continue;
            }

            if (!empty($data['custom_paths'])) {
                foreach ($data['custom_paths'] as $index => $img) {
                    ProductImage::create([
                        'product_id' => $product->id,
                        'path' => $img['path'],
                        'alt_text' => $product->title . ' - image ' . ($index + 1),
                        'sort_order' => $index,
                        'is_primary' => $img['primary'],
                    ]);
                }
                continue;
            }

            foreach ($data['images'] as $index => $image) {

                ProductImage::create([
                    'product_id' => $product->id,

                    'path' =>
                        "products/{$data['folder']}/{$image['file']}",

                    'alt_text' =>
                        $product->title . ' - image ' . ($index + 1),

                    'sort_order' => $index,

                    'is_primary' => $image['primary'],
                ]);
            }
        }
    }
}