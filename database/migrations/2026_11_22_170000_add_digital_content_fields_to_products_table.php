<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('digital_file_path')->nullable()->after('type');
            $table->string('digital_file_name')->nullable()->after('digital_file_path');
            $table->unsignedBigInteger('digital_file_size')->nullable()->after('digital_file_name');
            $table->text('digital_download_link')->nullable()->after('digital_file_size');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'digital_file_path',
                'digital_file_name',
                'digital_file_size',
                'digital_download_link',
            ]);
        });
    }
};
