const styles = {
    pending: 'bg-amber-50 text-amber-800 border-amber-200',
    paid: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    confirmed: 'bg-lime-50 text-lime-800 border-lime-200',
    shipped: 'bg-sky-50 text-sky-800 border-sky-200',
    delivered: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    cancelled: 'bg-rose-50 text-rose-800 border-rose-200',
    failed: 'bg-rose-50 text-rose-800 border-rose-200',
    active: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    inactive: 'bg-slate-100 text-slate-600 border-slate-200',
};

export default function AdminStatusBadge({ status, label }) {
    const key = String(status || '').toLowerCase();
    const className = styles[key] ?? 'bg-slate-100 text-slate-700 border-slate-200';

    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${className}`}>
            {label || status || '—'}
        </span>
    );
}
