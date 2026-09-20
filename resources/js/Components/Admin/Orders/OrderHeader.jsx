import { formatDate } from '@/helpers/format';
import AdminStatusBadge from '@/Components/Admin/AdminStatusBadge';

export default function OrderHeader({ order }) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
                <h1 className="font-archivo text-2xl uppercase text-slate-900">Commande #{order.order_number}</h1>
                <p className="mt-1 text-sm text-slate-500">{formatDate(order.created_at)}</p>
                <div className="mt-3 flex gap-2">
                    <AdminStatusBadge status={order.payment_status} label={order.payment_status_label} />
                    <AdminStatusBadge status={order.status} label={order.status_label} />
                </div>
            </div>
            <div className="flex gap-2 print:hidden">
                {order.customer.phone && (
                    <a
                        href={`https://wa.me/${order.customer.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl bg-[#25D366] px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-[#20bd5a]"
                    >
                        WhatsApp
                    </a>
                )}
                <button
                    onClick={handlePrint}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50"
                >
                    Imprimer
                </button>
            </div>
        </div>
    );
}
