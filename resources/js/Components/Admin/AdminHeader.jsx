import Dropdown from '@/Components/Dropdown';
import Logo from '@/Components/Logo';
import { Link, usePage } from '@inertiajs/react';
import { Bell, Menu } from 'lucide-react';

export default function AdminHeader({ onMenuClick, menuExpanded = false }) {
    const { auth, adminNav } = usePage().props;
    const user = auth?.user;
    const unreadCount = Number(adminNav?.unreadNotificationsCount || 0);

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:px-8">
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onMenuClick}
                    aria-expanded={menuExpanded}
                    aria-controls="admin-mobile-navigation"
                    className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] lg:hidden"
                    aria-label="Ouvrir le menu"
                >
                    <Menu className="h-5 w-5" />
                </button>
                <Logo />
            </div>

            <div className="flex items-center gap-3">
                <Link
                    href={route('admin.notifications.index')}
                    aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} non lue(s)` : 'Notifications'}
                    className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                >
                    <Bell aria-hidden="true" className="h-5 w-5" />
                    {unreadCount > 0 && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500" />}
                </Link>
                <Link
                    href={route('store.index')}
                    className="hidden rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 sm:inline-flex"
                >
                    Voir la boutique
                </Link>
                <Dropdown>
                    <Dropdown.Trigger>
                        <button
                            type="button"
                            aria-label={`Compte utilisateur : ${user?.name || 'Admin'}`}
                            className="inline-flex max-w-[40vw] items-center truncate rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                        >
                            {user?.name || 'Admin'}
                        </button>
                    </Dropdown.Trigger>
                    <Dropdown.Content>
                        <Dropdown.Link href={route('profile.edit')}>Profil</Dropdown.Link>
                        <Dropdown.Link href={route('logout')} method="post" as="button">
                            Déconnexion
                        </Dropdown.Link>
                    </Dropdown.Content>
                </Dropdown>
            </div>
        </header>
    );
}
