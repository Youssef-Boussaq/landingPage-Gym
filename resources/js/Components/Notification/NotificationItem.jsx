import React from 'react';
import { Link } from '@inertiajs/react';
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
    // Helper to pick the right icon and color
    const getIcon = (type) => {
        switch (type) {
            case 'order_created':
                return { icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' };
            case 'payment_successful':
                return { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' };
            case 'order_confirmed':
                return { icon: CheckCircle2, color: 'text-purple-600', bg: 'bg-purple-50' };
            case 'order_shipped':
                return { icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-50' };
            case 'order_delivered':
                return { icon: Package, color: 'text-teal-600', bg: 'bg-teal-50' };
            case 'order_cancelled':
                return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' };
            case 'payment_failed':
                return { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' };
            default:
                return { icon: Bell, color: 'text-slate-600', bg: 'bg-slate-50' };
        }
    };

    const { icon: Icon, color, bg } = getIcon(notification.type);

    const formattedDate = new Date(notification.created_at).toLocaleString('fr-FR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    });

    const content = (
        <div className="flex gap-3">
            {/* Icon */}
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${bg} ${color}`}>
                <Icon className="h-5 w-5" />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900">
                        {notification.title}
                    </p>
                </div>

                <p className="mt-1 text-sm leading-5 text-slate-600">
                    {notification.message}
                </p>

                <div className="mt-2 flex items-center justify-between">
                    {notification.order_number && (
                        <span className="text-xs font-medium text-slate-500">
                            {notification.order_number}
                        </span>
                    )}
                    <span className="text-xs text-slate-400">
                        {formattedDate}
                    </span>
                </div>
            </div>
        </div>
    );

    const itemClasses = "block w-full border-b border-slate-100 px-4 py-4 text-left transition hover:bg-slate-50";

    // If we have an order ID, wrap in Link
    if (notification.order_id) {
        return (
            <Link 
                href={route('orders.show', notification.order_id)}
                className={itemClasses}
                onClick={onClose}
            >
                {content}
            </Link>
        );
    }

    return (
        <div className={itemClasses}>
            {content}
        </div>
    );
}
