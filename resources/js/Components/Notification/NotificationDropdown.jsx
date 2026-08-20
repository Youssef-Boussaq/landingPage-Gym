import React from 'react';
import { Bell } from 'lucide-react';
import NotificationItem from './NotificationItem';

export default function NotificationDropdown({ notifications, onClose }) {
    return (
        <div className="absolute right-0 z-50 mt-3 w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
                    {notifications.length > 0 ? (
                        <p className="mt-0.5 text-xs text-slate-500">
                            {notifications.length} notification{notifications.length > 1 ? 's' : ''}
                        </p>
                    ) : (
                        <p className="mt-0.5 text-xs text-slate-400">Vous êtes à jour</p>
                    )}
                </div>
            </div>

            {/* LIST */}
            <div className="max-h-[420px] overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="px-4 py-10 text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
                            <Bell className="h-5 w-5 text-slate-400" />
                        </div>
                        <p className="text-sm font-medium text-slate-700">Aucune notification</p>
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
