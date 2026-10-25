import { useState } from 'react';
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
    Megaphone,
    PanelsTopLeft,
    ChevronDown,
    Image,
    UserRound,
    Dumbbell,
    Images,
    Star,
    Layers,
    Mail,
    PanelBottom,
} from 'lucide-react';

const items = [
    {
        label: 'Dashboard',
        href: 'admin.dashboard',
        icon: LayoutDashboard,
    },
    {
        label: 'Orders',
        href: 'admin.orders.index',
        icon: ShoppingBag,
        badge: 'pendingOrdersCount',
    },
    {
        label: 'Products',
        href: 'admin.products.index',
        icon: Package,
        badge: 'lowStockCount',
    },
    {
        label: 'Categories',
        href: 'admin.categories.index',
        icon: FolderTree,
    },
    {
        label: 'Customers',
        href: 'admin.customers.index',
        icon: Users,
    },
    {
        label: 'Notifications',
        href: 'admin.notifications.index',
        icon: Bell,
        badge: 'unreadNotificationsCount',
    },
    {
        label: 'Analytics',
        href: 'admin.dashboard',
        icon: BarChart3,
    },
    {
        label: 'Settings',
        href: 'admin.settings',
        icon: Settings,
    },
    {
        label: 'Store Promotions',
        href: 'admin.store-promotions.index',
        icon: Megaphone,
    },
];

const landingItems = [
    {
        label: 'Hero',
        href: 'admin.hero.edit',
        icon: Image,
    },
    {
        label: 'About Coach',
        href: 'admin.about.edit',
        icon: UserRound,
    },
    {
        label: 'Services',
        href: 'admin.services.index',
        icon: Dumbbell,
    },
    {
        label: 'Transformations',
        href: null,
        icon: Images,
    },
    {
        label: 'Reviews',
        href: 'admin.reviews.index',
        icon: Star,
    },
    {
        label: 'Programs',
        href: 'admin.programs.index',
        icon: Layers,
    },
    {
        label: 'Contact',
        href: null,
        icon: Mail,
    },
    {
        label: 'Footer',
        href: null,
        icon: PanelBottom,
    },
];

export default function AdminSidebar({ onNavigate }) {
    const { adminNav } = usePage().props;

    const currentRoute = route().current();

    const isLandingRoute =
        typeof currentRoute === 'string' && (
            currentRoute.startsWith('admin.hero.') ||
            currentRoute.startsWith('admin.about.') ||
            currentRoute.startsWith('admin.services.') ||
            currentRoute.startsWith('admin.programs.') ||
            currentRoute.startsWith('admin.reviews.')
        );

    const [landingOpen, setLandingOpen] = useState(isLandingRoute);

    return (
        <nav className="flex flex-col gap-1 p-4">
            {items.slice(0, 1).map((item) => {
                const Icon = item.icon;
                const active = route().current(item.href);

                return (
                    <Link
                        key={item.label}
                        href={route(item.href)}
                        onClick={onNavigate}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${active
                                ? 'bg-white/10 text-[var(--color-primary)]'
                                : 'text-slate-300 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <Icon className="h-4 w-4" />
                        {item.label}
                    </Link>
                );
            })}

            <div className="mt-2">
                <button
                    type="button"
                    onClick={() => setLandingOpen((open) => !open)}
                    aria-expanded={landingOpen}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isLandingRoute || landingOpen
                            ? 'bg-white/10 text-[var(--color-primary)]'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                >
                    <span className="inline-flex items-center gap-3">
                        <PanelsTopLeft className="h-4 w-4" />
                        Landing Page
                    </span>

                    <ChevronDown
                        className={`h-4 w-4 transition-transform ${landingOpen ? 'rotate-180' : ''
                            }`}
                    />
                </button>

                {landingOpen && (
                    <div className="ml-4 mt-1 flex flex-col gap-1 border-l border-white/10 pl-3">
                        {landingItems.map((item) => {
                            const Icon = item.icon;
                            const active = item.href
                                ? route().current(item.href)
                                : false;

                            const classes = `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${active
                                    ? 'bg-white/10 font-semibold text-[var(--color-primary)]'
                                    : item.href
                                        ? 'text-slate-300 hover:bg-white/5 hover:text-white'
                                        : 'cursor-not-allowed text-slate-500'
                                }`;

                            if (!item.href) {
                                return (
                                    <div
                                        key={item.label}
                                        title="Page de configuration à créer"
                                        className={classes}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {item.label}
                                    </div>
                                );
                            }

                            return (
                                <Link
                                    key={item.label}
                                    href={route(item.href)}
                                    onClick={onNavigate}
                                    className={classes}
                                >
                                    <Icon className="h-4 w-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            {items.slice(1).map((item) => {
                const Icon = item.icon;

                const active =
                    route().current(item.href) ||
                    (item.href === 'admin.orders.index' &&
                        route().current('admin.orders.*')) ||
                    (item.href === 'admin.products.index' &&
                        route().current('admin.products.*')) ||
                    (item.href === 'admin.customers.index' &&
                        route().current('admin.customers.*'));

                const count = item.badge
                    ? adminNav?.[item.badge]
                    : 0;

                return (
                    <Link
                        key={item.label}
                        href={route(item.href)}
                        onClick={onNavigate}
                        className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition ${active
                                ? 'bg-white/10 text-[var(--color-primary)]'
                                : 'text-slate-300 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <span className="inline-flex items-center gap-3">
                            <Icon className="h-4 w-4" />
                            {item.label}
                        </span>

                        {count > 0 && (
                            <span className="rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-[11px] font-black text-slate-950">
                                {count}
                            </span>
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
