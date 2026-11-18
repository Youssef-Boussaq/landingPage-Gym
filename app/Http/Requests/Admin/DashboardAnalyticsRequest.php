<?php

namespace App\Http\Requests\Admin;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class DashboardAnalyticsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'period' => ['nullable', Rule::in([
                'today', 'yesterday', 'last_7_days', 'last_30_days', 'last_90_days',
                'this_month', 'last_month', 'custom',
            ])],
            'start_date' => ['nullable', 'date_format:Y-m-d'],
            'end_date' => ['nullable', 'date_format:Y-m-d'],
            'status' => ['nullable', Rule::in(array_map(fn (OrderStatus $status) => $status->value, OrderStatus::cases()))],
            'payment_status' => ['nullable', Rule::in(array_map(fn (PaymentStatus $status) => $status->value, PaymentStatus::cases()))],
            'category_id' => ['nullable', 'integer', Rule::exists('categories', 'id')],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $period = $this->input('period', 'last_7_days');
            if ($period !== 'custom') {
                return;
            }

            $startDate = $this->input('start_date');
            $endDate = $this->input('end_date');

            if (!$startDate || !$endDate || $validator->errors()->has('start_date') || $validator->errors()->has('end_date')) {
                $validator->errors()->add('start_date', 'Select both dates for a custom range.');
                return;
            }

            $start = CarbonImmutable::createFromFormat('!Y-m-d', $startDate, config('app.timezone'));
            $end = CarbonImmutable::createFromFormat('!Y-m-d', $endDate, config('app.timezone'));

            if ($end->lessThan($start)) {
                $validator->errors()->add('end_date', 'The end date must be on or after the start date.');
                return;
            }

            if ($start->diff($end)->days >= 366) {
                $validator->errors()->add('end_date', 'Choose a range of 366 days or fewer.');
            }
        });
    }

    /** @return array{period: string, start_date: string, end_date: string, status: string, payment_status: string, category_id: int|string} */
    public function filters(): array
    {
        $validated = $this->validated();
        $period = $validated['period'] ?? 'last_7_days';
        $today = CarbonImmutable::now(config('app.timezone'))->startOfDay();

        [$start, $end] = match ($period) {
            'today' => [$today, $today],
            'yesterday' => [$today->subDay(), $today->subDay()],
            'last_30_days' => [$today->subDays(29), $today],
            'last_90_days' => [$today->subDays(89), $today],
            'this_month' => [$today->startOfMonth(), $today],
            'last_month' => [$today->subMonthNoOverflow()->startOfMonth(), $today->subMonthNoOverflow()->endOfMonth()],
            'custom' => [
                CarbonImmutable::createFromFormat('!Y-m-d', $validated['start_date'], config('app.timezone')),
                CarbonImmutable::createFromFormat('!Y-m-d', $validated['end_date'], config('app.timezone')),
            ],
            default => [$today->subDays(6), $today],
        };

        return [
            'period' => $period,
            'start_date' => $start->toDateString(),
            'end_date' => $end->toDateString(),
            'status' => $validated['status'] ?? '',
            'payment_status' => $validated['payment_status'] ?? '',
            'category_id' => $validated['category_id'] ?? '',
        ];
    }
}
