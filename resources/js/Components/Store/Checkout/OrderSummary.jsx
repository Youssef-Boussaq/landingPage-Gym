import React from 'react';

export default function ShippingInformation({
    data,
    setData,
    errors,
}) {
    return (
        <section className="mt-6 rounded-2xl border p-6">

            <h2 className="mb-6 text-xl font-semibold">
                Shipping Information
            </h2>

            <div className="space-y-5">

                <input
                    type="text"
                    value={data.customer_phone}
                    onChange={(e) =>
                        setData(
                            'customer_phone',
                            e.target.value
                        )
                    }
                    placeholder="Phone"
                    className="w-full rounded-lg border p-3"
                />

                <textarea
                    value={data.shipping_address}
                    onChange={(e) =>
                        setData(
                            'shipping_address',
                            e.target.value
                        )
                    }
                    placeholder="Address"
                    className="w-full rounded-lg border p-3"
                />

                <div className="grid gap-4 sm:grid-cols-2">

                    <input
                        type="text"
                        value={data.city}
                        onChange={(e) =>
                            setData('city', e.target.value)
                        }
                        placeholder="City"
                        className="rounded-lg border p-3"
                    />

                    <input
                        type="text"
                        value={data.postal_code}
                        onChange={(e) =>
                            setData(
                                'postal_code',
                                e.target.value
                            )
                        }
                        placeholder="Postal Code"
                        className="rounded-lg border p-3"
                    />

                </div>

            </div>

        </section>
    );
}