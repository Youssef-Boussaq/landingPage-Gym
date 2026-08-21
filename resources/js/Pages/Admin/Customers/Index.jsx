import AdminBreadcrumbs from '@/Components/Admin/AdminBreadcrumbs';
import AdminEmptyState from '@/Components/Admin/AdminEmptyState';
import AdminPagination from '@/Components/Admin/AdminPagination';
import AdminSearchBar, { visitWithQuery } from '@/Components/Admin/AdminSearchBar';
import AdminLayout from '@/Layouts/AdminLayout';
import { formatDate, formatMoney } from '@/helpers/format';
import { Link } from '@inertiajs/react';

export default function CustomersIndex({ customers, filters }) {
    const applyFilters = (overrides = {}) => {
        visitWithQuery(route('admin.customers.index'), { ...filters, ...overrides });
    };

    return (
        <AdminLayout title="Clients">
            <AdminBreadcrumbs items={[{ label: 'Admin', href: route('admin.dashboard') }, { label: 'Customers' }]} />
            <h1 className="font-archivo text-2xl uppercase text-slate-900">Customers</h1>

            <div className="mt-5 flex flex-col gap-3 lg:flex-row">
                <AdminSearchBar value={filters.search} placeholder="Nom ou email…" onSearch={(search) => applyFilters({ search })} />
                <select value={filters.role} onChange={(event) => applyFilters({ role: event.target.value })} className="rounded-xl border-slate-200 text-sm">
                    <option value="">Tous les rôles</option>
                    <option value="customer">customer</option>
                    <option value="admin">admin</option>
                </select>
            </div>

            <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                {customers.data.length === 0 ? (
                    <div className="p-6">
                        <AdminEmptyState title="No customers found." />
                    </div>
                ) : (
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-400">
                            <tr>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Role</th>
                                <th className="px-4 py-3">Orders</th>
                                <th className="px-4 py-3">Total spent</th>
                                <th className="px-4 py-3">Created at</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.data.map((customer) => (
                                <tr key={customer.id} className="border-t border-slate-100">
                                    <td className="px-4 py-3 font-semibold">{customer.name}</td>
                                    <td className="px-4 py-3">{customer.email}</td>
                                    <td className="px-4 py-3">{customer.role}</td>
                                    <td className="px-4 py-3">{customer.orders_count}</td>
                                    <td className="px-4 py-3">{formatMoney(customer.total_spent)}</td>
                                    <td className="px-4 py-3 text-slate-500">{formatDate(customer.created_at)}</td>
                                    <td className="px-4 py-3">
                                        <Link href={route('admin.customers.show', customer.id)} className="text-xs font-bold underline">
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <AdminPagination links={customers.links} />
        </AdminLayout>
    );
}
