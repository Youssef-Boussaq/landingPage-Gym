import { Link, usePage } from '@inertiajs/react';
import {
    Bell,
    ChevronDown,
    Dumbbell,
    ExternalLink,
    FolderTree,
    Image,
    Images,
    LayoutDashboard,
    LogOut,
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
        label: "Vue d'ensemble",
        items: [{ label: 'Tableau de bord', href: 'admin.dashboard', icon: LayoutDashboard }],
    },
    {
        label: 'E-Commerce',
        items: [
            { label: 'Commandes', href: 'admin.orders.index', icon: ShoppingBag, badge: 'pendingOrdersCount', match: 'admin.orders.*' },
            { label: 'Produits', href: 'admin.products.index', icon: Package, badge: 'lowStockCount', match: 'admin.products.*' },
            { label: 'Avis Produits', href: 'admin.product-reviews.index', icon: MessageSquareQuote, badge: 'pendingProductReviewsCount', match: 'admin.product-reviews.*' },
            { label: 'Catégories', href: 'admin.categories.index', icon: FolderTree, match: 'admin.categories.*' },
            { label: 'Clients', href: 'admin.customers.index', icon: Users, match: 'admin.customers.*' },
        ],
    },
    {
        label: 'Marketing & Alertes',
        items: [
            { label: 'Promotions', href: 'admin.store-promotions.index', icon: Megaphone, match: 'admin.store-promotions.*' },
            { label: 'Notifications', href: 'admin.notifications.index', icon: Bell, badge: 'unreadNotificationsCount', match: 'admin.notifications.*' },
        ],
    },
    {
        label: 'Site Vitrine',
        items: [
            { label: 'Hero Banner', href: 'admin.hero.edit', icon: Image, match: 'admin.hero.*' },
            { label: 'À propos Coach', href: 'admin.about.edit', icon: UserRound, match: 'admin.about.*' },
            { label: 'Services', href: 'admin.services.index', icon: Dumbbell, match: 'admin.services.*' },
            { label: 'Programmes', href: 'admin.programs.index', icon: PanelsTopLeft, match: 'admin.programs.*' },
            { label: 'Témoignages', href: 'admin.reviews.index', icon: Star, match: 'admin.reviews.*' },
            { label: 'Transformations', href: 'admin.transformations.index', icon: Images, match: 'admin.transformations.*' },
        ],
    },
    {
        label: 'Système',
        items: [{ label: 'Paramètres', href: 'admin.settings', icon: Settings, match: 'admin.settings*' }],
    },
];

export default function AdminSidebar({ onNavigate, onClose, mobile = false }) {
    const { adminNav, auth } = usePage().props;
    const currentUser = auth?.user;

    const [websiteOpen, setWebsiteOpen] = useState(
        sections[3].items.some((item) => route().current(item.match)) ||
            sections[2].items.some((item) => route().current(item.match))
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
                className={`group flex min-h-[38px] items-center justify-between rounded-md px-3 py-2 text-xs font-medium tracking-[0.02em] transition-all duration-150 ${
                    active
                        ? 'bg-white text-black font-bold shadow-sm'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
            >
                <span className="inline-flex items-center gap-2.5">
                    <Icon aria-hidden="true" className={`h-4 w-4 shrink-0 transition-colors ${active ? 'text-black' : 'text-slate-400 group-hover:text-white'}`} />
                    {item.label}
                </span>
                {count > 0 && (
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-black tracking-wider ${active ? 'bg-black text-white' : 'bg-lime-400 text-black'}`}>
                        {count}
                    </span>
                )}
            </Link>
        );
    };

    return (
        <div className="flex h-full flex-col justify-between overflow-hidden bg-slate-950 font-favorit">
            {/* Top Brand Header */}
            <div className="border-b border-white/10 px-5 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/admin" className="block">
                            <span className="text-sm font-black uppercase tracking-[0.12em] text-white">
                                FIT YOUNESS
                            </span>
                        </Link>
                        <span className="text-[10px] uppercase tracking-[0.08em] text-slate-400 font-medium">
                            Panneau d'administration
                        </span>
                    </div>

                    {mobile && (
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Fermer le menu"
                            className="rounded-md p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition"
                        >
                            <X aria-hidden="true" className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Navigation links */}
            <nav aria-label="Admin navigation" className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
                {sections.map((section) => {
                    const isWebsite = section.label === 'Site Vitrine';
                    const expanded = !isWebsite || websiteOpen;

                    return (
                        <section key={section.label} aria-label={section.label}>
                            {isWebsite ? (
                                <button
                                    type="button"
                                    onClick={() => setWebsiteOpen((open) => !open)}
                                    aria-expanded={websiteOpen}
                                    className="mb-1 flex w-full items-center justify-between rounded-md px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-slate-400 hover:text-white transition"
                                >
                                    <span>{section.label}</span>
                                    <ChevronDown
                                        aria-hidden="true"
                                        className={`h-3.5 w-3.5 transition-transform duration-200 ${
                                            websiteOpen ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>
                            ) : (
                                <h2 className="mb-1 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                                    {section.label}
                                </h2>
                            )}
                            {expanded && (
                                <div className="space-y-0.5">{section.items.map(renderLink)}</div>
                            )}
                        </section>
                    );
                })}
            </nav>

            {/* Footer with user & quick links */}
            <div className="border-t border-white/10 bg-slate-900/60 p-3">
                <div className="mb-3 flex items-center justify-between px-2">
                    <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-white">
                            {currentUser?.name || 'Administrateur'}
                        </p>
                        <p className="truncate text-[10px] text-slate-400">
                            {currentUser?.email || ''}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <Link
                        href="/store"
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-white/10 bg-white/5 py-1.5 text-[11px] font-medium text-slate-200 hover:bg-white/10 hover:text-white transition"
                        title="Voir la boutique en ligne"
                    >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>Boutique</span>
                    </Link>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex items-center justify-center rounded-md border border-white/10 bg-white/5 p-1.5 text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition"
                        title="Se déconnecter"
                    >
                        <LogOut className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
