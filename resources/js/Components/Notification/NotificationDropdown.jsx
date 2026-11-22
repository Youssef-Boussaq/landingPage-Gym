import React from 'react';
import { Bell } from 'lucide-react';
import NotificationItem from './NotificationItem';

export default function NotificationDropdown({ notifications, onClose }) {
    const unreadCount = notifications.filter((n) => n.read_at === null).length;

    return (
        <div className="font-favorit absolute -right-10 sm:right-0 top-full z-[9999] mt-2 w-[360px] max-w-[calc(100vw-1.5rem)] overflow-hidden border border-black bg-white shadow-[0_20px_50px_rgba(0,0,0,0.25)] rounded-none opacity-100">
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-black bg-white px-4 py-3">
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-[0.05em] text-black">
                        Notifications
                    </h3>
                    <p className="mt-0.5 text-[11px] text-[#666666] tracking-[0.025em]">
                        {notifications.length} notification{notifications.length > 1 ? 's' : ''}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            import('@inertiajs/react').then(({ router }) => {
                                router.post(
                                    route('notifications.read-all'),
                                    {},
                                    { preserveScroll: true }
                                );
                            });
                        }}
                        className="text-[11px] font-bold uppercase tracking-[0.025em] text-black hover:underline"
                    >
                        Tout marquer comme lu
                    </button>
                )}
            </div>

            {/* LIST */}
            <div className="max-h-[420px] overflow-y-auto divide-y divide-[#e5e7eb] bg-white">
                {notifications.length === 0 ? (
                    <div className="px-4 py-10 text-center bg-white">
                        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#f0efe7] text-black">
                            <Bell className="h-5 w-5" />
                        </div>
                        <p className="text-xs font-bold uppercase tracking-[0.025em] text-black">
                            Aucune notification
                        </p>
                        <p className="mt-1 text-[11px] text-[#666666]">
                            Vous êtes à jour.
                        </p>
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
