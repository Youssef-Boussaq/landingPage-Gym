import React from 'react';

export default function CustomerInformation({
    isAuthenticated,
    user,
    data,
    setData,
    errors,
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6">

            <h2 className="mb-6 text-xl font-semibold text-slate-900">
                Customer Information
            </h2>

            {isAuthenticated ? (

                <div className="rounded-xl bg-slate-50 p-4">

                    <p className="font-semibold text-slate-900">
                        {user?.name}
                    </p>

                    <p className="text-sm text-slate-600">
                        {user?.email}
                    </p>

                </div>

            ) : (

                <div className="space-y-5">

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Full Name
                        </label>

                        <input
                            type="text"
                            value={data?.customer_name ?? ''}
                            onChange={(e) =>
                                setData(
                                    'customer_name',
                                    e.target.value
                                )
                            }
                            className="w-full rounded-lg border border-slate-300 p-3"
                            placeholder="Your full name"
                        />

                        {errors?.customer_name && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.customer_name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            value={data?.customer_email ?? ''}
                            onChange={(e) =>
                                setData(
                                    'customer_email',
                                    e.target.value
                                )
                            }
                            className="w-full rounded-lg border border-slate-300 p-3"
                            placeholder="example@email.com"
                        />

                        {errors?.customer_email && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.customer_email}
                            </p>
                        )}
                    </div>

                </div>

            )}

        </section>
    );
}