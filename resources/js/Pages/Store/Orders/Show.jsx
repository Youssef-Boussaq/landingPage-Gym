import React from 'react';
import { Head } from '@inertiajs/react';
import StoreLayout from '@/Layouts/StoreLayout';
import {
    Download,
    Package,
    CreditCard,
    User,
    MapPin,
    CheckCircle2,
    Clock,
    Truck,
    ShieldCheck,
    Printer
} from 'lucide-react';

export default function Show({ order }) {
    const formattedDate = new Date(order.created_at).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Étapes du suivi de commande
    const steps = [
        { key: 'created', label: 'Commande reçue', icon: Clock },
        { key: 'confirmed', label: 'Confirmée', icon: CheckCircle2 },
        { key: 'shipped', label: 'En cours d\'expédition', icon: Truck },
        { key: 'delivered', label: 'Livrée', icon: Package },
    ];

    const getStepStatus = (stepKey) => {
        const orderStatuses = ['created', 'confirmed', 'shipped', 'delivered'];
        const currentIndex = orderStatuses.indexOf(order.status?.toLowerCase() || 'created');
        const stepIndex = orderStatuses.indexOf(stepKey);

        if (stepIndex < currentIndex) return 'completed';
        if (stepIndex === currentIndex) return 'current';
        return 'upcoming';
    };

    return (
        <StoreLayout>
            <Head title={`Commande ${order.order_number}`} />

            <div className="font-inter min-h-screen bg-slate-50/50 py-10">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

                    {/* EN-TÊTE DE LA PAGE */}
                    <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center">
                        <div>
                            <div className="flex items-center gap-3">
                                <span className="font-archivo text-xs uppercase tracking-widest text-slate-400">
                                    Récapitulatif Officiel
                                </span>
                                <span className="inline-flex items-center rounded-full bg-slate-900 px-2.5 py-0.5 text-[11px] font-black uppercase text-[var(--color-primary)]">
                                    {order.status}
                                </span>
                            </div>
                            <h1 className="font-archivo mt-1 text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">
                                Commande #{order.order_number}
                            </h1>
                            <p className="mt-1 text-xs text-slate-500 font-regular">
                                Effectuée le <span className="font-medium text-slate-700">{formattedDate}</span>
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => window.print()}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition"
                            >
                                <Printer className="h-4 w-4 text-slate-500" />
                                Imprimer
                            </button>
                            <button
                                disabled
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm opacity-60 cursor-not-allowed hover:bg-slate-800 transition"
                                title="Bientôt disponible"
                            >
                                <Download className="h-4 w-4 text-[var(--color-primary)]" />
                                Reçu PDF
                            </button>
                        </div>
                    </div>

                    {/* SUIVI VISUEL DE LA COMMANDE (STEPPER) */}
                    <div className="mb-8 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                        <h2 className="font-archivo text-xs uppercase tracking-wider text-slate-400 mb-6">
                            État d'avancement
                        </h2>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {steps.map((step, idx) => {
                                const status = getStepStatus(step.key);
                                const StepIcon = step.icon;

                                return (
                                    <div key={step.key} className="flex flex-col items-center text-center">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${status === 'completed'
                                                ? 'bg-slate-900 text-[var(--color-primary)]'
                                                : status === 'current'
                                                    ? 'bg-[var(--color-primary)] text-slate-950 ring-4 ring-[var(--color-primary)]/20'
                                                    : 'bg-slate-100 text-slate-300'
                                            }`}>
                                            <StepIcon className="h-5 w-5" />
                                        </div>
                                        <span className={`mt-3 text-xs ${status === 'current' ? 'font-bold text-slate-900' : 'font-medium text-slate-500'
                                            }`}>
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* CONTENU PRINCIPAL */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

                        {/* COLONNE GAUCHE : LISTE DES PRODUITS & TOTAL */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                                <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50/50">
                                    <h2 className="font-archivo text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                                        <Package className="h-4 w-4 text-slate-500" />
                                        Articles commandés ({order.items.length})
                                    </h2>
                                </div>

                                {/* Table / Liste */}
                                <ul className="divide-y divide-slate-100">
                                    {order.items.map((item) => (
                                        <li key={item.id} className="p-6 sm:flex sm:items-center sm:gap-6">
                                            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                                                {item.product?.primary_image ? (
                                                    <img
                                                        src={`/storage/${item.product.primary_image.path}`}
                                                        alt={item.product.title}
                                                        className="h-full w-full object-cover object-center"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-slate-300">
                                                        <Package className="h-8 w-8" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-4 flex-1 sm:mt-0">
                                                <div className="flex justify-between gap-4">
                                                    <div>
                                                        <h3 className="font-semibold text-sm text-slate-900">
                                                            {item.product?.title || 'Produit sans titre'}
                                                        </h3>
                                                        <p className="mt-0.5 text-xs text-slate-500 font-regular">
                                                            Prix unitaire : <span className="font-medium text-slate-700">{item.unit_price} MAD</span>
                                                        </p>
                                                    </div>
                                                    <p className="font-bold text-sm text-slate-900">
                                                        {(item.unit_price * item.quantity).toFixed(2)} MAD
                                                    </p>
                                                </div>
                                                <div className="mt-3 flex items-center text-xs text-slate-500">
                                                    <span className="bg-slate-100 px-2 py-0.5 rounded font-medium text-slate-600">
                                                        Qté : {item.quantity}
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                {/* Récapitulatif financier */}
                                <div className="border-t border-slate-100 bg-slate-50/50 p-6 space-y-3">
                                    <div className="flex justify-between text-xs text-slate-500">
                                        <span>Sous-total</span>
                                        <span className="font-medium text-slate-700">{order.total_amount} MAD</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-500">
                                        <span>Frais de livraison</span>
                                        <span className="font-medium text-emerald-600 uppercase text-[10px] bg-emerald-50 px-2 py-0.5 rounded">Inclus / Gratuit</span>
                                    </div>
                                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                                        <p className="font-archivo text-xs uppercase tracking-wider text-slate-900">Montant Total</p>
                                        <span className="text-xl font-black text-slate-950 bg-[var(--color-primary)] px-3.5 py-1 rounded-xl shadow-xs">
                                            {order.total_amount} MAD
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Badge de garantie */}
                            <div className="flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-white p-4 shadow-xs text-slate-600 text-xs">
                                <ShieldCheck className="h-5 w-5 shrink-0 text-slate-900" />
                                <span>Achat protégé et vérifié par notre service client. Pour toute réclamation, munissez-vous du numéro de commande.</span>
                            </div>
                        </div>

                        {/* COLONNE DROITE : INFOS CLIENT, LIVRAISON, PAIEMENT */}
                        <div className="space-y-6">

                            {/* CLIENT */}
                            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                                <h2 className="font-archivo text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                                    <User className="h-4 w-4 text-slate-400" />
                                    Informations Client
                                </h2>
                                <dl className="space-y-3 text-xs">
                                    <div>
                                        <dt className="text-slate-400 font-regular">Nom complet</dt>
                                        <dd className="font-semibold text-slate-900 mt-0.5">{order.customer_name}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-slate-400 font-regular">Email</dt>
                                        <dd className="font-medium text-slate-900 mt-0.5">{order.customer_email}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-slate-400 font-regular">Téléphone</dt>
                                        <dd className="font-medium text-slate-900 mt-0.5">{order.customer_phone}</dd>
                                    </div>
                                </dl>
                            </div>

                            {/* LIVRAISON */}
                            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                                <h2 className="font-archivo text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                                    <MapPin className="h-4 w-4 text-slate-400" />
                                    Adresse de Livraison
                                </h2>
                                <div className="text-xs text-slate-800 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    {order.shipping_address}<br />
                                    {order.postal_code && `${order.postal_code}, `}{order.city}
                                </div>
                            </div>

                            {/* PAIEMENT */}
                            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                                <h2 className="font-archivo text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                                    <CreditCard className="h-4 w-4 text-slate-400" />
                                    Paiement
                                </h2>
                                <dl className="space-y-3 text-xs">
                                    <div className="flex justify-between items-center">
                                        <dt className="text-slate-400 font-regular">Méthode</dt>
                                        <dd className="font-bold text-slate-900 capitalize bg-slate-100 px-2 py-0.5 rounded">
                                            {order.payment_method}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <dt className="text-slate-400 font-regular">Statut</dt>
                                        <dd>
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${order.payment_status === 'paid'
                                                    ? 'bg-[var(--color-primary)] text-slate-950'
                                                    : 'bg-amber-100 text-amber-800'
                                                }`}>
                                                {order.payment_status?.toUpperCase()}
                                            </span>
                                        </dd>
                                    </div>
                                    {order.transaction_id && order.payment_method !== 'cash' && (
                                        <div className="pt-2 border-t border-slate-100">
                                            <dt className="text-slate-400 font-regular mb-1">ID de Transaction</dt>
                                            <dd className="font-mono text-[10px] text-slate-700 break-all bg-slate-100 p-2 rounded-lg">
                                                {order.transaction_id}
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}