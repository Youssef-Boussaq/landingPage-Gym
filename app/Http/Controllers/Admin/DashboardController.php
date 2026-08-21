<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Support\AdminOrderPresenter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $threshold = (int) config('store.low_stock_threshold', 10);
        $paid = PaymentStatus::PAID->value;

        $stats = [
            'total_revenue' => (float) Order::query()
                ->where('payment_status', $paid)
                ->sum('total_amount'),
            'total_orders' => Order::query()->count(),
            'pending_orders' => Order::query()
                ->where('status', OrderStatus::PENDING)
                ->count(),
            'paid_orders' => Order::query()
                ->where('payment_status', $paid)
                ->count(),
            'total_customers' => User::query()
                ->where('role', '!=', 'admin')
                ->count(),
            'guest_orders' => Order::query()
                ->whereNull('user_id')
                ->whereNotNull('guest_token')
                ->count(),
            'products' => Product::query()->count(),
            'low_stock_products' => Product::query()
                ->where('manage_stock', true)
                ->whereNotNull('stock_quantity')
                ->where('stock_quantity', '<', $threshold)
                ->count(),
        ];

        $recentOrders = Order::query()
            ->with(['user:id,name,email'])
            ->latest()
            ->limit(8)
            ->get();

        $start = now()->subDays(6)->startOfDay();
        $rawOverview = Order::query()
            ->selectRaw('DATE(created_at) as date')
            ->selectRaw('COUNT(*) as orders')
            ->selectRaw('SUM(CASE WHEN payment_status = ? THEN total_amount ELSE 0 END) as revenue', [$paid])
            ->selectRaw('SUM(CASE WHEN payment_status = ? THEN 1 ELSE 0 END) as paid_orders', [$paid])
            ->selectRaw('SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as cancelled_orders', [OrderStatus::CANCELLED->value])
            ->where('created_at', '>=', $start)
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $revenueOverview = collect(range(0, 6))->map(function (int $offset) use ($start, $rawOverview) {
            $date = $start->copy()->addDays($offset)->toDateString();
            $row = $rawOverview->get($date);

            return [
                'date' => $date,
                'orders' => (int) ($row->orders ?? 0),
                'revenue' => (float) ($row->revenue ?? 0),
                'paid_orders' => (int) ($row->paid_orders ?? 0),
                'cancelled_orders' => (int) ($row->cancelled_orders ?? 0),
            ];
        });

        $orderStatusDistribution = Order::query()
            ->select('status', DB::raw('COUNT(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status');

        $paymentStatusDistribution = Order::query()
            ->select('payment_status', DB::raw('COUNT(*) as total'))
            ->groupBy('payment_status')
            ->pluck('total', 'payment_status');

        $lowStockProducts = Product::query()
            ->with(['primaryImage', 'categories'])
            ->where('manage_stock', true)
            ->whereNotNull('stock_quantity')
            ->where('stock_quantity', '<', $threshold)
            ->orderBy('stock_quantity')
            ->limit(8)
            ->get();

        $topProductsRaw = OrderItem::query()
            ->select(
                'product_id',
                DB::raw('SUM(quantity) as units_sold'),
                DB::raw('SUM(quantity * unit_price) as revenue')
            )
            ->whereHas('order', function ($query) use ($paid) {
                $query->where('payment_status', $paid);
            })
            ->groupBy('product_id')
            ->orderByDesc('units_sold')
            ->limit(6)
            ->get();

        $topProducts = Product::query()
            ->with(['primaryImage', 'categories'])
            ->whereIn('id', $topProductsRaw->pluck('product_id'))
            ->get()
            ->map(function (Product $product) use ($topProductsRaw) {
                $row = $topProductsRaw->firstWhere('product_id', $product->id);

                return [
                    'id' => $product->id,
                    'title' => $product->title,
                    'image' => $product->primaryImage?->url,
                    'units_sold' => (int) ($row->units_sold ?? 0),
                    'revenue' => (float) ($row->revenue ?? 0),
                ];
            })
            ->sortByDesc('units_sold')
            ->values();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentOrders' => AdminOrderPresenter::collection($recentOrders),
            'revenueOverview' => $revenueOverview,
            'orderStatusDistribution' => $orderStatusDistribution,
            'paymentStatusDistribution' => $paymentStatusDistribution,
            'lowStockProducts' => $lowStockProducts,
            'topProducts' => $topProducts,
            'unreadNotificationsCount' => $request->user()->unreadNotifications()->count(),
            'lowStockThreshold' => $threshold,
        ]);
    }
}
