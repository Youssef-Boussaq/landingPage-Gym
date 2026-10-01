<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ameex_cities', function (Blueprint $table) {
            $table->id();

            // ID de la ville fourni par AMEEX
            $table->unsignedBigInteger('ameex_id')->unique();

            // Informations de la ville
            $table->string('name');
            $table->string('name_ar')->nullable();
            $table->string('name_fr')->nullable();

            // Disponibilité de la ville chez AMEEX
            $table->boolean('active')->default(true)->index();

            // Réponse originale de l'API AMEEX
            $table->json('raw_data')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ameex_cities');
    }
};