import AdminLayout from '@/Layouts/AdminLayout';
import AdminBreadcrumbs from '@/Components/Admin/AdminBreadcrumbs';
import AdminOrderTimeline from '@/Components/Admin/AdminOrderTimeline';

import OrderHeader from '@/Components/Admin/Orders/OrderHeader';
import OrderCustomerCard from '@/Components/Admin/Orders/OrderCustomerCard';
import OrderShippingCard from '@/Components/Admin/Orders/OrderShippingCard';
import OrderPaymentCard from '@/Components/Admin/Orders/OrderPaymentCard';
import OrderItems from '@/Components/Admin/Orders/OrderItems';
import OrderSummary from '@/Components/Admin/Orders/OrderSummary';
import OrderStatusStepper from '@/Components/Admin/Orders/OrderStatusStepper';
import OrderActions from '@/Components/Admin/Orders/OrderActions';
import OrderWhatsApp from '@/Components/Admin/Orders/OrderWhatsApp';

export default function OrderShow({ order }) {
    return (
        <AdminLayout title={`Commande ${order.order_number}`}>
            <div className="print:hidden">
                <AdminBreadcrumbs
                    items={[
                        { label: 'Admin', href: route('admin.dashboard') },
                        { label: 'Commandes', href: route('admin.orders.index') },
                        { label: `Détails de la commande` },
                    ]}
                />
            </div>

            <div className="mt-4 mb-8">
                <OrderHeader order={order} />
            </div>

            <div className="grid gap-6 xl:grid-cols-3 mb-6">
                <OrderCustomerCard customer={order.customer} />
                <OrderShippingCard shipping={order.shipping} />
                <OrderPaymentCard order={order} />
            </div>

            <div className="mb-6">
                <OrderStatusStepper status={order.status} />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <OrderWhatsApp order={order} />
                    <OrderItems items={order.items} />
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm print:hidden">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Timeline</h2>
                        <AdminOrderTimeline events={order.timeline} />
                    </div>
                </div>

                <div className="space-y-6">
                    <OrderSummary summary={order.summary} />
                    <OrderActions order={order} />
                    
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm print:hidden">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Attribution</h2>
                        {order.attribution ? (
                            <dl className="space-y-2 text-sm">
                                {Object.entries(order.attribution).map(([key, value]) => (
                                    <div key={key} className="flex justify-between gap-4">
                                        <dt className="text-slate-500">{key}</dt>
                                        <dd className="max-w-[150px] truncate">{value || '—'}</dd>
                                    </div>
                                ))}
                            </dl>
                        ) : (
                            <p className="text-sm text-slate-500">Aucune donnée d’attribution.</p>
                        )}
                    </section>
                </div>
            </div>
            
            {/* Print-only CSS to ensure things fit properly */}
            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    @page { margin: 1cm; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    main { padding: 0 !important; background: white !important; }
                    .xl\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
                    .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
                    .lg\\:col-span-2 { grid-column: span 2 / span 2 !important; }
                }
            `}} />
        </AdminLayout>
    );
}
