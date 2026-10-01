<?php

use App\Models\Order;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ameex_shipments', function (Blueprint $table) {
            $table->id();

            // Order
            $table->foreignId('order_id')
                ->unique()
                ->constrained('orders')
                ->cascadeOnDelete();

            // Local AMEEX city record
            $table->foreignId('ameex_city_record_id')
                ->constrained('ameex_cities')
                ->restrictOnDelete();

            // Parcel code returned by AMEEX
            $table->string('parcel_code', 100)->unique();

            // Current AMEEX status
            $table->string('status', 100)->nullable();
            $table->string('status_name')->nullable();
            $table->string('status_color', 50)->nullable();

            // Sub-status
            $table->string('sub_status', 100)->nullable();
            $table->string('sub_status_name')->nullable();
            $table->string('sub_status_color', 50)->nullable();

            // AMEEX comment
            $table->text('comment')->nullable();

            // 1 = Sandbox / 0 = Production
            $table->boolean('sandbox')->default(true);

            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ameex_shipments');
    }
};