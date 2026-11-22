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
        Schema::create('product_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('order_id')->nullable()->constrained('orders')->nullOnDelete();

            // Reviewer identity
            $table->string('reviewer_name', 100);
            $table->string('reviewer_email', 150)->nullable();

            // Content — rating is optional (nullable), comment is required
            $table->unsignedTinyInteger('rating')->nullable();
            $table->string('title', 150)->nullable();
            $table->text('comment');

            // Verification & Moderation status
            $table->boolean('is_verified_purchase')->default(false);
            $table->string('status', 20)->default('pending'); // 'pending', 'approved', 'rejected'

            // Admin response
            $table->text('admin_reply')->nullable();
            $table->timestamp('admin_replied_at')->nullable();

            $table->timestamps();

            // Performance indexes
            $table->index(['product_id', 'status']);
            $table->index('status');
            $table->index('rating');
            $table->index('is_verified_purchase');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_reviews');
    }
};

