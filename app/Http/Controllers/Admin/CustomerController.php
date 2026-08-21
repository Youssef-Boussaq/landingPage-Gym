<?php

namespace App\Http\Controllers\Admin;

use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\AdminOrderPresenter;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', User::class);

        $query = User::query()
            ->withCount('orders')
            ->withSum([
                'orders as total_spent' => fn ($builder) => $builder
                    ->where('payment_status', PaymentStatus::PAID),
            ], 'total_amount')
            ->latest();

        if ($search = trim((string) $request->query('search', ''))) {
            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($role = $request->query('role')) {
            $query->where('role', $role);
        }

        $customers = $query
            ->paginate(15)
            ->withQueryString()
            ->through(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'orders_count' => $user->orders_count,
                'total_spent' => (float) ($user->total_spent ?? 0),
                'created_at' => $user->created_at?->toIso8601String(),
            ]);

        return Inertia::render('Admin/Customers/Index', [
            'customers' => $customers,
            'filters' => [
                'search' => $request->query('search', ''),
                'role' => $request->query('role', ''),
            ],
        ]);
    }

    public function show(User $user): Response
    {
        $this->authorize('view', $user);

        $orders = $user->orders()
            ->latest()
            ->limit(50)
            ->get();

        $paidOrders = $user->orders()
            ->where('payment_status', PaymentStatus::PAID);

        return Inertia::render('Admin/Customers/Show', [
            'customer' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'email_verified_at' => $user->email_verified_at?->toIso8601String(),
                'created_at' => $user->created_at?->toIso8601String(),
                'orders_count' => $user->orders()->count(),
                'total_spent' => (float) $paidOrders->sum('total_amount'),
                'last_order_at' => $user->orders()->latest()->value('created_at'),
            ],
            'orders' => AdminOrderPresenter::collection($orders),
        ]);
    }
}
