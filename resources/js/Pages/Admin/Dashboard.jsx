import AdminBreadcrumbs from '@/Components/Admin/AdminBreadcrumbs';
import DashboardFilterBar from '@/Components/Admin/DashboardFilterBar';
import AdminStatusBadge from '@/Components/Admin/AdminStatusBadge';
import AdminLayout from '@/Layouts/AdminLayout';
import { formatDate, formatDay, formatMoney } from '@/helpers/format';
import { Link, router, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowUpRight,
    Banknote,
    CheckCircle2,
    CircleDollarSign,
    Clock3,
    Download,
    Package,
    RefreshCw,
    ShoppingBag,
    Truck,
    Users,
    Wallet,
} from 'lucide-react';
import { useState } from 'react';

const STATUS_LABELS = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    processing: 'En préparation',
    shipped: 'Expédiée',
    out_for_delivery: 'En livraison',
    delivered: 'Terminée / Livrée',
    returned: 'Retournée',
    cancelled: 'Annulée',
};

const STATUS_COLORS = {
    pending: 'bg-amber-400',
    confirmed: 'bg-lime-500',
    processing: 'bg-sky-400',
    shipped: 'bg-blue-500',
    out_for_delivery: 'bg-indigo-500',
    delivered: 'bg-emerald-500',
    returned: 'bg-orange-400',
    cancelled: 'bg-rose-400',
};

const PAYMENT_STATUS_LABELS = {
    pending: 'En attente',
    paid: 'Payé',
    failed: 'Échoué',
};

const PAYMENT_STATUS_BADGES = {
    paid: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    pending: 'bg-amber-50 text-amber-800 border-amber-200',
    failed: 'bg-rose-50 text-rose-800 border-rose-200',
};

function MetricCard({ label, value, note, hint, icon: Icon, comparison, compareLabel, valueClass = 'text-stone-950' }) {
    return (
        <article className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-[0_2px_10px_rgba(20,20,20,0.025)]">
            <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-stone-500">{label}</p>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-50 text-stone-800">
                    <Icon size={18} strokeWidth={1.8} />
                </span>
            </div>
            <p className={`mt-4 text-2xl font-semibold tracking-tight sm:text-3xl ${valueClass}`}>{value}</p>
            {(note || hint) && (
                <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
                    {note && (
                        <span className="inline-flex items-center rounded-full bg-stone-100 px-2 py-0.5 font-medium text-stone-700">
                            {note}
                        </span>
                    )}
                    {hint && <span className="text-stone-400">{hint}</span>}
                </div>
            )}
            {compareLabel && (
                <p className="mt-3 text-xs text-stone-500">
                    {comparison === null || comparison === undefined ? (
                        <span>Aucune donnée sur {compareLabel}</span>
                    ) : (
                        <span className={comparison >= 0 ? 'font-semibold text-emerald-700' : 'font-semibold text-rose-700'}>
                            {comparison > 0 ? '+' : ''}{comparison}%
                            <span className="ml-1 font-normal text-stone-500">vs {compareLabel}</span>
                        </span>
                    )}
                </p>
            )}
        </article>
    );
}

function TrendChart({ revenueOverview = [], granularity, metric, onMetricChange }) {
    const width = 720;
    const height = 220;
    const paddingX = 36;
    const paddingY = 24;
    const chartWidth = width - paddingX * 2;
    const chartHeight = height - paddingY * 2;

    const maxRevenue = Math.max(...revenueOverview.map((row) => Number(row.revenue) || 0), 0);
    const maxOrders = Math.max(...revenueOverview.map((row) => Number(row.orders) || 0), 0);
    const totalRevenue = revenueOverview.reduce((sum, row) => sum + (Number(row.revenue) || 0), 0);
    const totalOrders = revenueOverview.reduce((sum, row) => sum + (Number(row.orders) || 0), 0);
    const totalPaid = revenueOverview.reduce((sum, row) => sum + (Number(row.paid_orders) || 0), 0);

    if (revenueOverview.length === 0 || totalOrders === 0) {
        return (
            <div className="py-12 text-center text-sm text-stone-500">Aucune commande ne correspond à cette sélection.</div>
        );
    }

    const denom = Math.max(revenueOverview.length - 1, 1);
    const revenueScale = maxRevenue || 1;
    const ordersScale = maxOrders || 1;

    const points = revenueOverview.map((row, index) => {
        const x = revenueOverview.length === 1 ? width / 2 : paddingX + index * (chartWidth / denom);
        const revenue = Number(row.revenue) || 0;
        const orders = Number(row.orders) || 0;
        return {
            x,
            revenueY: height - paddingY - (revenue / revenueScale) * chartHeight,
            ordersY: height - paddingY - (orders / ordersScale) * chartHeight,
            row,
            revenue,
            orders,
        };
    });

    const revenuePoints = points.map((point) => `${point.x.toFixed(1)},${point.revenueY.toFixed(1)}`).join(' ');
    const ordersPoints = points.map((point) => `${point.x.toFixed(1)},${point.ordersY.toFixed(1)}`).join(' ');
    const areaPoints = `${points[0].x},${height - paddingY} ${revenuePoints} ${points.at(-1).x},${height - paddingY}`;
    const labelStep = Math.max(1, Math.ceil(points.length / 7));
    const visibleLabels = points.filter((point, index) => index === 0 || index === points.length - 1 || index % labelStep === 0);
    const periodLabel = granularity === 'month' ? 'par mois' : granularity === 'week' ? 'par semaine' : 'par jour';

    return (
        <div className="mt-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500">
                <div className="flex flex-wrap items-center gap-3">
                    <span>Valeurs {periodLabel} · Maximum : {formatMoney(maxRevenue)} et {maxOrders} commande(s)</span>
                    <span className="inline-flex items-center gap-1.5"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-lime-700" />Revenus</span>
                    <span className="inline-flex items-center gap-1.5"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-blue-600" />Commandes</span>
                </div>
                <div className="inline-flex rounded-lg border border-stone-200 p-1" role="group" aria-label="Métriques du graphique">
                    {[
                        ['revenue', 'Revenus'],
                        ['orders', 'Commandes'],
                        ['both', 'Les deux'],
                    ].map(([value, label]) => (
                        <button key={value} type="button" onClick={() => onMetricChange(value)} aria-pressed={metric === value} className={`rounded-md px-2 py-1.5 font-semibold ${metric === value ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'}`}>
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <svg
                viewBox={`0 0 ${width} ${height}`}
                role="img"
                aria-label={`Graphique des revenus et commandes ${periodLabel}`}
                className="mt-2 h-48 sm:h-56 w-full overflow-visible"
            >
                <defs>
                    <linearGradient id="dashboardRevenueFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#9de500" stopOpacity="0.32" />
                        <stop offset="100%" stopColor="#9de500" stopOpacity="0.02" />
                    </linearGradient>
                </defs>

                {[0, 1, 2, 3].map((line) => {
                    const y = paddingY + line * (chartHeight / 3);
                    return (
                        <line
                            key={line}
                            x1={paddingX}
                            y1={y}
                            x2={width - paddingX}
                            y2={y}
                            stroke="#eeeae4"
                            strokeDasharray="4 5"
                        />
                    );
                })}

                {(metric === 'revenue' || metric === 'both') && <polygon points={areaPoints} fill="url(#dashboardRevenueFill)" />}
                {(metric === 'revenue' || metric === 'both') && <polyline points={revenuePoints} fill="none" stroke="#5d8500" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
                {(metric === 'orders' || metric === 'both') && <polyline points={ordersPoints} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeDasharray={metric === 'both' ? '6 4' : undefined} strokeLinecap="round" strokeLinejoin="round" />}

                {points.map((point) => (
                    <g key={point.row.date}>
                        {(metric === 'revenue' || metric === 'both') && <circle cx={point.x} cy={point.revenueY} r="4" fill="white" stroke="#5d8500" strokeWidth="2.5"><title>{`${formatDay(point.row.date)} : ${formatMoney(point.row.revenue)} de revenus payés`}</title></circle>}
                        {(metric === 'orders' || metric === 'both') && <circle cx={point.x} cy={point.ordersY} r="3.5" fill="white" stroke="#2563eb" strokeWidth="2"><title>{`${formatDay(point.row.date)} : ${point.row.orders} commande(s)`}</title></circle>}
                    </g>
                ))}
            </svg>

            <div className="mt-2 flex justify-between gap-2 text-center text-[11px] font-medium text-stone-400">
                {visibleLabels.map((point) => (
                    <div key={point.row.date} className="min-w-0 truncate">
                        <span className="block font-semibold text-stone-600">{formatDay(point.row.date)}</span>
                        <span className="block text-[10px] text-stone-400 tabular-nums">{metric === 'orders' ? `${point.orders} cmd.` : formatMoney(point.row.revenue)}</span>
                    </div>
                ))}
            </div>

            <div className="mt-6 border-t border-stone-100 pt-4 overflow-x-auto">
                <div className="mb-2 flex items-center justify-between text-xs text-stone-500">
                    <span className="font-semibold uppercase tracking-wider text-stone-400">
                        Détail de la période sélectionnée
                    </span>
                    <span className="tabular-nums font-semibold text-stone-800">
                        Total : {formatMoney(totalRevenue)} ({totalOrders} cmd. / {totalPaid} payée(s))
                    </span>
                </div>
                <details>
                    <summary className="cursor-pointer py-2 text-xs font-semibold text-stone-600">Afficher les valeurs agrégées ({revenueOverview.length})</summary>
                    <table className="min-w-full text-left text-xs">
                    <thead className="bg-stone-50 text-stone-400 uppercase tracking-wide">
                        <tr>
                            <th className="py-2 px-3 font-semibold rounded-l-lg">Période</th>
                            <th className="py-2 px-3 font-semibold text-center">Commandes</th>
                            <th className="py-2 px-3 font-semibold text-center">Payées</th>
                            <th className="py-2 px-3 font-semibold text-center">Annulées</th>
                            <th className="py-2 px-3 font-semibold text-right rounded-r-lg">Chiffre d’affaires</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {revenueOverview.map((row) => (
                            <tr key={`row-${row.date}`} className="text-stone-600 hover:bg-stone-50/60 transition">
                                <td className="py-2.5 px-3 font-medium text-stone-900">{formatDay(row.date)}</td>
                                <td className="py-2.5 px-3 text-center tabular-nums font-medium text-stone-800">{row.orders}</td>
                                <td className="py-2.5 px-3 text-center tabular-nums font-semibold text-emerald-700">{row.paid_orders}</td>
                                <td className="py-2.5 px-3 text-center tabular-nums text-rose-600">{row.cancelled_orders}</td>
                                <td className="py-2.5 px-3 text-right font-semibold text-stone-900 tabular-nums">{formatMoney(row.revenue)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </details>
            </div>
        </div>
    );
}

export default function Dashboard({
    stats = {},
    recentOrders = [],
    revenueOverview = [],
    orderStatusDistribution = {},
    paymentStatusDistribution = {},
    lowStockProducts = [],
    topProducts = [],
    unreadNotificationsCount = 0,
    lowStockThreshold = 10,
    filters = { period: 'last_7_days', start_date: '', end_date: '', status: '', payment_status: '', category_id: '' },
    filterOptions = { statuses: [], paymentStatuses: [], categories: [] },
    comparisons = {},
    trendGranularity = 'day',
}) {
    const [activeTab, setActiveTab] = useState('sales');
    const [trendMetric, setTrendMetric] = useState('both');
    const [loading, setLoading] = useState(false);
    const { errors = {} } = usePage().props;

    const safeStats = {
        total_revenue: stats?.total_revenue ?? 0,
        total_orders: stats?.total_orders ?? 0,
        average_order_value: stats?.average_order_value ?? 0,
        pending_orders: stats?.pending_orders ?? 0,
        paid_orders: stats?.paid_orders ?? 0,
        products_sold: stats?.products_sold ?? 0,
        total_customers: stats?.total_customers ?? 0,
        guest_orders: stats?.guest_orders ?? 0,
        products: stats?.products ?? 0,
        low_stock_products: stats?.low_stock_products ?? 0,
    };

    const applyFilters = (overrides = {}) => {
        const query = { ...filters, ...overrides };
        if (query.period !== 'custom') {
            delete query.start_date;
            delete query.end_date;
        }
        Object.keys(query).forEach((key) => {
            if (query[key] === '' || query[key] === null || query[key] === undefined) delete query[key];
        });

        router.get(route('admin.dashboard'), query, {
            preserveState: true,
            preserveScroll: true,
            onStart: () => setLoading(true),
            onFinish: () => setLoading(false),
        });
    };

    const resetFilters = () => {
        router.get(route('admin.dashboard'), {}, {
            preserveScroll: true,
            onStart: () => setLoading(true),
            onFinish: () => setLoading(false),
        });
    };

    const compareLabel = comparisons.previous_start_date && comparisons.previous_end_date
        ? `${formatDay(comparisons.previous_start_date)} – ${formatDay(comparisons.previous_end_date)}`
        : null;

    return (
        <AdminLayout title="Analytics Dashboard">
            <div className="mx-auto w-full max-w-[1500px] space-y-7 pb-10">
                <AdminBreadcrumbs
                    items={[{ label: 'Admin', href: route('admin.dashboard') }, { label: 'Analytics' }]}
                />

                <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-lime-700">
                            Vue d’ensemble / Analytics
                        </p>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                            Performance du magasin
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
                            Suivez les ventes et les commandes sur une période comparable. Le rapprochement COD reste distinct des paiements confirmés.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {unreadNotificationsCount > 0 && (
                            <Link
                                href={route('admin.notifications.index')}
                                className="inline-flex h-11 items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 text-xs font-semibold text-amber-900 shadow-sm transition hover:bg-amber-100"
                            >
                                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                                <span>{unreadNotificationsCount} notification(s)</span>
                            </Link>
                        )}
                        <button type="button" onClick={() => router.reload({ preserveScroll: true, onStart: () => setLoading(true), onFinish: () => setLoading(false) })} disabled={loading} className="inline-flex h-11 items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 text-sm font-semibold text-stone-700 shadow-sm hover:bg-stone-50 disabled:opacity-50">
                            <RefreshCw aria-hidden="true" size={15} className={loading ? 'animate-spin' : ''} /> Actualiser
                        </button>
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="inline-flex h-11 items-center gap-2 rounded-xl bg-stone-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800"
                        >
                            <Download size={16} /> Imprimer / PDF
                        </button>
                    </div>
                </header>

                <DashboardFilterBar filters={filters} filterOptions={filterOptions} errors={errors} loading={loading} onApply={applyFilters} onReset={resetFilters} />

                <nav
                    className="flex w-full gap-1 overflow-x-auto rounded-2xl border border-stone-200 bg-stone-100/80 p-1.5 sm:w-fit"
                    aria-label="Sections analytics"
                >
                    <button
                        type="button"
                        onClick={() => setActiveTab('sales')}
                        className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                            activeTab === 'sales'
                                ? 'bg-white text-stone-950 shadow-sm'
                                : 'text-stone-500 hover:text-stone-900'
                        }`}
                    >
                        <span className="inline-flex items-center gap-2">
                            <ShoppingBag size={16} /> Ventes & demande
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('cash')}
                        className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                            activeTab === 'cash'
                                ? 'bg-white text-stone-950 shadow-sm'
                                : 'text-stone-500 hover:text-stone-900'
                        }`}
                    >
                        <span className="inline-flex items-center gap-2">
                            <Wallet size={16} /> Cash & rapprochement COD
                        </span>
                    </button>
                </nav>

                {activeTab === 'sales' ? (
                    <>
                        {/* 4 Metric Cards */}
                        <section aria-busy={loading} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            <MetricCard
                                label={filters.category_id ? 'Ventes produits payées' : 'Chiffre d’affaires payé'}
                                value={formatMoney(safeStats.total_revenue)}
                                note={`${safeStats.paid_orders} commande(s) réglée(s)`}
                                hint={filters.category_id ? 'Sous-total des articles de la catégorie' : 'Hors commandes annulées'}
                                icon={CircleDollarSign}
                                comparison={comparisons.total_revenue}
                                compareLabel={compareLabel}
                            />
                            <MetricCard
                                label="Commandes totales"
                                value={safeStats.total_orders}
                                note={`${safeStats.pending_orders} en attente · ${safeStats.cancelled_orders} annulée(s)`}
                                hint="Sur la sélection active"
                                icon={ShoppingBag}
                                comparison={comparisons.total_orders}
                                compareLabel={compareLabel}
                            />
                            <MetricCard
                                label={filters.category_id ? 'Ventes moyennes par commande' : 'Panier moyen payé'}
                                value={formatMoney(safeStats.average_order_value)}
                                note="Revenu payé / commandes payées"
                                hint="Hors commandes annulées"
                                icon={Banknote}
                            />
                            <MetricCard
                                label="Commandes payées"
                                value={safeStats.paid_orders}
                                note="Statut de paiement payé"
                                hint="Hors commandes annulées"
                                icon={CheckCircle2}
                                comparison={comparisons.paid_orders}
                                compareLabel={compareLabel}
                            />
                            <MetricCard
                                label="Commandes en attente"
                                value={safeStats.pending_orders}
                                note={`${safeStats.guest_orders} commande(s) invité`}
                                hint={`${safeStats.total_customers} client(s) avec commande`}
                                icon={Users}
                            />
                            <MetricCard
                                label="Articles vendus"
                                value={safeStats.products_sold}
                                note="Commandes payées non annulées"
                                hint={filters.category_id ? 'Dans la catégorie sélectionnée' : 'Sur la période sélectionnée'}
                                icon={Package}
                            />
                        </section>

                        {/* Revenue Chart & Status Distribution */}
                        <section aria-busy={loading} className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)]">
                            <article className="rounded-2xl border border-stone-200/80 bg-white p-5 sm:p-6 shadow-sm">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <h2 className="text-lg font-semibold text-stone-950">Évolution des ventes</h2>
                                        <p className="mt-1 text-sm text-stone-500">
                                            Revenus payés et commandes sur la période sélectionnée
                                        </p>
                                    </div>
                                    <span className="rounded-lg bg-lime-50 px-3 py-1.5 text-xs font-semibold text-lime-800">
                                        {filters.start_date} – {filters.end_date}
                                    </span>
                                </div>
                                <TrendChart revenueOverview={revenueOverview} granularity={trendGranularity} metric={trendMetric} onMetricChange={setTrendMetric} />
                            </article>

                            <article className="rounded-2xl border border-stone-200/80 bg-white p-5 sm:p-6 shadow-sm flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-semibold text-stone-950">État des commandes</h2>
                                        <span className="rounded-lg bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-600">
                                            {safeStats.total_orders} au total
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm text-stone-500">Répartition réelle des commandes</p>

                                    {Object.keys(orderStatusDistribution).length === 0 ? (
                                        <p className="mt-6 text-sm text-stone-400">Aucune commande enregistrée pour le moment.</p>
                                    ) : (
                                        <div className="mt-5 space-y-3.5">
                                            {Object.entries(orderStatusDistribution).map(([status, count]) => {
                                                const cnt = Number(count) || 0;
                                                const percent = safeStats.total_orders > 0
                                                    ? Math.round((cnt / safeStats.total_orders) * 100)
                                                    : 0;
                                                const label = STATUS_LABELS[status] || status;
                                                const color = STATUS_COLORS[status] || 'bg-stone-400';

                                                return (
                                                    <div key={status}>
                                                        <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                                                            <span className="font-medium text-stone-700 capitalize">{label}</span>
                                                            <span className="font-semibold tabular-nums text-stone-900">
                                                                {cnt} <span className="font-normal text-stone-400">({percent}%)</span>
                                                            </span>
                                                        </div>
                                                        <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                                                            <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }} />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Payment Status Distribution */}
                                    <div className="mt-6 border-t border-stone-100 pt-5">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                                            Répartition des règlements
                                        </h3>
                                        {Object.keys(paymentStatusDistribution).length === 0 ? (
                                            <p className="mt-3 text-xs text-stone-400">Aucun règlement enregistré.</p>
                                        ) : (
                                            <div className="mt-3 space-y-2">
                                                {Object.entries(paymentStatusDistribution).map(([pStatus, count]) => {
                                                    const cnt = Number(count) || 0;
                                                    const label = PAYMENT_STATUS_LABELS[pStatus] || pStatus;
                                                    const badgeStyle = PAYMENT_STATUS_BADGES[pStatus] || 'bg-stone-100 text-stone-700 border-stone-200';

                                                    return (
                                                        <div key={pStatus} className="flex items-center justify-between text-xs py-1">
                                                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold capitalize ${badgeStyle}`}>
                                                                {label}
                                                            </span>
                                                            <span className="font-semibold tabular-nums text-stone-800">
                                                                {cnt} commande(s)
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6 rounded-xl bg-stone-50 p-3 text-xs leading-5 text-stone-500">
                                    Une commande livrée ne signifie pas nécessairement que le cash COD a déjà été versé.
                                </div>
                            </article>
                        </section>

                        {/* Top Products & Operational Indicators */}
                        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
                            <article className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm">
                                <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4 sm:px-6">
                                    <div>
                                        <h2 className="font-semibold text-stone-950">Produits les plus vendus</h2>
                                        <p className="mt-1 text-sm text-stone-500">
                                            Classement par unités vendues (commandes payées)
                                        </p>
                                    </div>
                                    <span className="rounded-lg bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-600">
                                        Top {topProducts.length}
                                    </span>
                                </div>
                                {topProducts.length === 0 ? (
                                    <div className="p-8 text-center text-sm text-stone-400">
                                        Pas encore de ventes payées pour alimenter le classement.
                                    </div>
                                ) : (
                                    <div className="divide-y divide-stone-100">
                                        {topProducts.map((product, index) => {
                                            const maxUnits = Math.max(
                                                ...topProducts.map((p) => Number(p.units_sold) || 0),
                                                1
                                            );
                                            const share = Math.round(
                                                ((Number(product.units_sold) || 0) / maxUnits) * 100
                                            );

                                            return (
                                                <div
                                                    key={product.id || index}
                                                    className="flex items-center gap-4 px-5 py-4 sm:px-6 hover:bg-stone-50/50 transition"
                                                >
                                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-sm font-bold text-stone-500">
                                                        {String(index + 1).padStart(2, '0')}
                                                    </span>
                                                    <img
                                                        src={product.image || '/images/placeholder.png'}
                                                        alt={product.title}
                                                        className="h-11 w-11 shrink-0 rounded-xl object-cover border border-stone-200/60 bg-stone-50"
                                                    />
                                                    <div className="min-w-0 flex-1">
                                                        <Link
                                                            href={route('admin.products.show', product.id)}
                                                            className="truncate text-sm font-semibold text-stone-900 hover:text-stone-700 hover:underline block"
                                                        >
                                                            {product.title}
                                                        </Link>
                                                        <p className="mt-0.5 text-xs text-stone-400">
                                                            {product.units_sold} unité(s) vendue(s)
                                                        </p>
                                                        <div className="mt-2 h-1.5 max-w-sm overflow-hidden rounded-full bg-stone-100">
                                                            <div
                                                                className="h-full rounded-full bg-lime-500"
                                                                style={{ width: `${share}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <p className="shrink-0 text-sm font-semibold tabular-nums text-stone-900">
                                                        {formatMoney(product.revenue)}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </article>

                            <article className="rounded-2xl border border-stone-200/80 bg-white p-5 sm:p-6 shadow-sm flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                                            <Package size={19} />
                                        </span>
                                        <div>
                                            <h2 className="font-semibold text-stone-950">À surveiller</h2>
                                            <p className="mt-0.5 text-sm text-stone-500">Indicateurs opérationnels en direct</p>
                                        </div>
                                    </div>

                                    <div className="mt-5 space-y-3">
                                        <div className="flex items-center justify-between rounded-xl border border-stone-100 p-3">
                                            <div>
                                                <p className="text-sm font-medium text-stone-800">Commandes en attente</p>
                                                <p className="mt-0.5 text-xs text-stone-400">À traiter par l’équipe</p>
                                            </div>
                                            <span className="rounded-lg bg-sky-50 px-2.5 py-1 text-sm font-bold text-sky-800 tabular-nums">
                                                {safeStats.pending_orders}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between rounded-xl border border-stone-100 p-3">
                                            <div>
                                                <p className="text-sm font-medium text-stone-800">Commandes invités</p>
                                                <p className="mt-0.5 text-xs text-stone-400">Commandes sans compte client</p>
                                            </div>
                                            <span className="rounded-lg bg-stone-100 px-2.5 py-1 text-sm font-bold text-stone-800 tabular-nums">
                                                {safeStats.guest_orders}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between rounded-xl border border-stone-100 p-3">
                                            <div>
                                                <p className="text-sm font-medium text-stone-800">Catalogue actif</p>
                                                <p className="mt-0.5 text-xs text-stone-400">Total références produits</p>
                                            </div>
                                            <span className="rounded-lg bg-lime-50 px-2.5 py-1 text-sm font-bold text-lime-800 tabular-nums">
                                                {safeStats.products}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Low Stock List */}
                                    <div className="mt-6 border-t border-stone-100 pt-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                                                Stock critique (&lt; {lowStockThreshold} unités)
                                            </h3>
                                            <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-800 tabular-nums">
                                                {safeStats.low_stock_products}
                                            </span>
                                        </div>

                                        {lowStockProducts.length === 0 ? (
                                            <p className="text-xs text-stone-400">Aucun produit sous le seuil d’alerte.</p>
                                        ) : (
                                            <ul className="space-y-2.5">
                                                {lowStockProducts.map((product) => (
                                                    <li key={product.id} className="flex items-center justify-between gap-3 text-sm">
                                                        <Link
                                                            href={route('admin.products.show', product.id)}
                                                            className="truncate font-medium text-stone-800 hover:text-stone-950 hover:underline"
                                                        >
                                                            {product.title}
                                                        </Link>
                                                        <span className="shrink-0 rounded-md bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-700 tabular-nums">
                                                            {product.stock_quantity} restant(s)
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </article>
                        </section>

                        {/* Recent Orders Section */}
                        <article className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-stone-100 px-5 py-4 sm:px-6 gap-2">
                                <div>
                                    <h2 className="font-semibold text-stone-950">Commandes récentes</h2>
                                    <p className="mt-0.5 text-sm text-stone-500">
                                        Dernières commandes correspondant aux filtres actifs
                                    </p>
                                </div>
                                <Link
                                    href={route('admin.orders.index')}
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-stone-950 hover:underline"
                                >
                                    <span>Voir toutes les commandes</span>
                                    <ArrowUpRight size={14} />
                                </Link>
                            </div>

                            {recentOrders.length === 0 ? (
                                <div className="p-8 text-center text-sm text-stone-400">
                                    Aucune commande enregistrée pour le moment.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[760px] text-left text-sm">
                                        <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-400">
                                            <tr>
                                                <th className="px-5 py-3 font-semibold">Commande</th>
                                                <th className="px-4 py-3 font-semibold">Client</th>
                                                <th className="px-4 py-3 font-semibold">Type</th>
                                                <th className="px-4 py-3 font-semibold">Total</th>
                                                <th className="px-4 py-3 font-semibold">Paiement</th>
                                                <th className="px-4 py-3 font-semibold">Statut</th>
                                                <th className="px-4 py-3 font-semibold">Date</th>
                                                <th className="px-5 py-3 font-semibold text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-100">
                                            {recentOrders.map((order) => (
                                                <tr key={order.id} className="text-stone-600 hover:bg-stone-50/50 transition">
                                                    <td className="px-5 py-3.5 font-semibold text-stone-900">
                                                        {order.order_number}
                                                    </td>
                                                    <td className="px-4 py-3.5">
                                                        <div className="font-medium text-stone-800">{order.customer_name || '—'}</div>
                                                        <div className="text-xs text-stone-400">{order.customer_email || '—'}</div>
                                                    </td>
                                                    <td className="px-4 py-3.5 text-xs text-stone-500">
                                                        {order.customer_type_label}
                                                    </td>
                                                    <td className="px-4 py-3.5 font-semibold tabular-nums text-stone-900">
                                                        {formatMoney(order.total_amount)}
                                                    </td>
                                                    <td className="px-4 py-3.5">
                                                        <AdminStatusBadge status={order.payment_status} label={order.payment_status_label} />
                                                    </td>
                                                    <td className="px-4 py-3.5">
                                                        <AdminStatusBadge status={order.status} label={order.status_label} />
                                                    </td>
                                                    <td className="px-4 py-3.5 text-xs text-stone-500 tabular-nums">
                                                        {formatDate(order.created_at)}
                                                    </td>
                                                    <td className="px-5 py-3.5 text-right">
                                                        <Link
                                                            href={route('admin.orders.show', order.id)}
                                                            className="inline-flex items-center gap-1 text-xs font-semibold text-stone-900 hover:text-lime-700 underline underline-offset-2"
                                                        >
                                                            Détails
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </article>
                    </>
                ) : (
                    <>
                        {/* Cash & COD Reconciliation Section */}
                        <div className="flex items-start gap-3.5 rounded-2xl border border-amber-200/80 bg-amber-50/60 p-5 text-amber-900 shadow-sm">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                                <AlertTriangle size={18} />
                            </span>
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-amber-950">
                                    Module de rapprochement COD en attente de données bancaires et transporteur
                                </p>
                                <p className="text-xs leading-5 text-amber-900/80">
                                    Le backend actuel enregistre les commandes et leur statut logistique, mais ne traite pas encore l’import des bordereaux de versement AMEEX ni les relevés d’opérations bancaires confirmés. Afin de respecter une intégrité financière stricte, aucun encaissement théorique ou écart de caisse n’est calculé ou simulé.
                                </p>
                            </div>
                        </div>

                        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <MetricCard
                                label="Cash attendu COD"
                                value="Non disponible"
                                valueClass="text-stone-400 text-xl sm:text-2xl"
                                note="Bordereau transporteur requis"
                                hint="En attente de relevé AMEEX"
                                icon={Banknote}
                            />
                            <MetricCard
                                label="Cash encaissé confirmé"
                                value="Non disponible"
                                valueClass="text-stone-400 text-xl sm:text-2xl"
                                note="Avis d'opéré bancaire requis"
                                hint="Pointage bancaire non connecté"
                                icon={CheckCircle2}
                            />
                            <MetricCard
                                label="Écart de rapprochement"
                                value="Non disponible"
                                valueClass="text-stone-400 text-xl sm:text-2xl"
                                note="Calcul automatique à l'activation"
                                hint="Attendu vs Reçu"
                                icon={CircleDollarSign}
                            />
                            <MetricCard
                                label="Principe comptable"
                                value="Prudence stricte"
                                valueClass="text-stone-800 text-xl sm:text-2xl"
                                note="Statut livré ≠ cash en caisse"
                                hint="Audit indépendant"
                                icon={Truck}
                            />
                        </section>

                        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.8fr)]">
                            <article className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm">
                                <div className="border-b border-stone-100 px-5 py-4 sm:px-6 flex items-center justify-between">
                                    <div>
                                        <h2 className="font-semibold text-stone-950">Suivi des versements transporteurs (COD)</h2>
                                        <p className="mt-0.5 text-sm text-stone-500">Rapprochement financier par bordereau / lot de livraison</p>
                                    </div>
                                    <span className="rounded-lg bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-600">
                                        Prêt pour intégration
                                    </span>
                                </div>

                                <div className="p-8 sm:p-12 text-center">
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-500">
                                        <Wallet size={24} />
                                    </div>
                                    <h3 className="mt-4 text-base font-semibold text-stone-900">
                                        Données de rapprochement COD actuellement non disponibles
                                    </h3>
                                    <p className="mx-auto mt-2 max-w-lg text-xs leading-5 text-stone-500">
                                        Cette section est conçue pour accueillir les flux réels de reversement dès que la synchronisation avec les bordereaux AMEEX et les comptes bancaires sera disponible dans le backend. Aucun montant n'est simulé pour éviter toute fausse interprétation de trésorerie.
                                    </p>
                                    <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-stone-100 px-3.5 py-2 text-xs font-medium text-stone-600">
                                        <Clock3 size={15} />
                                        <span>En attente de l'implémentation du module de rapprochement backend</span>
                                    </div>
                                </div>

                                {/* Illustrative wireframe structure ready for future data */}
                                <div className="border-t border-stone-100 bg-stone-50/50 p-4">
                                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                                        Structure cible prête pour la future table :
                                    </p>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs text-stone-400">
                                            <thead>
                                                <tr className="border-b border-stone-200/60 font-semibold">
                                                    <th className="py-2 pr-3">Canal / Transporteur</th>
                                                    <th className="py-2 pr-3">Colis remis</th>
                                                    <th className="py-2 pr-3">Livrés</th>
                                                    <th className="py-2 pr-3">Cash attendu</th>
                                                    <th className="py-2 pr-3">Cash versé</th>
                                                    <th className="py-2 pr-3">Écart</th>
                                                    <th className="py-2">Statut</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-b border-stone-100 text-stone-300">
                                                    <td className="py-2 pr-3">—</td>
                                                    <td className="py-2 pr-3">—</td>
                                                    <td className="py-2 pr-3">—</td>
                                                    <td className="py-2 pr-3">—</td>
                                                    <td className="py-2 pr-3">—</td>
                                                    <td className="py-2 pr-3">—</td>
                                                    <td className="py-2">—</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </article>

                            <article className="rounded-2xl border border-stone-200/80 bg-white p-5 sm:p-6 shadow-sm">
                                <h2 className="font-semibold text-stone-950">Règles de lecture financière</h2>
                                <p className="mt-1 text-sm text-stone-500">Principes indispensables pour l'activité e-commerce</p>
                                <div className="mt-5 space-y-4">
                                    <div className="flex gap-3">
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                                            <Truck size={17} />
                                        </span>
                                        <div>
                                            <p className="text-sm font-semibold text-stone-900">Livraison ≠ Encaissement</p>
                                            <p className="mt-1 text-xs leading-5 text-stone-500">
                                                Le statut livré confirme que le colis a été remis au client, mais ne garantit pas que les fonds ont été transférés par le transporteur.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                                            <Wallet size={17} />
                                        </span>
                                        <div>
                                            <p className="text-sm font-semibold text-stone-900">Preuve d’encaissement</p>
                                            <p className="mt-1 text-xs leading-5 text-stone-500">
                                                Le montant encaissé doit provenir d’un avis d’opéré bancaire ou d’un bordereau de décharge officiel émis par AMEEX.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                                            <Clock3 size={17} />
                                        </span>
                                        <div>
                                            <p className="text-sm font-semibold text-stone-900">Rapprochement & Écarts</p>
                                            <p className="mt-1 text-xs leading-5 text-stone-500">
                                                Tout écart entre la valeur marchande déclarée et le montant viré doit rester en anomalie jusqu’à justification ou régularisation.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </section>
                    </>
                )}

                <footer className="border-t border-stone-200 pt-4 text-xs leading-5 text-stone-400">
                    Tableau de bord administrateur · Connecté aux données Laravel en direct · Rapprochement bancaire COD soumis à intégration future des bordereaux transporteur.
                </footer>
            </div>
        </AdminLayout>
    );
}
