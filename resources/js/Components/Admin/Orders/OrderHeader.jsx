import { MessageCircle, Printer } from 'lucide-react';
import { formatDate } from '@/helpers/format';
import AdminStatusBadge from '@/Components/Admin/AdminStatusBadge';

export default function OrderHeader({ order }) {
    const handlePrint = () => {
        window.print();
    };

    const whatsappUrl = order.customer?.phone
        ? `https://wa.me/${order.customer.phone.replace(/[^0-9]/g, '')}`
        : null;

    return (
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            {/* Order information */}
            <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                    <h1 className="font-archivo text-2xl uppercase tracking-tight text-[var(--color-black)] sm:text-3xl">
                        Commande #{order.order_number}
                    </h1>
                </div>

                <p className="mt-1 text-sm text-[#596254]">
                    {formatDate(order.created_at)}
                </p>

                {/* Statuses */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                    <AdminStatusBadge
                        status={order.payment_status}
                        label={order.payment_status_label}
                    />

                    <AdminStatusBadge
                        status={order.status}
                        label={order.status_label}
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 print:hidden">
                {whatsappUrl && (
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="
                            inline-flex items-center gap-2
                            rounded-xl
                            border border-[#25D366]/20
                            bg-[#25D366]/10
                            px-4 py-2.5
                            text-sm font-bold
                            text-[#128C4A]
                            shadow-sm
                            transition-all duration-200
                            hover:-translate-y-0.5
                            hover:bg-[#25D366]/15
                            hover:shadow-md
                        "
                    >
                        <MessageCircle size={17} strokeWidth={2.2} />
                        <span>WhatsApp</span>
                    </a>
                )}

                <button
                    type="button"
                    onClick={handlePrint}
                    className="
                        inline-flex items-center gap-2
                        rounded-xl
                        border border-black/10
                        bg-white
                        px-4 py-2.5
                        text-sm font-bold
                        text-[var(--color-black)]
                        shadow-sm
                        transition-all duration-200
                        hover:-translate-y-0.5
                        hover:border-[var(--color-primary-dark)]/40
                        hover:bg-[#f5f7f1]
                        hover:shadow-md
                    "
                >
                    <Printer size={17} strokeWidth={2.2} />
                    <span>Imprimer</span>
                </button>
            </div>
        </div>
    );
}