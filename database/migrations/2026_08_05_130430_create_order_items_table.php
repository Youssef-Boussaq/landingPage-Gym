<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Order;
use App\Models\Product;


return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
          $table->id();
            
            $table->foreignIdFor(Order::class)->constrained()->cascadeOnDelete();
            
            // Si le produit est supprimé plus tard, la ligne de commande conserve son historique
            $table->foreignIdFor(Product::class)->nullable()->constrained()->nullOnDelete();
            
            $table->unsignedInteger('quantity');
            $table->decimal('unit_price', 10, 2); // Prix fixe au moment de l'achat
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
