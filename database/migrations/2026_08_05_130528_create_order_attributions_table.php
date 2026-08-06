<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Order;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('order_attributions', function (Blueprint $table) {
           $table->id();
            
            // Relation 1:1 stricte avec la commande (unique)
            $table->foreignIdFor(Order::class)->unique()->constrained()->cascadeOnDelete();
            
            // Paramètres UTM
            $table->string('utm_source', 100)->nullable();
            $table->string('utm_medium', 100)->nullable();
            $table->string('utm_campaign', 100)->nullable();
            $table->string('utm_content', 100)->nullable();
            
            // IDs de clics Publicitaires (Crucial pour Meta CAPI & Google Ads)
            $table->string('fbclid', 255)->nullable();
            $table->string('gclid', 255)->nullable();
            
            $table->text('referer_url')->nullable();
            $table->timestamps();

            // Index analytiques pour grouper rapidement par canal / campagne
            $table->index(['utm_source', 'utm_campaign']);
            $table->index('fbclid');
            $table->index('gclid');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_attributions');
    }
};
