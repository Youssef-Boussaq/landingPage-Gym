export default function OrderShippingCard({ shipping }) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Expédition</h2>
            <div className="text-sm text-slate-700 space-y-1">
                <p className="font-medium text-slate-900">{shipping.address || '—'}</p>
                <p>{shipping.city}</p>
                {shipping.postal_code && <p>{shipping.postal_code}</p>}
            </div>
        </section>
    );
}
