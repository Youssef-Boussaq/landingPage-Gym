<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use App\Enums\ProductType;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            
            // Type : 'physical' ou 'digital'
            $table->string('type')->default(ProductType::DIGITAL->value);
            
            $table->decimal('price', 10, 2);
            $table->decimal('sale_price', 10, 2)->nullable();
            
            // Stock (NULL si produit digital non limité)
            $table->integer('stock_quantity')->nullable();
            $table->boolean('manage_stock')->default(false);
            
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes(); // Recommandé pour ne pas casser les anciennes commandes

            // Index de performance pour les filtres du catalogue
            $table->index(['is_active', 'type']);
            $table->index('slug');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
