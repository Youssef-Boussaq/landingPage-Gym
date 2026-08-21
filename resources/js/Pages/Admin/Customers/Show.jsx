import AdminBreadcrumbs from '@/Components/Admin/AdminBreadcrumbs';
import AdminEmptyState from '@/Components/Admin/AdminEmptyState';
import AdminStatusBadge from '@/Components/Admin/AdminStatusBadge';
import AdminLayout from '@/Layouts/AdminLayout';
import { formatDate, formatMoney } from '@/helpers/format';
import { Link } from '@inertiajs/react';

export default function CustomerShow({ customer, orders = [] }) {
    return (
        <AdminLayout title={customer.name}>
            <AdminBreadcrumbs
                items={[
                    { label: 'Admin', href: route('admin.dashboard') },
                    { label: 'Customers', href: route('admin.customers.index') },
                    { label: customer.name },
                ]}
            />
            <h1 className="font-archivo text-2xl uppercase text-slate-900">{customer.name}</h1>

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-1">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Profile</h2>
                    <dl className="mt-3 space-y-2 text-sm">
                        <div className="flex justify-between gap-3"><dt className="text-slate-500">Email</dt><dd>{customer.email}</dd></div>
                        <div className="flex justify-between gap-3"><dt className="text-slate-500">Role</dt><dd>{customer.role}</dd></div>
                        <div className="flex justify-between gap-3"><dt className="text-slate-500">Orders</dt><dd>{customer.orders_count}</dd></div>
                        <div className="flex justify-between gap-3"><dt className="text-slate-500">Total spent</dt><dd>{formatMoney(customer.total_spent)}</dd></div>
                        <div className="flex justify-between gap-3"><dt className="text-slate-500">Last order</dt><dd>{formatDate(customer.last_order_at)}</dd></div>
                        <div className="flex justify-between gap-3"><dt className="text-slate-500">Created</dt><dd>{formatDate(customer.created_at)}</dd></div>
                    </dl>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Order history</h2>
                    {orders.length === 0 ? (
                        <div className="mt-4">
                            <AdminEmptyState title="Aucune commande" />
                        </div>
                    ) : (
                        <table className="mt-4 min-w-full text-left text-sm">
                            <thead className="text-xs uppercase text-slate-400">
                                <tr>
                                    <th className="pb-2">Order</th>
                                    <th className="pb-2">Total</th>
                                    <th className="pb-2">Payment</th>
                                    <th className="pb-2">Status</th>
                                    <th className="pb-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id} className="border-t border-slate-100">
                                        <td className="py-3 font-semibold">{order.order_number}</td>
                                        <td>{formatMoney(order.total_amount)}</td>
                                        <td><AdminStatusBadge status={order.payment_status} /></td>
                                        <td><AdminStatusBadge status={order.status} /></td>
                                        <td>
                                            <Link href={route('admin.orders.show', order.id)} className="text-xs font-bold underline">
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>
            </div>
        </AdminLayout>
    );
}
