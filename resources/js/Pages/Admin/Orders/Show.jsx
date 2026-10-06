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
import OrderAmeexCard from '@/Components/Admin/Orders/OrderAmeexCard';

export default function OrderShow({ order }) {
    return (
        <AdminLayout title={`Commande ${order.order_number}`}>
            <div className="min-h-screen bg-[#f6f8f2]">
                <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">

                    {/* Breadcrumb */}
                    <div className="mb-5">
                        <AdminBreadcrumbs
                            items={[
                                {
                                    label: 'Admin',
                                    href: route('admin.dashboard'),
                                },
                                {
                                    label: 'Commandes',
                                    href: route('admin.orders.index'),
                                },
                                {
                                    label: order.order_number,
                                },
                            ]}
                        />
                    </div>

                    {/* Header */}
                    <div className="mb-6">
                        <OrderHeader order={order} />
                    </div>

                    {/* Status */}
                    <div className="mb-6">
                        <OrderStatusStepper status={order.status} />
                    </div>

                    {/* Main layout */}
                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">

                        {/* LEFT */}
                        <div className="min-w-0 space-y-6">

                            {/* Customer / Shipping / Payment */}
                            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                <OrderCustomerCard
                                    customer={order.customer}
                                />

                                <OrderShippingCard
                                    shipping={order.shipping}
                                />

                                <OrderPaymentCard
                                    order={order}
                                />
                            </div>

                            {/* WhatsApp */}
                            <OrderWhatsApp order={order} />

                            {/* Items */}
                            <OrderItems
                                items={order.items}
                            />

                            {/* Timeline */}
                            <section
                                className="
                                    overflow-hidden
                                    rounded-3xl
                                    border border-black/[0.07]
                                    bg-white
                                    shadow-[0_12px_40px_rgba(11,12,14,0.05)]
                                "
                            >
                                <div
                                    className="
                                        flex items-center justify-between
                                        border-b border-black/[0.06]
                                        px-6 py-5
                                    "
                                >
                                    <div>
                                        <h2
                                            className="
                                                font-archivo
                                                text-sm
                                                uppercase
                                                tracking-wide
                                                text-[var(--color-black)]
                                            "
                                        >
                                            Historique
                                        </h2>

                                        <p className="mt-1 text-xs text-[#697263]">
                                            Évolution de la commande
                                        </p>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <AdminOrderTimeline
                                        events={order.timeline}
                                    />
                                </div>
                            </section>
                        </div>

                        {/* RIGHT SIDEBAR */}
                        <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">

                            <div className="space-y-6">
                                <OrderSummary summary={order.summary} />

                                <OrderActions order={order} />

                                {/* Attribution */}
                            </div>

                            {/* AMEEX */}
                            <div className="mb-6">
                                <OrderAmeexCard shipment={order.ameex_shipment} />
                            </div>

                            {/* Attribution */}
                            {order.attribution && (
                                <section
                                    className="
                                        rounded-3xl
                                        border border-black/[0.07]
                                        bg-white
                                        p-5
                                        shadow-[0_12px_40px_rgba(11,12,14,0.05)]
                                    "
                                >
                                    <div className="mb-4">
                                        <h2
                                            className="
                                                font-archivo
                                                text-sm
                                                uppercase
                                                tracking-wide
                                                text-[var(--color-black)]
                                            "
                                        >
                                            Attribution
                                        </h2>

                                        <p className="mt-1 text-xs text-[#697263]">
                                            Informations internes
                                        </p>
                                    </div>

                                    <dl className="space-y-2">
                                        {Object.entries(
                                            order.attribution
                                        ).map(([key, value]) => (
                                            <div
                                                key={key}
                                                className="
                                                    flex
                                                    items-center
                                                    justify-between
                                                    gap-4
                                                    rounded-xl
                                                    bg-[#f7f9f3]
                                                    px-3
                                                    py-2.5
                                                "
                                            >
                                                <dt className="text-xs text-[#697263]">
                                                    {key}
                                                </dt>

                                                <dd
                                                    className="
                                                        max-w-[170px]
                                                        truncate
                                                        text-xs
                                                        font-bold
                                                        text-[var(--color-black)]
                                                    "
                                                >
                                                    {value || '—'}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                </section>
                            )}
                        </aside>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}