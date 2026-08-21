import AdminBreadcrumbs from '@/Components/Admin/AdminBreadcrumbs';
import AdminOrderTimeline from '@/Components/Admin/AdminOrderTimeline';
import AdminStatusBadge from '@/Components/Admin/AdminStatusBadge';
import InputError from '@/Components/InputError';
import AdminLayout from '@/Layouts/AdminLayout';
import { formatDate, formatMoney } from '@/helpers/format';
import { useForm } from '@inertiajs/react';

export default function OrderShow({ order }) {
    const form = useForm({
        status: order.allowed_statuses[0] || '',
    });

    const submitStatus = (event) => {
        event.preventDefault();
        form.patch(route('admin.orders.status', order.id), { preserveScroll: true });
    };

    return (
        <AdminLayout title={`Commande ${order.order_number}`}>
            <AdminBreadcrumbs
                items={[
                    { label: 'Admin', href: route('admin.dashboard') },
                    { label: 'Orders', href: route('admin.orders.index') },
                    { label: order.order_number },
                ]}
            />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="font-archivo text-2xl uppercase text-slate-900">{order.order_number}</h1>
                    <p className="mt-1 text-sm text-slate-500">{formatDate(order.created_at)}</p>
                </div>
                <div className="flex gap-2">
                    <AdminStatusBadge status={order.status} />
                    <AdminStatusBadge status={order.payment_status} />
                </div>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-3">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Customer</h2>
                    <dl className="mt-3 space-y-2 text-sm">
                        <div className="flex justify-between gap-4"><dt className="text-slate-500">Name</dt><dd className="font-semibold">{order.customer.name}</dd></div>
                        <div className="flex justify-between gap-4"><dt className="text-slate-500">Email</dt><dd>{order.customer.email}</dd></div>
                        <div className="flex justify-between gap-4"><dt className="text-slate-500">Phone</dt><dd>{order.customer.phone || '—'}</dd></div>
                        <div className="flex justify-between gap-4"><dt className="text-slate-500">Type</dt><dd>{order.customer.type_label}</dd></div>
                        {order.customer.user_id && (
                            <div className="flex justify-between gap-4"><dt className="text-slate-500">User ID</dt><dd>{order.customer.user_id}</dd></div>
                        )}
                    </dl>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Shipping</h2>
                    <p className="mt-3 text-sm">{order.shipping.address || '—'}</p>
                    <p className="text-sm text-slate-500">{order.shipping.city} {order.shipping.postal_code}</p>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Payment</h2>
                    <dl className="mt-3 space-y-2 text-sm">
                        <div className="flex justify-between gap-4"><dt className="text-slate-500">Method</dt><dd className="capitalize">{order.payment_method}</dd></div>
                        <div className="flex justify-between gap-4"><dt className="text-slate-500">Status</dt><dd><AdminStatusBadge status={order.payment_status} /></dd></div>
                        <div className="flex justify-between gap-4"><dt className="text-slate-500">Transaction</dt><dd className="max-w-[160px] truncate">{order.transaction_id || '—'}</dd></div>
                        <div className="flex justify-between gap-4"><dt className="text-slate-500">Total</dt><dd className="font-bold">{formatMoney(order.total_amount)}</dd></div>
                    </dl>
                </section>
            </div>

            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Items</h2>
                <div className="mt-4 divide-y divide-slate-100">
                    {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 py-3">
                            <img
                                src={item.product.image || '/images/placeholder.png'}
                                alt={item.product.title}
                                className="h-14 w-14 rounded-xl object-cover"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-semibold">{item.product.title}</p>
                                <p className="text-xs text-slate-500">
                                    {item.quantity} × {formatMoney(item.unit_price)}
                                </p>
                            </div>
                            <p className="font-bold">{formatMoney(item.subtotal)}</p>
                        </div>
                    ))}
                </div>
            </section>

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Attribution</h2>
                    {order.attribution ? (
                        <dl className="mt-3 space-y-2 text-sm">
                            {Object.entries(order.attribution).map(([key, value]) => (
                                <div key={key} className="flex justify-between gap-4">
                                    <dt className="text-slate-500">{key}</dt>
                                    <dd className="max-w-xs truncate">{value || '—'}</dd>
                                </div>
                            ))}
                        </dl>
                    ) : (
                        <p className="mt-3 text-sm text-slate-500">Aucune donnée d’attribution.</p>
                    )}
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Timeline</h2>
                    <div className="mt-4">
                        <AdminOrderTimeline events={order.timeline} />
                    </div>
                </section>
            </div>

            {order.allowed_statuses.length > 0 && (
                <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Changer le statut commande</h2>
                    <p className="mt-1 text-xs text-slate-500">Le statut de paiement n’est pas modifié ici.</p>
                    <form onSubmit={submitStatus} className="mt-4 flex flex-wrap items-end gap-3">
                        <select
                            value={form.data.status}
                            onChange={(event) => form.setData('status', event.target.value)}
                            className="rounded-xl border-slate-200 text-sm"
                        >
                            {order.allowed_statuses.map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-[#9de500]"
                        >
                            Mettre à jour
                        </button>
                        <InputError message={form.errors.status} />
                    </form>
                </section>
            )}
        </AdminLayout>
    );
}
