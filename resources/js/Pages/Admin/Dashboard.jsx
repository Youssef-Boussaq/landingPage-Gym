import AdminBreadcrumbs from '@/Components/Admin/AdminBreadcrumbs';
import AdminEmptyState from '@/Components/Admin/AdminEmptyState';
import AdminStatCard from '@/Components/Admin/AdminStatCard';
import AdminStatusBadge from '@/Components/Admin/AdminStatusBadge';
import AdminLayout from '@/Layouts/AdminLayout';
import { formatDate, formatDay, formatMoney } from '@/helpers/format';
import { Link } from '@inertiajs/react';
import {
    Banknote,
    ShoppingBag,
    Clock,
    BadgeCheck,
    Users,
    UserRound,
    Package,
    AlertTriangle,
} from 'lucide-react';

export default function Dashboard({
    stats,
    recentOrders = [],
    revenueOverview = [],
    orderStatusDistribution = {},
    paymentStatusDistribution = {},
    lowStockProducts = [],
    topProducts = [],
    unreadNotificationsCount = 0,
    lowStockThreshold = 10,
}) {
    const maxRevenue = Math.max(...revenueOverview.map((row) => Number(row.revenue) || 0), 1);

    return (
        <AdminLayout title="Dashboard">
            <AdminBreadcrumbs items={[{ label: 'Admin' }, { label: 'Dashboard' }]} />
            <div className="mb-6 flex items-end justify-between">
                <div>
                    <h1 className="font-archivo text-2xl uppercase text-slate-900">Dashboard</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        {unreadNotificationsCount} notification(s) non lue(s)
                    </p>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <AdminStatCard label="Total Revenue" value={formatMoney(stats.total_revenue)} icon={Banknote} />
                <AdminStatCard label="Total Orders" value={stats.total_orders} icon={ShoppingBag} />
                <AdminStatCard label="Pending Orders" value={stats.pending_orders} icon={Clock} />
                <AdminStatCard label="Paid Orders" value={stats.paid_orders} icon={BadgeCheck} />
                <AdminStatCard label="Total Customers" value={stats.total_customers} icon={Users} />
                <AdminStatCard label="Guest Orders" value={stats.guest_orders} icon={UserRound} />
                <AdminStatCard label="Products" value={stats.products} icon={Package} />
                <AdminStatCard
                    label="Low Stock Products"
                    value={stats.low_stock_products}
                    icon={AlertTriangle}
                    hint={`Seuil < ${lowStockThreshold}`}
                />
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-3">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                        Revenus — 7 derniers jours
                    </h2>
                    <div className="mt-6 flex h-44 items-end gap-2">
                        {revenueOverview.map((row) => (
                            <div key={row.date} className="flex flex-1 flex-col items-center gap-2">
                                <div
                                    className="w-full rounded-t-lg bg-slate-900"
                                    style={{ height: `${Math.max((Number(row.revenue) / maxRevenue) * 100, 4)}%` }}
                                    title={`${formatMoney(row.revenue)} • ${row.orders} commandes`}
                                />
                                <span className="text-[10px] font-semibold text-slate-400">
                                    {formatDay(row.date)}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="text-xs uppercase text-slate-400">
                                <tr>
                                    <th className="pb-2">Date</th>
                                    <th className="pb-2">Commandes</th>
                                    <th className="pb-2">Payées</th>
                                    <th className="pb-2">Annulées</th>
                                    <th className="pb-2">Revenu</th>
                                </tr>
                            </thead>
                            <tbody>
                                {revenueOverview.map((row) => (
                                    <tr key={`row-${row.date}`} className="border-t border-slate-100">
                                        <td className="py-2">{formatDay(row.date)}</td>
                                        <td>{row.orders}</td>
                                        <td>{row.paid_orders}</td>
                                        <td>{row.cancelled_orders}</td>
                                        <td className="font-semibold">{formatMoney(row.revenue)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Statuts commandes</h2>
                        <ul className="mt-3 space-y-2 text-sm">
                            {Object.entries(orderStatusDistribution).map(([status, total]) => (
                                <li key={status} className="flex items-center justify-between">
                                    <AdminStatusBadge status={status} />
                                    <span className="font-semibold">{total}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Paiements</h2>
                        <ul className="mt-3 space-y-2 text-sm">
                            {Object.entries(paymentStatusDistribution).map(([status, total]) => (
                                <li key={status} className="flex items-center justify-between">
                                    <AdminStatusBadge status={status} />
                                    <span className="font-semibold">{total}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-2">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Commandes récentes</h2>
                        <Link href={route('admin.orders.index')} className="text-xs font-bold text-slate-600 hover:text-slate-900">
                            Tout voir
                        </Link>
                    </div>
                    {recentOrders.length === 0 ? (
                        <AdminEmptyState title="Aucune commande" description="Les nouvelles commandes apparaîtront ici." />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm">
                                <thead className="text-xs uppercase text-slate-400">
                                    <tr>
                                        <th className="pb-2">Order</th>
                                        <th className="pb-2">Customer</th>
                                        <th className="pb-2">Type</th>
                                        <th className="pb-2">Total</th>
                                        <th className="pb-2">Payment</th>
                                        <th className="pb-2">Status</th>
                                        <th className="pb-2">Date</th>
                                        <th className="pb-2"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order) => (
                                        <tr key={order.id} className="border-t border-slate-100">
                                            <td className="py-3 font-semibold">{order.order_number}</td>
                                            <td>
                                                <div>{order.customer_name || '—'}</div>
                                                <div className="text-xs text-slate-400">{order.customer_email}</div>
                                            </td>
                                            <td>{order.customer_type_label}</td>
                                            <td>{formatMoney(order.total_amount)}</td>
                                            <td><AdminStatusBadge status={order.payment_status} /></td>
                                            <td><AdminStatusBadge status={order.status} /></td>
                                            <td className="text-slate-500">{formatDate(order.created_at)}</td>
                                            <td>
                                                <Link
                                                    href={route('admin.orders.show', order.id)}
                                                    className="text-xs font-bold text-slate-900 underline"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                <section className="space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Top produits</h2>
                        {topProducts.length === 0 ? (
                            <p className="mt-3 text-sm text-slate-500">Pas encore de ventes payées.</p>
                        ) : (
                            <ul className="mt-3 space-y-3">
                                {topProducts.map((product) => (
                                    <li key={product.id} className="flex items-center gap-3">
                                        <img
                                            src={product.image || '/images/placeholder.png'}
                                            alt={product.title}
                                            className="h-12 w-12 rounded-lg object-cover"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-bold">{product.title}</p>
                                            <p className="text-xs text-slate-500">
                                                {product.units_sold} vendus • {formatMoney(product.revenue)}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Stock faible</h2>
                        {lowStockProducts.length === 0 ? (
                            <p className="mt-3 text-sm text-slate-500">Aucun produit sous le seuil.</p>
                        ) : (
                            <ul className="mt-3 space-y-3">
                                {lowStockProducts.map((product) => (
                                    <li key={product.id} className="flex items-center justify-between gap-3">
                                        <Link
                                            href={route('admin.products.show', product.id)}
                                            className="truncate text-sm font-semibold hover:underline"
                                        >
                                            {product.title}
                                        </Link>
                                        <span className="text-sm font-bold text-rose-600">
                                            {product.stock_quantity}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}
