<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ameex_events', function (Blueprint $table) {
            $table->id();

            // AMEEX shipment
            $table->foreignId('ameex_shipment_id')
                ->constrained('ameex_shipments')
                ->cascadeOnDelete();

            // AMEEX parcel code
            $table->string('parcel_code', 100);

            // Status
            $table->string('status', 100);
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

            // Complete webhook payload
            $table->json('raw_payload');

            // When our application received the webhook
            $table->timestamp('received_at');

            $table->timestamps();

            $table->index('parcel_code');
            $table->index('status');
            $table->index('received_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ameex_events');
    }
};