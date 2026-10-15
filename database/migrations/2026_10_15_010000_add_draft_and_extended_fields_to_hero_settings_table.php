<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('hero_settings', function (Blueprint $table) {
            $table->text('description')->nullable()->after('keywords');
            $table->string('title_highlight')->nullable()->after('title_line1');
            $table->string('secondary_cta_text')->nullable()->after('cta_href');
            $table->string('secondary_cta_href')->nullable()->after('secondary_cta_text');
            $table->string('stat_value')->nullable()->after('secondary_cta_href');
            $table->string('stat_label')->nullable()->after('stat_value');
            $table->string('experience_badge_text')->nullable()->after('stat_label');
            $table->string('portrait_focal')->default('center')->after('experience_badge_text');

            $table->boolean('show_description')->default(true)->after('show_keywords');
            $table->boolean('show_secondary_cta')->default(true)->after('show_cta');
            $table->boolean('show_stat')->default(true)->after('show_secondary_cta');
            $table->boolean('show_experience_badge')->default(true)->after('show_stat');

            $table->string('layout_variant')->default('editorial-split')->after('show_slashes');
            $table->string('text_alignment')->default('auto')->after('layout_variant');
            $table->string('background_style')->default('subtle-glow')->after('text_alignment');

            $table->json('draft_config')->nullable()->after('background_style');
            $table->json('published_config')->nullable()->after('draft_config');
            $table->timestamp('published_at')->nullable()->after('published_config');
        });
    }

    public function down(): void
    {
        Schema::table('hero_settings', function (Blueprint $table) {
            $table->dropColumn([
                'description',
                'title_highlight',
                'secondary_cta_text',
                'secondary_cta_href',
                'stat_value',
                'stat_label',
                'experience_badge_text',
                'portrait_focal',
                'show_description',
                'show_secondary_cta',
                'show_stat',
                'show_experience_badge',
                'layout_variant',
                'text_alignment',
                'background_style',
                'draft_config',
                'published_config',
                'published_at',
            ]);
        });
    }
};
