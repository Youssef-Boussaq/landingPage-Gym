import AdminHeader from '@/Components/Admin/AdminHeader';
import AdminSidebar from '@/Components/Admin/AdminSidebar';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminLayout({ title, children }) {
    const { flash } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 font-inter">
            {title && <Head title={title} />}

            <div className="flex min-h-screen">
                <aside className="hidden w-64 shrink-0 bg-slate-950 border-r border-white/10 lg:sticky lg:top-0 lg:block lg:h-screen">
                    <AdminSidebar />
                </aside>

                <Transition show={sidebarOpen} as="div">
                    <Dialog onClose={() => setSidebarOpen(false)} className="relative z-40 lg:hidden">
                        <TransitionChild
                            enter="ease-out duration-200"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-150"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div aria-hidden="true" className="fixed inset-0 bg-slate-950/60" />
                        </TransitionChild>
                        <div className="fixed inset-0 flex">
                            <TransitionChild
                                enter="transform transition ease-out duration-200"
                                enterFrom="-translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in duration-150"
                                leaveFrom="translate-x-0"
                                leaveTo="-translate-x-full"
                            >
                                <DialogPanel
                                    as="aside"
                                    id="admin-mobile-navigation"
                                    className="h-full w-72 max-w-[85vw] overflow-y-auto bg-slate-950 shadow-xl"
                                >
                                    <DialogTitle className="sr-only">Navigation admin</DialogTitle>
                                    <AdminSidebar mobile onClose={() => setSidebarOpen(false)} onNavigate={() => setSidebarOpen(false)} />
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </Dialog>
                </Transition>

                <div className="flex min-w-0 flex-1 flex-col">
                    <AdminHeader onMenuClick={() => setSidebarOpen(true)} menuExpanded={sidebarOpen} />

                    <main id="admin-main" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
                        {flash?.success && (
                            <div role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                                {flash.success}
                            </div>
                        )}
                        {flash?.error && (
                            <div role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
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
