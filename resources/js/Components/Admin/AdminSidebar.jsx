import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    FolderTree,
    Users,
    Bell,
    BarChart3,
    Settings,
} from 'lucide-react';

const items = [
    { label: 'Dashboard', href: 'admin.dashboard', icon: LayoutDashboard },
    { label: 'Orders', href: 'admin.orders.index', icon: ShoppingBag, badge: 'pendingOrdersCount' },
    { label: 'Products', href: 'admin.products.index', icon: Package, badge: 'lowStockCount' },
    { label: 'Categories', href: 'admin.categories.index', icon: FolderTree },
    { label: 'Customers', href: 'admin.customers.index', icon: Users },
    { label: 'Notifications', href: 'admin.notifications.index', icon: Bell, badge: 'unreadNotificationsCount' },
    { label: 'Analytics', href: 'admin.dashboard', icon: BarChart3 },
    { label: 'Settings', href: 'admin.settings', icon: Settings },
];

export default function AdminSidebar({ onNavigate }) {
    const { adminNav } = usePage().props;

    return (
        <nav className="flex flex-col gap-1 p-4">
            {items.map((item) => {
                const Icon = item.icon;
                const active = route().current(item.href) || (
                    item.href === 'admin.orders.index' && route().current('admin.orders.*')
                ) || (
                    item.href === 'admin.products.index' && route().current('admin.products.*')
                ) || (
                    item.href === 'admin.customers.index' && route().current('admin.customers.*')
                );

                const count = item.badge ? adminNav?.[item.badge] : 0;

                return (
                    <Link
                        key={item.label}
                        href={route(item.href)}
                        onClick={onNavigate}
                        className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                            active
                                ? 'bg-white/10 text-[#9de500]'
                                : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        <span className="inline-flex items-center gap-3">
                            <Icon className="h-4 w-4" />
                            {item.label}
                        </span>
                        {count > 0 && (
                            <span className="rounded-full bg-[#9de500] px-2 py-0.5 text-[11px] font-black text-slate-950">
                                {count}
                            </span>
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
