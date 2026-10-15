import AdminHeader from '@/Components/Admin/AdminHeader';
import AdminSidebar from '@/Components/Admin/AdminSidebar';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminLayout({ title, children }) {
    const { flash } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 font-inter">
            {title && <Head title={title} />}

            <div className="flex min-h-screen">
                <aside className="hidden w-64 shrink-0 bg-slate-950 lg:sticky lg:top-0 lg:block lg:h-screen">
                    <div className="px-5 py-5 text-xs font-black uppercase tracking-[0.2em] text-[var(--color-primary)]">
                        Admin
                    </div>
                    <AdminSidebar />
                </aside>

                {sidebarOpen && (
                    <div className="fixed inset-0 z-40 lg:hidden">
                        <button
                            type="button"
                            className="absolute inset-0 bg-slate-950/60"
                            aria-label="Fermer le menu"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <aside className="relative z-50 h-full w-64 bg-slate-950 shadow-xl">
                            <div className="px-5 py-5 text-xs font-black uppercase tracking-[0.2em] text-[var(--color-primary)]">
                                Admin
                            </div>
                            <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
                        </aside>
                    </div>
                )}

                <div className="flex min-w-0 flex-1 flex-col">
                    <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

                    <main className="flex-1 px-4 py-6 lg:px-8">
                        {flash?.success && (
                            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                                {flash.success}
                            </div>
                        )}
                        {flash?.error && (
                            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                                {flash.error}
                            </div>
                        )}
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
