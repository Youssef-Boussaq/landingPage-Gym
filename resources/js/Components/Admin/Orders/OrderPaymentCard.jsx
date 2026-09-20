import AdminStatusBadge from '@/Components/Admin/AdminStatusBadge';

export default function OrderPaymentCard({ order }) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Paiement</h2>
            <dl className="space-y-3 text-sm">
                <div className="flex justify-between items-center gap-4">
                    <dt className="text-slate-500">Méthode</dt>
                    <dd className="font-semibold uppercase tracking-wider text-slate-700">
                        {order.payment_method}
                    </dd>
                </div>
                <div className="flex justify-between items-center gap-4">
                    <dt className="text-slate-500">Statut</dt>
                    <dd>
                        <AdminStatusBadge status={order.payment_status} label={order.payment_status_label} />
                    </dd>
                </div>
                {order.transaction_id && (
                    <div className="flex justify-between items-center gap-4">
                        <dt className="text-slate-500">Transaction ID</dt>
                        <dd className="max-w-[120px] truncate text-slate-700" title={order.transaction_id}>
                            {order.transaction_id}
                        </dd>
                    </div>
                )}
            </dl>
            
            {order.is_cash && order.payment_status === 'pending' && (
                <div className="mt-4 rounded-xl bg-blue-50 p-3 text-xs text-blue-700">
                    ℹ️ Le paiement est confirmé uniquement après livraison.
                </div>
            )}
        </section>
    );
}
