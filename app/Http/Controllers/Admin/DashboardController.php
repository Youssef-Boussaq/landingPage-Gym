<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\DashboardAnalyticsRequest;
use App\Models\Category;
use App\Services\Admin\DashboardAnalytics;
use App\Support\AdminOrderPresenter;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(DashboardAnalyticsRequest $request, DashboardAnalytics $analytics): Response
    {
        $filters = $request->filters();
        $data = $analytics->build($filters);
        $data['recentOrders'] = AdminOrderPresenter::collection($data['recentOrders']);

        return Inertia::render('Admin/Dashboard', [
            ...$data,
            'stats' => [...$data['stats'], ...$data['inventory']],
            'filters' => $filters,
            'filterOptions' => [
                'statuses' => array_map(fn (OrderStatus $status) => $status->value, OrderStatus::cases()),
                'paymentStatuses' => array_map(fn (PaymentStatus $status) => $status->value, PaymentStatus::cases()),
                'categories' => Category::query()->orderBy('name')->get(['id', 'name']),
            ],
            'unreadNotificationsCount' => $request->user()->unreadNotifications()->count(),
            'lowStockThreshold' => (int) config('store.low_stock_threshold', 10),
        ]);
    }
}
