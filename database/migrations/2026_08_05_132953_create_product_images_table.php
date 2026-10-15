<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Product;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('product_images', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Product::class)->constrained()->cascadeOnDelete();
            
            $table->string('path'); // ex: products/12/thumbnail-cover.webp
            $table->string('alt_text')->nullable(); // SEO & Accessibilité
            $table->unsignedInteger('sort_order')->default(0); // Ordre dans la galerie
            $table->boolean('is_primary')->default(false); // Image principale
            
            $table->timestamps();

            // Index pour récupérer rapidement la galerie ordonnée d'un produit
            $table->index(['product_id', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_images');
    }
};
