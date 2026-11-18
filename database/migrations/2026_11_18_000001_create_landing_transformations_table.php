<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('landing_transformations', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');                      // "12 Weeks Transformation"
            $table->string('program')->nullable();         // "Weight Loss"
            $table->string('before_image')->nullable();    // storage path or public path
            $table->string('before_image_alt')->nullable();
            $table->string('after_image')->nullable();     // storage path or public path
            $table->string('after_image_alt')->nullable();
            $table->string('result_badge')->default('Real Result'); // floating badge text
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_enabled')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('landing_transformations');
    }
};

