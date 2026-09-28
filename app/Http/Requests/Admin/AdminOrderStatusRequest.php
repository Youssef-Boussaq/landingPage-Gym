<?php

namespace App\Http\Requests\Admin;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Support\OrderStatusTransition;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class AdminOrderStatusRequest extends FormRequest
{
  
public function authorize(): bool
{
    $order = $this->route('order');

    return $order instanceof Order
        && ($this->user()?->can('updateStatus', $order) ?? false);
}


    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'status' => ['required', Rule::enum(OrderStatus::class)],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator) {
                $order = $this->route('order');

                if (!$order instanceof Order) {
                    return;
                }

                $status = $this->enum('status', OrderStatus::class);

                if (!$status) {
                    return;
                }

                if (!OrderStatusTransition::canTransition($order->status, $status)) {
                    $validator->errors()->add(
                        'status',
                        "Le statut {$order->status->value} ne peut pas passer à {$status->value}."
                    );
                }
            },
        ];
    }
}
