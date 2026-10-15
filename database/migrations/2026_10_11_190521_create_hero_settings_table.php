
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hero_settings', function (Blueprint $table) {
            $table->id();

            $table->string('badge')->default('FIT YOUNESS');

            $table->string('title_line1')->default('TRANSFORME.');
            $table->string('title_line2')->default('DÉPASSE-TOI.');
            $table->string('title_line3')->default('RÉUSSIS.');

            $table->string('keywords')
                ->default('Coaching Sur-Mesure • Nutrition • Suivi 24/7');

            $table->string('cta_text')->default('DÉMARRER');
            $table->string('cta_href')->default('#contact');

            $table->string('background_image')->nullable();
            $table->string('coach_image')->nullable();
            $table->string('coach_image_alt')->default('Coach Fit Youness');

            $table->boolean('show_badge')->default(true);
            $table->boolean('show_title')->default(true);
            $table->boolean('show_keywords')->default(true);
            $table->boolean('show_cta')->default(true);
            $table->boolean('show_coach_image')->default(true);
            $table->boolean('show_background_image')->default(true);
            $table->boolean('show_slashes')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hero_settings');
    }
};
