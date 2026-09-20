import { formatMoney } from '@/helpers/format';

export default function OrderItems({ items }) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Articles</h2>
            </div>
            
            <div className="divide-y divide-slate-100">
                {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-5">
                        <img
                            src={item.product.image || '/images/placeholder.png'}
                            alt={item.product.title}
                            className="h-16 w-16 rounded-xl object-cover border border-slate-100"
                        />
                        <div className="min-w-0 flex-1">
                            <p className="truncate font-bold text-slate-900">{item.product.title}</p>
                            <p className="mt-1 text-sm text-slate-500">
                                {item.quantity} × {formatMoney(item.unit_price)}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-slate-900">{formatMoney(item.subtotal)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
