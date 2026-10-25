<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('landing_section_settings', function (Blueprint $table) {
            $table->id();
            $table->string('section')->unique(); // 'about' | 'services' | 'programs' | 'reviews'
            $table->json('draft_config')->nullable();
            $table->json('published_config')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('landing_section_settings');
    }
};
