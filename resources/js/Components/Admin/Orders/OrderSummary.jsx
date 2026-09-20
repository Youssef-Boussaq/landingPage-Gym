import { formatMoney } from '@/helpers/format';

export default function OrderSummary({ summary }) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Résumé</h2>
            <dl className="space-y-3 text-sm">
                <div className="flex justify-between items-center text-slate-600">
                    <dt>Sous-total</dt>
                    <dd className="font-medium">{formatMoney(summary.subtotal)}</dd>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                    <dt>Frais de livraison</dt>
                    <dd className="font-medium">
                        {summary.shipping_fee > 0 ? formatMoney(summary.shipping_fee) : 'Gratuit'}
                    </dd>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-base">
                    <dt className="font-bold text-slate-900">Total</dt>
                    <dd className="font-black text-slate-900">{formatMoney(summary.total)}</dd>
                </div>
            </dl>
        </section>
    );
}
