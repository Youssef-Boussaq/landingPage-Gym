<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\User;

use App\Enums\OrderStatus;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            
            // Client associé (nullable si commande invité / guest checkout)
            $table->foreignIdFor(User::class)->nullable()->constrained()->nullOnDelete();
            
            $table->string('order_number', 50)->unique(); // Ex: ORD-2026-00001
            $table->string('status')->default(OrderStatus::PENDING->value);
            
            $table->decimal('total_amount', 10, 2);
            $table->string('payment_method', 50); // ex: stripe, paypal
            $table->string('transaction_id')->nullable(); // Reference du gateway
            
            $table->timestamps();
            
            // Index pour le dashboard admin et filtres rapides
            $table->index(['status', 'created_at']);
            $table->index('order_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
