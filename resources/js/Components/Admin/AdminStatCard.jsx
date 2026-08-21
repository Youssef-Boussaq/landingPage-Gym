export default function AdminStatCard({ label, value, icon: Icon, hint }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {label}
                    </p>
                    <p className="mt-2 text-2xl font-black text-slate-900">{value}</p>
                    {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
                </div>
                {Icon && (
                    <div className="rounded-xl bg-slate-900 p-2 text-[#9de500]">
                        <Icon className="h-5 w-5" />
                    </div>
                )}
            </div>
        </div>
    );
}
