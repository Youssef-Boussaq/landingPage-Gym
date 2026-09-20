<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->timestamp('shipped_at')->nullable()->after('updated_at');
            $table->timestamp('delivered_at')->nullable()->after('shipped_at');
            $table->timestamp('returned_at')->nullable()->after('delivered_at');
            $table->timestamp('cancelled_at')->nullable()->after('returned_at');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'shipped_at',
                'delivered_at',
                'returned_at',
                'cancelled_at',
            ]);
        });
    }
};
