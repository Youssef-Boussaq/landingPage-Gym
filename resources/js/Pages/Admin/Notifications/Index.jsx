import AdminBreadcrumbs from '@/Components/Admin/AdminBreadcrumbs';
import AdminEmptyState from '@/Components/Admin/AdminEmptyState';
import AdminPagination from '@/Components/Admin/AdminPagination';
import AdminLayout from '@/Layouts/AdminLayout';
import NotificationItem from '@/Components/Notification/NotificationItem';
import { router } from '@inertiajs/react';

export default function NotificationsIndex({ notifications, unreadCount }) {
    return (
        <AdminLayout title="Notifications">
            <AdminBreadcrumbs items={[{ label: 'Admin', href: route('admin.dashboard') }, { label: 'Notifications' }]} />
            <div className="flex items-center justify-between">
                <h1 className="font-archivo text-2xl uppercase text-slate-900">Notifications</h1>
                <p className="text-sm text-slate-500">{unreadCount} non lue(s)</p>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {notifications.data.length === 0 ? (
                    <div className="p-6">
                        <AdminEmptyState title="No notifications." />
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {notifications.data.map((notification) => (
                            <div
                                key={notification.id}
                                role="button"
                                tabIndex={0}
                                onClick={() => {
                                    if (!notification.read_at) {
                                        router.post(route('admin.notifications.read', notification.id), {}, {
                                            preserveScroll: true,
                                        });
                                    }
                                }}
                            >
                                <NotificationItem notification={notification} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <AdminPagination links={notifications.links} />
        </AdminLayout>
    );
}
