<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminOrderStatusRequest;
use App\Models\Order;
use App\Support\AdminOrderPresenter;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Support\OrderStatusTransition;
use App\Services\Ameex\AmeexCityService;


class OrderController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Order::class);

        $query = Order::query()
            ->with(['user:id,name,email'])
            ->latest();

        if ($search = trim((string) $request->query('search', ''))) {
            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('order_number', 'like', "%{$search}%")
                    ->orWhere('customer_name', 'like', "%{$search}%")
                    ->orWhere('customer_email', 'like', "%{$search}%");
            });
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($paymentStatus = $request->query('payment_status')) {
            $query->where('payment_status', $paymentStatus);
        }

        $customerType = $request->query('customer_type');

        if ($customerType === 'client') {
            $query->whereNotNull('user_id');
        } elseif ($customerType === 'guest') {
            $query->whereNull('user_id')->whereNotNull('guest_token');
        }

        $sort = $request->query('sort', 'created_at');
        $direction = $request->query('direction', 'desc') === 'asc' ? 'asc' : 'desc';

        if (in_array($sort, ['created_at', 'total_amount', 'order_number'], true)) {
            $query->reorder()->orderBy($sort, $direction);
        }

        $orders = $query
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Order $order) => AdminOrderPresenter::listItem($order));

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => [
                'search' => $request->query('search', ''),
                'status' => $request->query('status', ''),
                'payment_status' => $request->query('payment_status', ''),
                'customer_type' => $request->query('customer_type', ''),
                'sort' => $sort,
                'direction' => $direction,
            ],
            'statusOptions' => collect(OrderStatus::cases())->map(fn ($status) => $status->value),
            'paymentStatusOptions' => collect(PaymentStatus::cases())->map(fn ($status) => $status->value),
        ]);
    }

   public function show(
    Order $order,
    AmeexCityService $ameexCityService
): Response {
    $this->authorize('view', $order);

    $order->load([
        'items.product.primaryImage',
        'user:id,name,email,role',
        'attribution',
        'ameexShipment.city',
    ]);

    return Inertia::render('Admin/Orders/Show', [
        'order' => AdminOrderPresenter::detail($order),

        'ameexCities' => $ameexCityService
            ->activeCities()
            ->map(fn ($city) => [
                'id' => $city->id,
                'ameex_id' => $city->ameex_id,
                'name' => $city->name,
                'name_ar' => $city->name_ar,
                'name_fr' => $city->name_fr,
            ])
            ->values(),
    ]);
}

 public function shipToAmeex(Order $order): RedirectResponse
{
    $this->authorize('updateStatus', $order);

    try {
        OrderStatusTransition::shipToAmeex($order);

        return back()->with(
            'success',
            'La commande a été envoyée à AMEEX et marquée comme expédiée.'
        );
    } catch (\Throwable $e) {
        return back()
            ->withErrors([
                'ameex' => $e->getMessage(),
            ])
            ->withInput();
    }
}



public function updateStatus(
    AdminOrderStatusRequest $request,
    Order $order
): RedirectResponse {
    OrderStatusTransition::change(
        $order,
        $request->enum('status', OrderStatus::class)
    );

    return back()->with(
        'success',
        'Statut de la commande mis à jour.'
    );
}
}






