<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\DashboardAnalyticsRequest;
use App\Models\Category;
use App\Models\Order;
use App\Services\Admin\DashboardAnalytics;
use App\Support\AdminOrderPresenter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

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

    public function export(Request $request): StreamedResponse
    {
        $range = $request->query('range', '30_days');

        $query = Order::query()->with(['items.product', 'user'])->latest('created_at');

        $now = now();
        $filenameSuffix = $range;

        switch ($range) {
            case '15_days':
                $query->where('created_at', '>=', $now->copy()->subDays(15)->startOfDay());
                break;
            case '30_days':
                $query->where('created_at', '>=', $now->copy()->subDays(30)->startOfDay());
                break;
            case 'last_month':
                $startOfLastMonth = $now->copy()->subMonth()->startOfMonth();
                $endOfLastMonth = $now->copy()->subMonth()->endOfMonth();
                $query->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth]);
                $filenameSuffix = $startOfLastMonth->format('Y-m');
                break;
            case 'last_2_months':
                $query->where('created_at', '>=', $now->copy()->subMonths(2)->startOfMonth());
                break;
            case 'all':
            default:
                // All data, no date filter
                $filenameSuffix = 'all';
                break;
        }

        $orders = $query->get();

        $filename = "rapport-commandes-{$filenameSuffix}-" . date('Y-m-d') . ".csv";

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        return response()->stream(function () use ($orders) {
            $handle = fopen('php://output', 'w');
            // Add UTF-8 BOM for Microsoft Excel compatibility
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));

            // CSV Header
            fputcsv($handle, [
                'N° Commande',
                'Date',
                'Client',
                'Email',
                'Téléphone',
                'Ville',
                'Adresse',
                'Mode de paiement',
                'Statut Paiement',
                'Statut Commande',
                'Frais Livraison (MAD)',
                'Total (MAD)',
                'Articles commandés',
            ], ';');

            foreach ($orders as $order) {
                $itemsSummary = $order->items->map(function ($item) {
                    $title = $item->product ? $item->product->title : 'Article #' . $item->product_id;
                    return $title . ' (x' . $item->quantity . ' - ' . number_format((float) $item->unit_price, 2, ',', ' ') . ' MAD)';
                })->implode(' | ');

                fputcsv($handle, [
                    $order->order_number,
                    $order->created_at ? $order->created_at->format('d/m/Y H:i') : '',
                    $order->customer_name,
                    $order->customer_email,
                    $order->customer_phone,
                    $order->city,
                    $order->shipping_address,
                    $order->payment_method,
                    $order->payment_status instanceof PaymentStatus ? $order->payment_status->value : (string) $order->payment_status,
                    $order->status instanceof OrderStatus ? $order->status->value : (string) $order->status,
                    number_format((float) ($order->shipping_fee ?? 0), 2, ',', ' '),
                    number_format((float) $order->total_amount, 2, ',', ' '),
                    $itemsSummary,
                ], ';');
            }

            fclose($handle);
        }, 200, $headers);
    }
}
