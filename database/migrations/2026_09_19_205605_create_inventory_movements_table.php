<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Product;
use App\Models\Order;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Product::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Order::class)->nullable()->constrained()->nullOnDelete();
            $table->string('type'); // reserve, release, ship, return
            $table->integer('quantity');
            $table->timestamps();

            // To guarantee idempotency per order/product/type
            $table->unique(['order_id', 'product_id', 'type'], 'idx_unique_movement');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_movements');
    }
};
