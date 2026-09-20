export default function OrderCustomerCard({ customer }) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Client</h2>
            <div className="space-y-3">
                <p className="font-semibold text-slate-900 text-lg">{customer.name}</p>
                <div className="space-y-1 text-sm text-slate-600">
                    {customer.phone && <p>📞 <a href={`tel:${customer.phone}`} className="hover:underline">{customer.phone}</a></p>}
                    <p>✉️ <a href={`mailto:${customer.email}`} className="hover:underline">{customer.email}</a></p>
                    <p className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100">
                        <span className="text-slate-400">👤</span>
                        <span className="font-medium">{customer.type_label}</span>
                    </p>
                </div>
            </div>
        </section>
    );
}
