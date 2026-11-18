<?php

namespace App\Services\Admin;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Carbon\CarbonImmutable;
use Carbon\CarbonPeriod;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class DashboardAnalytics
{
    /** @return array<string, mixed> */
    public function build(array $filters): array
    {
        $start = CarbonImmutable::parse($filters['start_date'], config('app.timezone'))->startOfDay();
        $end = CarbonImmutable::parse($filters['end_date'], config('app.timezone'))->endOfDay();
        $periodDays = $start->startOfDay()->diff($end->startOfDay())->days + 1;
        $previousEnd = $start->startOfDay()->subDay()->endOfDay();
        $previousStart = $previousEnd->startOfDay()->subDays($periodDays - 1);

        $orders = $this->filteredOrders($filters, $start, $end);
        $stats = $this->stats($orders, $filters, $start, $end);
        $previousStats = $this->stats($this->filteredOrders($filters, $previousStart, $previousEnd), $filters, $previousStart, $previousEnd);

        $distribution = (clone $orders)
            ->select('status', DB::raw('COUNT(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status')
            ->all();

        $paymentDistribution = (clone $orders)
            ->select('payment_status', DB::raw('COUNT(*) as total'))
            ->groupBy('payment_status')
            ->pluck('total', 'payment_status')
            ->all();

        $recentOrders = (clone $orders)
            ->latest('created_at')
            ->latest('id')
            ->limit(8)
            ->get();

        return [
            'stats' => $stats,
            'comparisons' => [
                'total_revenue' => $this->percentageChange($stats['total_revenue'], $previousStats['total_revenue']),
                'total_orders' => $this->percentageChange($stats['total_orders'], $previousStats['total_orders']),
                'paid_orders' => $this->percentageChange($stats['paid_orders'], $previousStats['paid_orders']),
                'previous_start_date' => $previousStart->toDateString(),
                'previous_end_date' => $previousEnd->toDateString(),
            ],
            'recentOrders' => $recentOrders,
            'revenueOverview' => $this->trend($orders, $filters, $start, $end, $periodDays),
            'orderStatusDistribution' => $distribution,
            'paymentStatusDistribution' => $paymentDistribution,
            'topProducts' => $this->topProducts($filters, $start, $end),
            'lowStockProducts' => $this->lowStockProducts($filters),
            'inventory' => $this->inventoryStats($filters),
            'trendGranularity' => $this->granularity($periodDays),
        ];
    }

    private function filteredOrders(array $filters, CarbonImmutable $start, CarbonImmutable $end): Builder
    {
        return $this->applyFilters(Order::query(), $filters, $start, $end);
    }

    private function applyFilters(Builder $query, array $filters, CarbonImmutable $start, CarbonImmutable $end): Builder
    {
        return $query->whereBetween('created_at', [$start, $end])
            ->when($filters['status'] !== '', fn (Builder $query) => $query->where('status', $filters['status']))
            ->when($filters['payment_status'] !== '', fn (Builder $query) => $query->where('payment_status', $filters['payment_status']))
            ->when($filters['category_id'] !== '', function (Builder $query) use ($filters): void {
                $query->whereHas('items.product.categories', fn (Builder $categories) => $categories->whereKey($filters['category_id']));
            });
    }

    /** @return array<string, int|float> */
    private function stats(Builder $orders, array $filters, CarbonImmutable $start, CarbonImmutable $end): array
    {
        $paid = PaymentStatus::PAID->value;
        $cancelled = OrderStatus::CANCELLED->value;
        $row = (clone $orders)
            ->selectRaw('COUNT(*) as total_orders')
            ->selectRaw('SUM(CASE WHEN payment_status = ? AND status != ? THEN total_amount ELSE 0 END) as total_revenue', [$paid, $cancelled])
            ->selectRaw('SUM(CASE WHEN payment_status = ? AND status != ? THEN 1 ELSE 0 END) as paid_orders', [$paid, $cancelled])
            ->selectRaw('SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as pending_orders', [OrderStatus::PENDING->value])
            ->selectRaw('SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as cancelled_orders', [$cancelled])
            ->selectRaw('COUNT(DISTINCT user_id) as total_customers')
            ->selectRaw('SUM(CASE WHEN user_id IS NULL AND guest_token IS NOT NULL THEN 1 ELSE 0 END) as guest_orders')
            ->first();

        $revenue = $filters['category_id'] !== ''
            ? (float) $this->paidItems($filters, $start, $end)->sum(DB::raw('quantity * unit_price'))
            : (float) ($row->total_revenue ?? 0);
        $paidOrders = (int) ($row->paid_orders ?? 0);

        return [
            'total_revenue' => $revenue,
            'total_orders' => (int) ($row->total_orders ?? 0),
            'average_order_value' => $paidOrders > 0 ? round($revenue / $paidOrders, 2) : 0.0,
            'paid_orders' => $paidOrders,
            'products_sold' => (int) $this->paidItems($filters, $start, $end)->sum('quantity'),
            'pending_orders' => (int) ($row->pending_orders ?? 0),
            'cancelled_orders' => (int) ($row->cancelled_orders ?? 0),
            'total_customers' => (int) ($row->total_customers ?? 0),
            'guest_orders' => (int) ($row->guest_orders ?? 0),
        ];
    }

    private function percentageChange(int|float $current, int|float $previous): ?float
    {
        if ($previous == 0) {
            return null;
        }

        return round((($current - $previous) / abs($previous)) * 100, 1);
    }

    /** @return array<int, array{date: string, orders: int, revenue: float, paid_orders: int, cancelled_orders: int}> */
    private function trend(Builder $orders, array $filters, CarbonImmutable $start, CarbonImmutable $end, int $periodDays): array
    {
        $granularity = $this->granularity($periodDays);
        $dailyRows = (clone $orders)
            ->selectRaw('DATE(created_at) as date')
            ->selectRaw('COUNT(*) as orders')
            ->selectRaw('SUM(CASE WHEN payment_status = ? AND status != ? THEN total_amount ELSE 0 END) as revenue', [PaymentStatus::PAID->value, OrderStatus::CANCELLED->value])
            ->selectRaw('SUM(CASE WHEN payment_status = ? AND status != ? THEN 1 ELSE 0 END) as paid_orders', [PaymentStatus::PAID->value, OrderStatus::CANCELLED->value])
            ->selectRaw('SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as cancelled_orders', [OrderStatus::CANCELLED->value])
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get();

        $revenueByDay = $filters['category_id'] !== ''
            ? $this->paidItems($filters, $start, $end)
                ->join('orders', 'orders.id', '=', 'order_items.order_id')
                ->selectRaw('DATE(orders.created_at) as date')
                ->selectRaw('SUM(order_items.quantity * order_items.unit_price) as revenue')
                ->groupBy(DB::raw('DATE(orders.created_at)'))
                ->get()
                ->keyBy('date')
            : collect();

        $buckets = [];
        foreach (CarbonPeriod::create($start->startOfDay(), '1 day', $end->startOfDay()) as $day) {
            $bucket = $this->bucketStart(CarbonImmutable::instance($day), $granularity)->toDateString();
            $buckets[$bucket] ??= ['date' => $bucket, 'orders' => 0, 'revenue' => 0.0, 'paid_orders' => 0, 'cancelled_orders' => 0];
        }

        foreach ($dailyRows as $row) {
            $bucket = $this->bucketStart(CarbonImmutable::parse($row->date, config('app.timezone')), $granularity)->toDateString();
            $buckets[$bucket] ??= ['date' => $bucket, 'orders' => 0, 'revenue' => 0.0, 'paid_orders' => 0, 'cancelled_orders' => 0];
            $buckets[$bucket]['orders'] += (int) $row->orders;
            $revenue = $filters['category_id'] !== ''
                ? (float) ($revenueByDay->get($row->date)->revenue ?? 0)
                : (float) $row->revenue;
            $buckets[$bucket]['revenue'] += $revenue;
            $buckets[$bucket]['paid_orders'] += (int) $row->paid_orders;
            $buckets[$bucket]['cancelled_orders'] += (int) $row->cancelled_orders;
        }

        ksort($buckets);

        return array_values($buckets);
    }

    private function granularity(int $periodDays): string
    {
        return $periodDays <= 31 ? 'day' : ($periodDays <= 180 ? 'week' : 'month');
    }

    private function bucketStart(CarbonImmutable $date, string $granularity): CarbonImmutable
    {
        return match ($granularity) {
            'week' => $date->startOfWeek(),
            'month' => $date->startOfMonth(),
            default => $date->startOfDay(),
        };
    }

    private function topProducts(array $filters, CarbonImmutable $start, CarbonImmutable $end): array
    {
        $sales = $this->paidItems($filters, $start, $end)
            ->select('product_id')
            ->selectRaw('SUM(quantity) as units_sold')
            ->selectRaw('SUM(quantity * unit_price) as revenue')
            ->whereNotNull('product_id')
            ->groupBy('product_id')
            ->orderByDesc('units_sold')
            ->limit(6)
            ->get();

        $products = Product::query()
            ->with(['primaryImage', 'categories:id,name'])
            ->whereIn('id', $sales->pluck('product_id'))
            ->get(['id', 'title'])
            ->keyBy('id');

        return $sales->map(function ($sale) use ($products): array {
            $product = $products->get($sale->product_id);
            if (!$product) {
                return [];
            }

            return [
                'id' => $product->id,
                'title' => $product->title,
                'image' => $product->primaryImage?->url,
                'categories' => $product->categories->pluck('name')->values(),
                'units_sold' => (int) $sale->units_sold,
                'revenue' => (float) $sale->revenue,
            ];
        })->filter()->values()->all();
    }

    private function paidItems(array $filters, CarbonImmutable $start, CarbonImmutable $end): Builder
    {
        return OrderItem::query()
            ->when($filters['category_id'] !== '', function (Builder $items) use ($filters): void {
                $items->whereHas('product.categories', fn (Builder $categories) => $categories->whereKey($filters['category_id']));
            })
            ->whereHas('order', function (Builder $orders) use ($filters, $start, $end): void {
                $this->applyFilters($orders, $filters, $start, $end)
                    ->where('payment_status', PaymentStatus::PAID->value)
                    ->where('status', '!=', OrderStatus::CANCELLED->value);
            });
    }

    private function lowStockProducts(array $filters): array
    {
        $threshold = (int) config('store.low_stock_threshold', 10);

        return Product::query()
            ->when($filters['category_id'] !== '', function (Builder $products) use ($filters): void {
                $products->whereHas('categories', fn (Builder $categories) => $categories->whereKey($filters['category_id']));
            })
            ->where('manage_stock', true)
            ->whereNotNull('stock_quantity')
            ->where('stock_quantity', '<', $threshold)
            ->orderBy('stock_quantity')
            ->limit(8)
            ->get(['id', 'title', 'stock_quantity'])
            ->toArray();
    }

    private function inventoryStats(array $filters): array
    {
        $products = Product::query()->when($filters['category_id'] !== '', function (Builder $query) use ($filters): void {
            $query->whereHas('categories', fn (Builder $categories) => $categories->whereKey($filters['category_id']));
        });

        return [
            'products' => (clone $products)->count(),
            'low_stock_products' => (clone $products)
                ->where('manage_stock', true)
                ->whereNotNull('stock_quantity')
                ->where('stock_quantity', '<', (int) config('store.low_stock_threshold', 10))
                ->count(),
        ];
    }
}
