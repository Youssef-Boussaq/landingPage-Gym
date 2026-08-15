import React from 'react';

export default function Show({ order }) {
    return (
        <div className="mx-auto max-w-5xl px-4 py-10">

            {/* Header */}

            <div className="mb-8 text-center">

                <h1 className="text-3xl font-bold text-slate-900">
                    Order Confirmed
                </h1>

                <p className="mt-2 text-slate-500">
                    Thank you for your order.
                </p>

                <p className="mt-4 font-semibold">
                    Order #{order.order_number}
                </p>

            </div>

            {/* Order information */}

            <div className="grid gap-6 lg:grid-cols-3">

                {/* Items */}

                <div className="lg:col-span-2">

                    <div className="rounded-2xl border border-slate-200 bg-white p-6">

                        <h2 className="mb-6 text-xl font-semibold">
                            Order Items
                        </h2>

                        <div className="space-y-5">

                            {order.items.map((item) => {

                                const total =
                                    Number(item.unit_price) *
                                    Number(item.quantity);

                                return (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between border-b border-slate-100 pb-5"
                                    >

                                        <div>

                                            <p className="font-medium">
                                                {item.product?.name ??
                                                    'Product unavailable'}
                                            </p>

                                            <p className="text-sm text-slate-500">
                                                {item.quantity} ×{' '}
                                                {Number(
                                                    item.unit_price
                                                ).toFixed(2)}{' '}
                                                DH
                                            </p>

                                        </div>

                                        <p className="font-semibold">
                                            {total.toFixed(2)} DH
                                        </p>

                                    </div>
                                );
                            })}

                        </div>

                    </div>

                </div>

                {/* Summary */}

                <div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6">

                        <h2 className="mb-6 text-xl font-semibold">
                            Summary
                        </h2>

                        <div className="space-y-4">

                            <div className="flex justify-between">
                                <span className="text-slate-500">
                                    Status
                                </span>

                                <span className="font-medium">
                                    {order.status}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-slate-500">
                                    Payment
                                </span>

                                <span className="font-medium">
                                    {order.payment_method}
                                </span>
                            </div>

                            <div className="border-t pt-4">

                                <div className="flex justify-between text-lg font-bold">

                                    <span>
                                        Total
                                    </span>

                                    <span>
                                        {Number(
                                            order.total_amount
                                        ).toFixed(2)}{' '}
                                        DH
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}