import React from 'react';
import { Bell } from 'lucide-react';
import NotificationItem from './NotificationItem';

export default function NotificationDropdown({ notifications, onClose }) {
    const unreadCount = notifications.filter(n => n.read_at === null).length;

    return (
        <div className="font-inter absolute right-0 z-50 mt-3 w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 bg-slate-50/50">
                <div>
                    <h3 className="font-archivo text-sm uppercase tracking-wide text-slate-900">Notifications</h3>
                    <p className="mt-0.5 text-xs text-slate-500 font-regular">
                        {notifications.length} notification{notifications.length > 1 ? 's' : ''}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            import('@inertiajs/react').then(({ router }) => {
                                router.post(route('notifications.read-all'), {}, { preserveScroll: true });
                            });
                        }}
                        className="text-xs font-semibold text-slate-700 hover:text-slate-900 hover:underline transition-colors"
                    >
                        Tout marquer comme lu
                    </button>
                )}
            </div>

            {/* LIST */}
            <div className="max-h-[420px] overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                    <div className="px-4 py-10 text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                            <Bell className="h-5 w-5" />
                        </div>
                        <p className="text-sm font-semibold text-slate-700">Aucune notification</p>
                        <p className="mt-1 text-xs text-slate-400">Vous êtes à jour.</p>
                    </div>
                ) : (
                    notifications.map((notification, index) => (
                        <NotificationItem
                            key={notification.id ?? `notification-${index}`}
                            notification={notification}
                            onClose={onClose}
                        />
                    ))
                )}
            </div>
        </div>
    );
}