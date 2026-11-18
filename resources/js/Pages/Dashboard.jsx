import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import {
    ArrowDownRight,
    ArrowUpRight,
    Banknote,
    CalendarDays,
    CheckCircle2,
    CircleDollarSign,
    Clock3,
    Download,
    Package,
    ShoppingBag,
    Truck,
    Users,
    Wallet,
} from 'lucide-react';

const periods = [
    { value: '7d', label: '7 derniers jours' },
    { value: '30d', label: '30 derniers jours' },
    { value: '90d', label: '90 derniers jours' },
];

const mockByPeriod = {
    '7d': {
        revenue: '18 450 DH', revenueChange: '+12,8%', orders: '126', ordersChange: '+8,2%',
        average: '146,43 DH', averageChange: '+4,1%', customers: '84',
        chart: [32, 48, 39, 64, 54, 78, 67],
        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        sales: [1200, 1850, 1420, 2600, 2150, 3400, 2950],
    },
    '30d': {
        revenue: '72 890 DH', revenueChange: '+9,4%', orders: '482', ordersChange: '+6,7%',
        average: '151,22 DH', averageChange: '+2,5%', customers: '296',
        chart: [42, 35, 52, 48, 68, 57, 82],
        labels: ['1–4', '5–8', '9–12', '13–16', '17–20', '21–24', '25–30'],
        sales: [6800, 5400, 8200, 7600, 10400, 9100, 12400],
    },
    '90d': {
        revenue: '208 340 DH', revenueChange: '+18,6%', orders: '1 364', ordersChange: '+14,2%',
        average: '152,89 DH', averageChange: '+3,8%', customers: '782',
        chart: [28, 42, 38, 57, 51, 73, 88],
        labels: ['Sem. 1', 'Sem. 2', 'Sem. 3', 'Sem. 4', 'Sem. 5', 'Sem. 6', 'Sem. 7'],
        sales: [18000, 24000, 22000, 31000, 29000, 39000, 46000],
    },
};

const products = [
    { name: 'Whey Protein — Chocolat', category: 'Suppléments', units: 84, revenue: '16 800 DH', share: 82 },
    { name: 'Créatine Monohydrate', category: 'Suppléments', units: 62, revenue: '7 440 DH', share: 61 },
    { name: 'Shaker Fit Youness', category: 'Accessoires', units: 48, revenue: '3 840 DH', share: 47 },
];

const orderStatuses = [
    { label: 'Livrées', count: 74, percent: 59, color: 'bg-emerald-500' },
    { label: 'En traitement', count: 28, percent: 22, color: 'bg-amber-400' },
    { label: 'En livraison', count: 16, percent: 13, color: 'bg-sky-500' },
    { label: 'Annulées', count: 8, percent: 6, color: 'bg-rose-400' },
];

const cashRows = [
    { carrier: 'AMEEX', parcels: 42, delivered: 34, expected: '5 460 DH', received: '4 980 DH', pending: '480 DH', state: 'Rapprochement requis' },
    { carrier: 'Paiement en ligne', parcels: 18, delivered: 18, expected: '3 240 DH', received: '3 240 DH', pending: '0 DH', state: 'Rapproché' },
    { carrier: 'AMEEX', parcels: 27, delivered: 21, expected: '3 150 DH', received: '2 700 DH', pending: '450 DH', state: 'En attente de versement' },
];

function MetricCard({ label, value, note, trend = 'up', icon: Icon }) {
    const positive = trend === 'up';
    return (
        <article className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-[0_2px_10px_rgba(20,20,20,0.025)]">
            <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-stone-500">{label}</p>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-50 text-stone-800">
                    <Icon size={18} strokeWidth={1.8} />
                </span>
            </div>
            <p className="mt-4 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">{value}</p>
            <div className="mt-3 flex items-center gap-1.5 text-xs">
                <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-1 font-semibold ${positive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                    {positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{note}
                </span>
                <span className="text-stone-400">vs période précédente</span>
            </div>
        </article>
    );
}

function RevenueChart({ data }) {
    const width = 720;
    const height = 220;
    const points = data.chart.map((value, index) => {
        const x = 24 + index * ((width - 48) / (data.chart.length - 1));
        const y = height - 24 - (value / 100) * (height - 52);
        return `${x},${y}`;
    }).join(' ');
    const area = `24,${height - 24} ${points} ${width - 24},${height - 24}`;

    return (
        <div className="mt-6">
            <div className="flex items-center justify-between text-xs text-stone-400">
                <span>Revenu (DH)</span>
                <span>Valeurs illustratives</span>
            </div>
            <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Graphique illustratif des revenus" className="mt-2 h-52 w-full overflow-visible">
                {[0, 1, 2, 3].map((line) => {
                    const y = 20 + line * 52;
                    return <line key={line} x1="24" y1={y} x2={width - 24} y2={y} stroke="#eeeae4" strokeDasharray="4 5" />;
                })}
                <polygon points={area} fill="url(#revenueFill)" />
                <defs>
                    <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#9de500" stopOpacity="0.28" />
                        <stop offset="100%" stopColor="#9de500" stopOpacity="0.015" />
                    </linearGradient>
                </defs>
                <polyline points={points} fill="none" stroke="#5d8500" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                {data.chart.map((value, index) => {
                    const x = 24 + index * ((width - 48) / (data.chart.length - 1));
                    const y = height - 24 - (value / 100) * (height - 52);
                    return <circle key={`${value}-${index}`} cx={x} cy={y} r="4" fill="#fff" stroke="#5d8500" strokeWidth="2.5" />;
                })}
            </svg>
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-stone-400">
                {data.labels.map((label) => <span key={label}>{label}</span>)}
            </div>
        </div>
    );
}



function DemoNotice() {
    return (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
            <p><strong>Mode aperçu — données fictives.</strong> Les chiffres affichés servent uniquement à valider l’interface. Ils ne représentent pas les ventes réelles.</p>
        </div>
    );
}

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('sales');
    const [period, setPeriod] = useState('7d');
    const data = mockByPeriod[period];

    return (
        <AdminLayout title="Analytics Dashboard">
            <div className="mx-auto w-full max-w-[1500px] space-y-7 pb-10">
                <DemoNotice />

                <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-lime-700">Vue d’ensemble / Analytics</p>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">Performance du magasin</h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">Comprenez la demande, suivez les ventes et distinguez le chiffre d’affaires du cash réellement rapproché.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <label className="flex h-11 items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 text-sm text-stone-600">
                            <CalendarDays size={16} className="text-stone-400" />
                            <select aria-label="Période" value={period} onChange={(event) => setPeriod(event.target.value)} className="border-0 bg-transparent py-0 pr-7 text-sm font-medium text-stone-800 outline-none focus:ring-0">
                                {periods.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                            </select>
                        </label>
                        <button type="button" onClick={() => window.print()} className="inline-flex h-11 items-center gap-2 rounded-xl bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800">
                            <Download size={16} /> Imprimer / PDF
                        </button>
                    </div>
                </header>

                <nav className="flex w-full gap-1 overflow-x-auto rounded-2xl border border-stone-200 bg-stone-100/80 p-1.5 sm:w-fit" aria-label="Sections analytics">
                    <button type="button" onClick={() => setActiveTab('sales')} className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition ${activeTab === 'sales' ? 'bg-white text-stone-950 shadow-sm' : 'text-stone-500 hover:text-stone-900'}`}>
                        <span className="inline-flex items-center gap-2"><ShoppingBag size={16} /> Ventes & demande</span>
                    </button>
                    <button type="button" onClick={() => setActiveTab('cash')} className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition ${activeTab === 'cash' ? 'bg-white text-stone-950 shadow-sm' : 'text-stone-500 hover:text-stone-900'}`}>
                        <span className="inline-flex items-center gap-2"><Wallet size={16} /> Cash & rapprochement COD</span>
                    </button>
                </nav>

                {activeTab === 'sales' ? (
                    <>
                        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <MetricCard label="Chiffre d’affaires" value={data.revenue} note={data.revenueChange} icon={CircleDollarSign} />
                            <MetricCard label="Commandes créées" value={data.orders} note={data.ordersChange} icon={ShoppingBag} />
                            <MetricCard label="Panier moyen" value={data.average} note={data.averageChange} icon={Banknote} />
                            <MetricCard label="Clients actifs" value={data.customers} note="+6,3%" icon={Users} />
                        </section>

                        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)]">
                            <article className="rounded-2xl border border-stone-200/80 bg-white p-5 sm:p-6">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <h2 className="text-lg font-semibold text-stone-950">Évolution des ventes</h2>
                                        <p className="mt-1 text-sm text-stone-500">Tendance sur la période sélectionnée</p>
                                    </div>
                                    <span className="rounded-lg bg-lime-50 px-3 py-1.5 text-xs font-semibold text-lime-800">+12,8% sur la période</span>
                                </div>
                                <RevenueChart data={data} />
                            </article>

                            <article className="rounded-2xl border border-stone-200/80 bg-white p-5 sm:p-6">
                                <h2 className="text-lg font-semibold text-stone-950">État des commandes</h2>
                                <p className="mt-1 text-sm text-stone-500">Répartition illustrative</p>
                                <div className="mt-6 space-y-4">
                                    {orderStatuses.map((status) => (
                                        <div key={status.label}>
                                            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                                                <span className="text-stone-600">{status.label}</span>
                                                <span className="font-semibold tabular-nums text-stone-900">{status.count} <span className="font-normal text-stone-400">({status.percent}%)</span></span>
                                            </div>
                                            <div className="h-2 overflow-hidden rounded-full bg-stone-100"><div className={`h-full rounded-full ${status.color}`} style={{ width: `${status.percent}%` }} /></div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 rounded-xl bg-stone-50 p-3 text-xs leading-5 text-stone-500">Une commande livrée ne signifie pas nécessairement que le cash COD a déjà été versé.</div>
                            </article>
                        </section>

                        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
                            <article className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white">
                                <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4 sm:px-6">
                                    <div><h2 className="font-semibold text-stone-950">Produits les plus vendus</h2><p className="mt-1 text-sm text-stone-500">Classement fictif par unités vendues</p></div>
                                    <span className="rounded-lg bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-500">Top 3</span>
                                </div>
                                <div className="divide-y divide-stone-100">
                                    {products.map((product, index) => (
                                        <div key={product.name} className="flex items-center gap-4 px-5 py-4 sm:px-6">
                                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-sm font-bold text-stone-500">0{index + 1}</span>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-semibold text-stone-900">{product.name}</p>
                                                <p className="mt-1 text-xs text-stone-400">{product.category} · {product.units} unités</p>
                                                <div className="mt-2 h-1.5 max-w-sm overflow-hidden rounded-full bg-stone-100"><div className="h-full rounded-full bg-lime-500" style={{ width: `${product.share}%` }} /></div>
                                            </div>
                                            <p className="shrink-0 text-sm font-semibold tabular-nums text-stone-900">{product.revenue}</p>
                                        </div>
                                    ))}
                                </div>
                            </article>

                            <article className="rounded-2xl border border-stone-200/80 bg-white p-5 sm:p-6">
                                <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700"><Package size={19} /></span><div><h2 className="font-semibold text-stone-950">À surveiller</h2><p className="mt-1 text-sm text-stone-500">Indicateurs opérationnels</p></div></div>
                                <div className="mt-5 space-y-3">
                                    <div className="flex items-center justify-between rounded-xl border border-stone-100 p-3"><div><p className="text-sm font-medium text-stone-800">Stock faible</p><p className="mt-1 text-xs text-stone-400">Produits sous le seuil</p></div><span className="rounded-lg bg-amber-50 px-2.5 py-1 text-sm font-bold text-amber-800">6</span></div>
                                    <div className="flex items-center justify-between rounded-xl border border-stone-100 p-3"><div><p className="text-sm font-medium text-stone-800">Commandes en attente</p><p className="mt-1 text-xs text-stone-400">À traiter par l’équipe</p></div><span className="rounded-lg bg-sky-50 px-2.5 py-1 text-sm font-bold text-sky-800">28</span></div>
                                    <div className="flex items-center justify-between rounded-xl border border-stone-100 p-3"><div><p className="text-sm font-medium text-stone-800">Taux de livraison</p><p className="mt-1 text-xs text-stone-400">Valeur de démonstration</p></div><span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-sm font-bold text-emerald-800">87%</span></div>
                                </div>
                            </article>
                        </section>
                    </>
                ) : (
                    <>
                        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <MetricCard label="Cash attendu" value="11 610 DH" note="À vérifier" trend="down" icon={Banknote} />
                            <MetricCard label="Cash reçu" value="10 920 DH" note="+5,4%" icon={CheckCircle2} />
                            <MetricCard label="Écart à rapprocher" value="930 DH" note="3 lots à vérifier" trend="down" icon={CircleDollarSign} />
                            <MetricCard label="Colis livrés" value="55" note="+7,1%" icon={Truck} />
                        </section>

                        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.8fr)]">
                            <article className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white">
                                <div className="border-b border-stone-100 px-5 py-4 sm:px-6"><h2 className="font-semibold text-stone-950">Suivi des versements</h2><p className="mt-1 text-sm text-stone-500">Exemple de rapprochement par lot — données fictives</p></div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-[760px] w-full text-left text-sm">
                                        <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-400"><tr><th className="px-5 py-3 font-semibold">Canal</th><th className="px-4 py-3 font-semibold">Colis</th><th className="px-4 py-3 font-semibold">Livrés</th><th className="px-4 py-3 font-semibold">Attendu</th><th className="px-4 py-3 font-semibold">Reçu</th><th className="px-4 py-3 font-semibold">Écart</th><th className="px-5 py-3 font-semibold">État</th></tr></thead>
                                        <tbody className="divide-y divide-stone-100">
                                            {cashRows.map((row, index) => <tr key={`${row.carrier}-${index}`} className="text-stone-600"><td className="px-5 py-4 font-semibold text-stone-900">{row.carrier}</td><td className="px-4 py-4">{row.parcels}</td><td className="px-4 py-4">{row.delivered}</td><td className="px-4 py-4 tabular-nums">{row.expected}</td><td className="px-4 py-4 tabular-nums">{row.received}</td><td className="px-4 py-4 font-semibold tabular-nums text-stone-900">{row.pending}</td><td className="px-5 py-4"><span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${row.pending === '0 DH' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`}>{row.state}</span></td></tr>)}
                                        </tbody>
                                    </table>
                                </div>
                            </article>

                            <article className="rounded-2xl border border-stone-200/80 bg-white p-5 sm:p-6">
                                <h2 className="font-semibold text-stone-950">Règles de lecture</h2><p className="mt-1 text-sm text-stone-500">À conserver dans la version réelle</p>
                                <div className="mt-5 space-y-4">
                                    <div className="flex gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-700"><Truck size={16} /></span><div><p className="text-sm font-semibold text-stone-900">Livraison</p><p className="mt-1 text-xs leading-5 text-stone-500">Le statut livré décrit le colis, pas le versement de l’argent.</p></div></div>
                                    <div className="flex gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700"><Wallet size={16} /></span><div><p className="text-sm font-semibold text-stone-900">Encaissement</p><p className="mt-1 text-xs leading-5 text-stone-500">Le montant encaissé doit provenir d’une preuve ou d’un relevé confirmé.</p></div></div>
                                    <div className="flex gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700"><Clock3 size={16} /></span><div><p className="text-sm font-semibold text-stone-900">Rapprochement</p><p className="mt-1 text-xs leading-5 text-stone-500">Un écart reste à vérifier tant qu’il n’est pas expliqué et confirmé.</p></div></div>
                                </div>
                            </article>
                        </section>
                    </>
                )}

                <footer className="border-t border-stone-200 pt-4 text-xs leading-5 text-stone-400">Prototype d’interface uniquement · aucune donnée réelle utilisée · aucune modification Backend ou base de données incluse.</footer>
            </div>
        </AdminLayout>
    );
}
