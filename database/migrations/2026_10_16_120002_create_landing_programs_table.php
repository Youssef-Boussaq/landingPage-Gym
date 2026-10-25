<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('landing_programs', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('price');            // stored as string to support formatted values
            $table->string('currency')->default('MAD');
            $table->string('period')->nullable();
            $table->json('benefits')->nullable(); // array of benefit strings
            $table->boolean('is_popular')->default(false);
            $table->boolean('is_enabled')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->string('cta_label')->default('Choose Plan');
            $table->text('whatsapp_message')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('landing_programs');
    }
};
