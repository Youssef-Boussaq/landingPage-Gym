import { useEffect, useState } from 'react';
import { CalendarDays, LoaderCircle, RotateCcw } from 'lucide-react';

const periods = [
    ['today', 'Aujourd’hui'],
    ['yesterday', 'Hier'],
    ['last_7_days', '7 jours'],
    ['last_30_days', '30 jours'],
    ['last_90_days', '90 jours'],
    ['this_month', 'Ce mois'],
    ['last_month', 'Mois dernier'],
    ['custom', 'Personnalisé'],
];

const statusLabels = {
    pending: 'En attente',
    paid: 'Payée',
    confirmed: 'Confirmée',
    processing: 'En préparation',
    shipped: 'Expédiée',
    out_for_delivery: 'En livraison',
    delivered: 'Livrée',
    returned: 'Retournée',
    cancelled: 'Annulée',
};

const paymentLabels = { pending: 'En attente', paid: 'Payé', failed: 'Échoué' };

export default function DashboardFilterBar({ filters, filterOptions, errors = {}, loading, onApply, onReset }) {
    const [customDates, setCustomDates] = useState({
        start_date: filters.start_date,
        end_date: filters.end_date,
    });
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        setCustomDates({ start_date: filters.start_date, end_date: filters.end_date });
    }, [filters.start_date, filters.end_date]);

    const selectClasses = 'min-h-11 w-full rounded-xl border-stone-200 bg-white text-sm text-stone-800 shadow-sm focus:border-lime-600 focus:ring-lime-600';
    const activeFilters = [filters.status, filters.payment_status, filters.category_id].filter(Boolean).length;
    const generalError = Object.entries(errors).find(([field]) => !['start_date', 'end_date'].includes(field))?.[1];

    return (
        <section aria-label="Filtres des analytics" className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <CalendarDays aria-hidden="true" className="h-4 w-4 text-stone-500" />
                    <h2 className="text-sm font-semibold text-stone-900">Période et filtres</h2>
                    {activeFilters > 0 && <span className="rounded-full bg-lime-100 px-2 py-0.5 text-xs font-semibold text-lime-900">{activeFilters} actif(s)</span>}
                </div>
                <div className="flex items-center gap-3">
                    {loading && <span role="status" className="inline-flex items-center gap-2 text-xs font-medium text-stone-500"><LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" /> Mise à jour…</span>}
                    <button type="button" onClick={() => setMobileOpen((open) => !open)} aria-expanded={mobileOpen} className="rounded-lg px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-600 sm:hidden">
                        {mobileOpen ? 'Masquer' : 'Afficher'}
                    </button>
                </div>
            </div>

            <div className={`${mobileOpen ? 'block' : 'hidden'} mt-4 space-y-4 sm:block`}>
                <div className="flex flex-wrap gap-2" aria-label="Périodes rapides">
                    {periods.map(([period, label]) => (
                        <button
                            key={period}
                            type="button"
                            onClick={() => onApply({ period })}
                            aria-pressed={filters.period === period}
                            className={`rounded-lg border px-3 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-600 ${filters.period === period ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {filters.period === 'custom' && (
                    <div className="grid gap-3 rounded-xl bg-stone-50 p-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                        <label className="text-xs font-semibold text-stone-600">
                            Du
                            <input type="date" value={customDates.start_date || ''} max={customDates.end_date || undefined} onChange={(event) => setCustomDates((dates) => ({ ...dates, start_date: event.target.value }))} className={`${selectClasses} mt-1`} />
                        </label>
                        <label className="text-xs font-semibold text-stone-600">
                            Au
                            <input type="date" value={customDates.end_date || ''} min={customDates.start_date || undefined} onChange={(event) => setCustomDates((dates) => ({ ...dates, end_date: event.target.value }))} className={`${selectClasses} mt-1`} />
                        </label>
                        <button type="button" disabled={!customDates.start_date || !customDates.end_date || loading} onClick={() => onApply({ period: 'custom', ...customDates })} className="min-h-11 rounded-xl bg-lime-600 px-4 text-sm font-semibold text-white hover:bg-lime-700 disabled:cursor-not-allowed disabled:opacity-50">
                            Appliquer
                        </button>
                        {(errors.start_date || errors.end_date) && <p role="alert" className="text-xs font-medium text-rose-700 sm:col-span-3">{errors.start_date || errors.end_date}</p>}
                    </div>
                )}

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_auto]">
                    <label className="text-xs font-semibold text-stone-600">
                        Statut de commande
                        <select value={filters.status} onChange={(event) => onApply({ status: event.target.value })} className={`${selectClasses} mt-1`}>
                            <option value="">Tous les statuts</option>
                            {filterOptions.statuses.map((status) => <option key={status} value={status}>{statusLabels[status] || status}</option>)}
                        </select>
                    </label>
                    <label className="text-xs font-semibold text-stone-600">
                        Paiement
                        <select value={filters.payment_status} onChange={(event) => onApply({ payment_status: event.target.value })} className={`${selectClasses} mt-1`}>
                            <option value="">Tous les paiements</option>
                            {filterOptions.paymentStatuses.map((status) => <option key={status} value={status}>{paymentLabels[status] || status}</option>)}
                        </select>
                    </label>
                    <label className="text-xs font-semibold text-stone-600">
                        Catégorie
                        <select value={filters.category_id} onChange={(event) => onApply({ category_id: event.target.value })} className={`${selectClasses} mt-1`}>
                            <option value="">Toutes les catégories</option>
                            {filterOptions.categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                        </select>
                    </label>
                    <button type="button" onClick={onReset} disabled={loading} className="inline-flex min-h-11 items-center justify-center gap-2 self-end rounded-xl border border-stone-200 px-4 text-sm font-semibold text-stone-600 hover:bg-stone-50 disabled:opacity-50">
                        <RotateCcw aria-hidden="true" className="h-4 w-4" /> Réinitialiser
                    </button>
                </div>

                <p className="text-xs text-stone-500">
                    {filters.start_date} – {filters.end_date}. Les comparaisons utilisent la période précédente de même durée.
                </p>
                {generalError && <p role="alert" className="text-xs font-medium text-rose-700">{generalError}</p>}
            </div>
        </section>
    );
}
