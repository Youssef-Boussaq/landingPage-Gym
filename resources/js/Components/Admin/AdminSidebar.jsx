import { Link, usePage } from '@inertiajs/react';
import {
    Bell,
    ChevronDown,
    Dumbbell,
    FolderTree,
    Image,
    Images,
    LayoutDashboard,
    Megaphone,
    MessageSquareQuote,
    Package,
    PanelsTopLeft,
    Settings,
    ShoppingBag,
    Star,
    UserRound,
    Users,
    X,
} from 'lucide-react';
import { useState } from 'react';

const sections = [
    {
        label: 'Overview',
        items: [{ label: 'Dashboard', href: 'admin.dashboard', icon: LayoutDashboard }],
    },
    {
        label: 'Commerce',
        items: [
            { label: 'Orders', href: 'admin.orders.index', icon: ShoppingBag, badge: 'pendingOrdersCount', match: 'admin.orders.*' },
            { label: 'Products', href: 'admin.products.index', icon: Package, badge: 'lowStockCount', match: 'admin.products.*' },
            { label: 'Product Reviews', href: 'admin.product-reviews.index', icon: MessageSquareQuote, badge: 'pendingProductReviewsCount', match: 'admin.product-reviews.*' },
            { label: 'Categories', href: 'admin.categories.index', icon: FolderTree, match: 'admin.categories.*' },
            { label: 'Customers', href: 'admin.customers.index', icon: Users, match: 'admin.customers.*' },
        ],
    },
    {
        label: 'Marketing',
        items: [
            { label: 'Promotions', href: 'admin.store-promotions.index', icon: Megaphone, match: 'admin.store-promotions.*' },
            { label: 'Notifications', href: 'admin.notifications.index', icon: Bell, badge: 'unreadNotificationsCount', match: 'admin.notifications.*' },
        ],
    },
    {
        label: 'Website',
        items: [
            { label: 'Hero', href: 'admin.hero.edit', icon: Image, match: 'admin.hero.*' },
            { label: 'About', href: 'admin.about.edit', icon: UserRound, match: 'admin.about.*' },
            { label: 'Services', href: 'admin.services.index', icon: Dumbbell, match: 'admin.services.*' },
            { label: 'Programs', href: 'admin.programs.index', icon: PanelsTopLeft, match: 'admin.programs.*' },
            { label: 'Reviews', href: 'admin.reviews.index', icon: Star, match: 'admin.reviews.*' },
            { label: 'Transformations', href: 'admin.transformations.index', icon: Images, match: 'admin.transformations.*' },
        ],
    },
    {
        label: 'System',
        items: [{ label: 'Settings', href: 'admin.settings', icon: Settings, match: 'admin.settings*' }],
    },
];

export default function AdminSidebar({ onNavigate, onClose, mobile = false }) {
    const { adminNav } = usePage().props;
    const [websiteOpen, setWebsiteOpen] = useState(
        sections[3].items.some((item) => route().current(item.match)) ||
            sections[2].items.some((item) => route().current(item.match)),
    );

    const renderLink = (item) => {
        const Icon = item.icon;
        const active = route().current(item.match || item.href);
        const count = item.badge ? Number(adminNav?.[item.badge] || 0) : 0;

        return (
            <Link
                key={item.label}
                href={route(item.href)}
                onClick={onNavigate}
                aria-current={active ? 'page' : undefined}
                className={`flex min-h-10 items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${active
                    ? 'bg-white/10 text-[var(--color-primary)]'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
            >
                <span className="inline-flex items-center gap-3">
                    <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                    {item.label}
                </span>
                {count > 0 && (
                    <span className="rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-[11px] font-bold text-slate-950">
                        {count}
                    </span>
                )}
            </Link>
        );
    };

    return (
        <nav aria-label="Admin navigation" className="flex h-full flex-col gap-5 overflow-y-auto px-3 pb-5">
            {mobile && (
                <div className="flex items-center justify-between px-2 pt-2">
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">Menu</span>
                    <button type="button" onClick={onClose} aria-label="Fermer le menu" className="rounded-lg p-2 text-slate-300 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]">
                        <X aria-hidden="true" className="h-5 w-5" />
                    </button>
                </div>
            )}
            {sections.map((section) => {
                const isWebsite = section.label === 'Website';
                const expanded = !isWebsite || websiteOpen;

                return (
                    <section key={section.label} aria-label={section.label}>
                        {isWebsite ? (
                            <button
                                type="button"
                                onClick={() => setWebsiteOpen((open) => !open)}
                                aria-expanded={websiteOpen}
                                className="mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                            >
                                Website
                                <ChevronDown aria-hidden="true" className={`h-4 w-4 transition-transform ${websiteOpen ? 'rotate-180' : ''}`} />
                            </button>
                        ) : (
                            <h2 className="mb-1 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500">{section.label}</h2>
                        )}
                        {expanded && <div className="space-y-1">{section.items.map(renderLink)}</div>}
                    </section>
                );
            })}
        </nav>
    );
}
