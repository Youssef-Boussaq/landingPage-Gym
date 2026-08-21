import React, { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import {
    ShoppingBag,
    CheckCircle2,
    XCircle,
    Truck,
    Package,
    AlertTriangle,
    Bell
} from 'lucide-react';

export default function NotificationItem({ notification, onClose }) {
    const user = usePage().props.auth?.user;
    const [isUnread, setIsUnread] = useState(notification.read_at === null);

    useEffect(() => {
        setIsUnread(notification.read_at === null);
    }, [notification.read_at]);

    const handleOrderClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsUnread(false);

        const orderRoute = user?.role === 'admin'
            ? route('admin.orders.show', { order: notification.order_id })
            : route('orders.show', { order: notification.order_id });

        const readRoute = user?.role === 'admin'
            ? route('admin.notifications.read', notification.id)
            : route('notifications.read', notification.id);

        router.post(
            readRoute,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    router.visit(orderRoute);
                },
            }
        );

        onClose?.();
    };

    const getIcon = (type) => {
        switch (type) {
            case 'order_created':
                return { icon: ShoppingBag, color: 'text-slate-900', bg: 'bg-[var(--color-primary)]' };
            case 'payment_successful':
                return { icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-50' };
            case 'order_confirmed':
                return { icon: CheckCircle2, color: 'text-purple-700', bg: 'bg-purple-50' };
            case 'order_shipped':
                return { icon: Truck, color: 'text-indigo-700', bg: 'bg-indigo-50' };
            case 'order_delivered':
                return { icon: Package, color: 'text-teal-700', bg: 'bg-teal-50' };
            case 'order_cancelled':
                return { icon: XCircle, color: 'text-rose-700', bg: 'bg-rose-50' };
            case 'payment_failed':
                return { icon: AlertTriangle, color: 'text-amber-700', bg: 'bg-amber-50' };
            default:
                return { icon: Bell, color: 'text-slate-700', bg: 'bg-slate-100' };
        }
    };

    const { icon: Icon, color, bg } = getIcon(notification.type);

    const formattedDate = new Date(notification.created_at).toLocaleString('fr-FR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    });

    const itemClasses = isUnread
        ? "relative block w-full px-4 py-4 text-left transition bg-slate-50/80 hover:bg-slate-100/60 border-l-4 border-l-[var(--color-primary)]"
        : "relative block w-full px-4 py-4 text-left transition bg-white hover:bg-slate-50 border-l-4 border-l-transparent";

    return (
        <div className={itemClasses}>
            <div className="flex gap-3">
                {/* Icon */}
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg} ${color}`}>
                    <Icon className="h-5 w-5" />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm flex items-center gap-2 text-slate-900 ${isUnread ? 'font-bold' : 'font-medium'}`}>
                            {notification.title}
                            {isUnread && (
                                <span className="flex h-2 w-2 rounded-full bg-[var(--color-primary)] shrink-0"></span>
                            )}
                        </p>
                        {isUnread && (
                            <span className="text-[10px] font-black text-slate-950 bg-[var(--color-primary)] px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                                Nouveau
                            </span>
                        )}
                    </div>

                    <p className={`mt-1 text-xs leading-relaxed ${isUnread ? 'text-slate-800 font-medium' : 'text-slate-500 font-regular'}`}>
                        {notification.message}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between text-xs">
                        {notification.order_number ? (
                            <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                                {notification.order_number}
                            </span>
                        ) : <span />}
                        <span className="text-slate-400 font-regular">
                            {formattedDate}
                        </span>
                    </div>

                    {notification.order_id && (
                        <div className="mt-3">
                            <button
                                onClick={handleOrderClick}
                                className="inline-flex items-center text-xs font-bold text-slate-900 hover:text-[var(--color-primary-hover)] underline underline-offset-4 transition-colors"
                            >
                                Voir les détails
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}