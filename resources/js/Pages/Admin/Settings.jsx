import AdminBreadcrumbs from '@/Components/Admin/AdminBreadcrumbs';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Settings({ settings }) {
    return (
        <AdminLayout title="Paramètres">
            <AdminBreadcrumbs items={[{ label: 'Admin', href: route('admin.dashboard') }, { label: 'Settings' }]} />
            <h1 className="font-archivo text-2xl uppercase text-slate-900">Settings</h1>
            <div className="mt-6 max-w-xl space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-sm">
                <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Application</span>
                    <span className="font-semibold">{settings.app_name}</span>
                </div>
                <div className="flex justify-between gap-4">
                    <span className="text-slate-500">LOW_STOCK_THRESHOLD</span>
                    <span className="font-semibold">{settings.low_stock_threshold}</span>
                </div>
                <div className="flex justify-between gap-4">
                    <span className="text-slate-500">ADMIN_NOTIFICATION_EMAIL</span>
                    <span className="font-semibold">{settings.admin_notification_email || 'non défini (admins uniquement)'}</span>
                </div>
                <p className="text-xs text-slate-400">
                    Ces valeurs viennent de la configuration Laravel / fichier .env. Elles ne sont pas modifiables depuis l’interface.
                </p>
            </div>
        </AdminLayout>
    );
}
