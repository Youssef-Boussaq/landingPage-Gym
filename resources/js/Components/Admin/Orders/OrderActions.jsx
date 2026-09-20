import { useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';

const ACTION_LABELS = {
    'confirmed': 'Confirmer la commande',
    'processing': 'Mettre en préparation',
    'shipped': 'Marquer comme expédiée',
    'out_for_delivery': 'Passer en livraison',
    'delivered': '✓ Livraison réussie',
    'returned': '↩ Retour / Refus',
    'cancelled': 'Annuler la commande'
};

const ACTION_STYLES = {
    'delivered': 'bg-[#9de500] text-slate-900 hover:bg-[#8cd400]',
    'returned': 'bg-rose-100 text-rose-700 hover:bg-rose-200',
    'cancelled': 'bg-rose-50 text-rose-600 hover:bg-rose-100',
    'default': 'bg-slate-900 text-white hover:bg-slate-800'
};

export default function OrderActions({ order }) {
    const form = useForm({ status: '' });
    
    // We filter out CANCELLED from primary action buttons unless it's pending/confirmed.
    // Usually cancelling is a secondary action or done from a dropdown.
    // For simplicity, we'll list them as buttons if allowed.
    
    if (!order.allowed_statuses || order.allowed_statuses.length === 0) {
        return null;
    }

    const submitStatus = (status) => {
        form.setData('status', status);
        form.patch(route('admin.orders.status', order.id), {
            preserveScroll: true,
        });
    };

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm print:hidden">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Actions de la commande</h2>
            
            <div className="flex flex-wrap gap-3">
                {order.allowed_statuses.map((status) => {
                    const label = ACTION_LABELS[status] || `Passer à ${status}`;
                    const style = ACTION_STYLES[status] || ACTION_STYLES.default;
                    const isProcessing = form.processing && form.data.status === status;
                    
                    return (
                        <button
                            key={status}
                            onClick={() => submitStatus(status)}
                            disabled={form.processing}
                            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold shadow-sm transition-colors ${style} disabled:opacity-50`}
                        >
                            {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
                            {label}
                        </button>
                    );
                })}
            </div>
            
            {form.errors.status && (
                <p className="mt-3 text-sm text-rose-600 font-medium">{form.errors.status}</p>
            )}
        </section>
    );
}
