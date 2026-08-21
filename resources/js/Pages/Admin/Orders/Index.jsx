import AdminBreadcrumbs from '@/Components/Admin/AdminBreadcrumbs';
import AdminEmptyState from '@/Components/Admin/AdminEmptyState';
import AdminPagination from '@/Components/Admin/AdminPagination';
import AdminSearchBar, { visitWithQuery } from '@/Components/Admin/AdminSearchBar';
import AdminStatusBadge from '@/Components/Admin/AdminStatusBadge';
import AdminLayout from '@/Layouts/AdminLayout';
import { formatDate, formatMoney } from '@/helpers/format';
import { Link } from '@inertiajs/react';

export default function OrdersIndex({ orders, filters, statusOptions, paymentStatusOptions }) {
    const applyFilters = (overrides = {}) => {
        visitWithQuery(route('admin.orders.index'), {
            ...filters,
            ...overrides,
        });
    };

    return (
        <AdminLayout title="Commandes">
            <AdminBreadcrumbs items={[{ label: 'Admin', href: route('admin.dashboard') }, { label: 'Orders' }]} />
            <h1 className="font-archivo text-2xl uppercase text-slate-900">Orders</h1>

            <div className="mt-5 flex flex-col gap-3 lg:flex-row">
                <AdminSearchBar
                    value={filters.search}
                    placeholder="N° commande, nom, email…"
                    onSearch={(search) => applyFilters({ search })}
                />
                <select
                    value={filters.status}
                    onChange={(event) => applyFilters({ status: event.target.value })}
                    className="rounded-xl border-slate-200 text-sm"
                >
                    <option value="">Tous les statuts</option>
                    {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
                <select
                    value={filters.payment_status}
                    onChange={(event) => applyFilters({ payment_status: event.target.value })}
                    className="rounded-xl border-slate-200 text-sm"
                >
                    <option value="">Tous les paiements</option>
                    {paymentStatusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
                <select
                    value={filters.customer_type}
                    onChange={(event) => applyFilters({ customer_type: event.target.value })}
                    className="rounded-xl border-slate-200 text-sm"
                >
                    <option value="">Client / Guest</option>
                    <option value="client">Client</option>
                    <option value="guest">Guest</option>
                </select>
            </div>

            <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                {orders.data.length === 0 ? (
                    <div className="p-6">
                        <AdminEmptyState title="No orders found." description="Essayez un autre filtre ou une autre recherche." />
                    </div>
                ) : (
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-400">
                            <tr>
                                <th className="px-4 py-3">Order number</th>
                                <th className="px-4 py-3">Customer</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3">Total</th>
                                <th className="px-4 py-3">Payment method</th>
                                <th className="px-4 py-3">Payment</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Created at</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.data.map((order) => (
                                <tr key={order.id} className="border-t border-slate-100">
                                    <td className="px-4 py-3 font-semibold">{order.order_number}</td>
                                    <td className="px-4 py-3">
                                        <div>{order.customer_name}</div>
                                        <div className="text-xs text-slate-400">{order.customer_email}</div>
                                    </td>
                                    <td className="px-4 py-3">{order.customer_type_label}</td>
                                    <td className="px-4 py-3">{formatMoney(order.total_amount)}</td>
                                    <td className="px-4 py-3 capitalize">{order.payment_method}</td>
                                    <td className="px-4 py-3"><AdminStatusBadge status={order.payment_status} /></td>
                                    <td className="px-4 py-3"><AdminStatusBadge status={order.status} /></td>
                                    <td className="px-4 py-3 text-slate-500">{formatDate(order.created_at)}</td>
                                    <td className="px-4 py-3">
                                        <Link href={route('admin.orders.show', order.id)} className="text-xs font-bold underline">
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <AdminPagination links={orders.links} />
        </AdminLayout>
    );
}
