<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user from .env
        $adminEmail = config('store.admin_notification_email') ?? env('ADMIN_EMAIL', 'aminebaskad2005@gmail.com');

        User::updateOrCreate(
            ['email' => $adminEmail],
            [
                'name' => 'Admin Fit',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // Fallback default admin
        User::updateOrCreate(
            ['email' => 'admin@fit.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // Test customer
        User::updateOrCreate(
            ['email' => 'client@fit.com'],
            [
                'name' => 'Client Test',
                'password' => Hash::make('password'),
                'role' => 'client',
                'email_verified_at' => now(),
            ]
        );
    }
}
