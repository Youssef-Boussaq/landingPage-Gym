<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Settings', [
            'settings' => [
                'low_stock_threshold' => (int) config('store.low_stock_threshold', 10),
                'admin_notification_email' => config('store.admin_notification_email'),
                'app_name' => config('app.name'),
            ],
        ]);
    }
}
