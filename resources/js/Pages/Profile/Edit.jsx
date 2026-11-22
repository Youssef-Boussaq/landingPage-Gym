import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import StoreLayout from '@/Layouts/StoreLayout';
import {
    User,
    Package,
    Download,
    ExternalLink,
    Lock,
    Trash2,
    CheckCircle2,
    Clock,
    ShoppingBag,
    Shield,
    ArrowRight,
    AlertCircle,
} from 'lucide-react';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import DeleteUserForm from './Partials/DeleteUserForm';

export default function Edit({ mustVerifyEmail, status, orders = [] }) {
    const user = usePage().props.auth.user;
    const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile' | 'security'

    // Extract all digital products from paid/delivered orders
    const digitalProducts = orders.flatMap((order) => {
        const isPaid = order.payment_status === 'paid' || order.status === 'delivered';
        if (!isPaid) return [];
        return (order.items || [])
            .filter((item) => item.product && item.product.type === 'digital')
            .map((item) => ({
                orderId: order.id,
                orderNumber: order.order_number,
                item,
                product: item.product,
            }));
    });

    const memberSince = user?.created_at
        ? new Date(user.created_at).toLocaleDateString('fr-FR', {
              month: 'long',
              year: 'numeric',
          })
        : '2026';

    const getStatusBadge = (order) => {
        if (order.status === 'delivered') {
            return (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                    <CheckCircle2 className="h-3 w-3" /> Livrée
                </span>
            );
        }
        if (order.status === 'cancelled') {
            return (
                <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                    Annulée
                </span>
            );
        }
        if (order.payment_status === 'paid') {
            return (
                <span className="inline-flex items-center gap-1 bg-lime-50 text-lime-900 border border-lime-300 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                    <CheckCircle2 className="h-3 w-3" /> Payée
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                <Clock className="h-3 w-3" /> En attente
            </span>
        );
    };

    return (
        <StoreLayout>
            <Head title="Mon Profil Client | Fit Youness" />

            <div className="bg-[#f0efe7] min-h-screen py-10 font-favorit">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    {/* TOP MEMBER BANNER */}
                    <div className="border border-[#000000] bg-white p-6 sm:p-8 shadow-none mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                            <div className="flex items-center gap-5">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center bg-black text-xl font-black text-white">
                                    {user?.name
                                        ? user.name
                                              .split(' ')
                                              .map((n) => n[0])
                                              .join('')
                                              .substring(0, 2)
                                              .toUpperCase()
                                        : 'FY'}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h1 className="text-xl sm:text-2xl font-black uppercase tracking-[0.05em] text-black">
                                            {user?.name}
                                        </h1>
                                        {user?.role === 'admin' ? (
                                            <span className="inline-flex items-center gap-1 bg-black text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                                                <Shield className="h-3 w-3" /> Admin
                                            </span>
                                        ) : (
                                            <span className="bg-[#f0efe7] border border-[#000000] text-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                                                Membre Client
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-1 text-xs text-[#666666] tracking-[0.025em]">
                                        {user?.email} • Membre depuis {memberSince}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-[#e5e7eb] pt-4 sm:pt-0 sm:pl-8">
                                <div className="text-center px-4">
                                    <span className="block text-2xl font-black text-black">
                                        {orders.length}
                                    </span>
                                    <span className="text-[10px] uppercase tracking-wider text-[#666666]">
                                        Commandes
                                    </span>
                                </div>
                                <div className="text-center px-4 border-l border-[#e5e7eb]">
                                    <span className="block text-2xl font-black text-black">
                                        {digitalProducts.length}
                                    </span>
                                    <span className="text-[10px] uppercase tracking-wider text-[#666666]">
                                        E-Products
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="mt-8 flex flex-wrap gap-2 border-t border-[#e5e7eb] pt-6">
                            <button
                                type="button"
                                onClick={() => setActiveTab('orders')}
                                className={`px-4 py-2 text-xs font-bold uppercase tracking-[0.05em] transition-colors ${
                                    activeTab === 'orders'
                                        ? 'bg-black text-white'
                                        : 'bg-[#f0efe7] text-black hover:bg-black/10'
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    <Package className="h-3.5 w-3.5" />
                                    Commandes & E-Products ({orders.length})
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('profile')}
                                className={`px-4 py-2 text-xs font-bold uppercase tracking-[0.05em] transition-colors ${
                                    activeTab === 'profile'
                                        ? 'bg-black text-white'
                                        : 'bg-[#f0efe7] text-black hover:bg-black/10'
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    <User className="h-3.5 w-3.5" />
                                    Informations Personnelles
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('security')}
                                className={`px-4 py-2 text-xs font-bold uppercase tracking-[0.05em] transition-colors ${
                                    activeTab === 'security'
                                        ? 'bg-black text-white'
                                        : 'bg-[#f0efe7] text-black hover:bg-black/10'
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    <Lock className="h-3.5 w-3.5" />
                                    Sécurité & Mot de Passe
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* TAB CONTENT */}

                    {/* 1. ORDERS & DIGITAL PRODUCTS */}
                    {activeTab === 'orders' && (
                        <div className="space-y-8">
                            {/* DIGITAL PRODUCTS ACCESS CARDS */}
                            {digitalProducts.length > 0 && (
                                <section className="border border-[#000000] bg-white p-6 sm:p-8">
                                    <div className="mb-6 flex items-center justify-between border-b border-black pb-4">
                                        <div>
                                            <h2 className="text-sm font-bold uppercase tracking-[0.05em] text-black flex items-center gap-2">
                                                <Download className="h-4 w-4" />
                                                Vos Téléchargements & Accès Numériques
                                            </h2>
                                            <p className="mt-1 text-xs text-[#666666]">
                                                Retrouvez vos guides, programmes et contenus numériques achetés en accès instantané.
                                            </p>
                                        </div>
                                        <span className="hidden sm:inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                                            {digitalProducts.length} Fichier(s) disponible(s)
                                        </span>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {digitalProducts.map(({ orderId, orderNumber, item, product }) => (
                                            <div
                                                key={`digital-${orderId}-${product.id}`}
                                                className="border border-[#e5e7eb] bg-[#f0efe7]/50 p-5 flex flex-col justify-between"
                                            >
                                                <div>
                                                    <div className="flex items-start justify-between gap-3">
                                                        <h3 className="text-xs font-bold uppercase tracking-[0.025em] text-black">
                                                            {product.title}
                                                        </h3>
                                                        <span className="text-[10px] bg-black text-white px-1.5 py-0.5 font-bold uppercase shrink-0">
                                                            Digital
                                                        </span>
                                                    </div>
                                                    <p className="mt-1 text-[11px] text-[#666666]">
                                                        Commande {orderNumber} • {product.formatted_file_size || 'Accès immédiat'}
                                                    </p>
                                                </div>

                                                <div className="mt-5 flex flex-wrap gap-2">
                                                    {product.digital_file_path && (
                                                        <a
                                                            href={route('orders.download', {
                                                                order: orderId,
                                                                product: product.id,
                                                            })}
                                                            className="flex flex-1 items-center justify-center gap-2 bg-black py-2.5 px-3 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition"
                                                        >
                                                            <Download className="h-3.5 w-3.5" />
                                                            <span>Télécharger</span>
                                                        </a>
                                                    )}

                                                    {product.digital_download_link && (
                                                        <a
                                                            href={product.digital_download_link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center justify-center gap-2 border border-black bg-white py-2.5 px-3 text-[11px] font-bold uppercase tracking-wider text-black hover:bg-black hover:text-white transition"
                                                        >
                                                            <ExternalLink className="h-3.5 w-3.5" />
                                                            <span>Accéder en ligne</span>
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* ORDERS LIST */}
                            <section className="border border-[#000000] bg-white p-6 sm:p-8">
                                <div className="mb-6 border-b border-black pb-4">
                                    <h2 className="text-sm font-bold uppercase tracking-[0.05em] text-black flex items-center gap-2">
                                        <ShoppingBag className="h-4 w-4" />
                                        Historique de vos Commandes
                                    </h2>
                                    <p className="mt-1 text-xs text-[#666666]">
                                        Détails de vos achats passés et suivi de vos colis.
                                    </p>
                                </div>

                                {orders.length === 0 ? (
                                    <div className="py-12 text-center">
                                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center bg-[#f0efe7] text-black">
                                            <ShoppingBag className="h-6 w-6 stroke-[1.5]" />
                                        </div>
                                        <p className="text-sm font-bold uppercase tracking-[0.05em] text-black">
                                            Vous n'avez pas encore passé de commande
                                        </p>
                                        <p className="mt-1 text-xs text-[#666666]">
                                            Découvrez notre boutique et nos programmes exclusifs de coaching.
                                        </p>
                                        <div className="mt-6">
                                            <Link
                                                href="/store"
                                                className="inline-flex items-center gap-2 bg-black px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition"
                                            >
                                                <span>Explorer la boutique</span>
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    </div>
                               ) : (
                                    <div className="space-y-6">
                                        {orders.map((order) => (
                                            <div
                                                key={order.id}
                                                className="border border-[#e5e7eb] p-5 hover:border-black transition-colors"
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#e5e7eb] pb-3 gap-2">
                                                    <div>
                                                        <span className="text-xs font-black uppercase tracking-wider text-black">
                                                            {order.order_number}
                                                        </span>
                                                        <span className="ml-3 text-[11px] text-[#666666]">
                                                            {new Date(order.created_at).toLocaleDateString('fr-FR', {
                                                                day: '2-digit',
                                                                month: 'long',
                                                                year: 'numeric',
                                                            })}
                                                        </span>
                                                    </div>
                                                    <div>{getStatusBadge(order)}</div>
                                                </div>

                                                {/* Items */}
                                                <div className="py-3 divide-y divide-slate-100">
                                                    {(order.items || []).map((item) => (
                                                        <div
                                                            key={item.id}
                                                            className="flex items-center justify-between py-2.5 text-xs"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                {item.product?.primary_image?.image_url && (
                                                                    <img
                                                                        src={`/storage/${item.product.primary_image.image_url}`}
                                                                        alt={item.product.title}
                                                                        className="h-10 w-10 object-cover border border-[#e5e7eb]"
                                                                    />
                                                                )}
                                                                <div>
                                                                    <p className="font-bold text-black uppercase tracking-[0.025em]">
                                                                        {item.product?.title || 'Produit'}
                                                                    </p>
                                                                    <p className="text-[11px] text-[#666666]">
                                                                        Qté : {item.quantity} × {Number(item.unit_price).toFixed(2)} DH
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <span className="font-bold text-black">
                                                                {(item.quantity * Number(item.unit_price)).toFixed(2)} DH
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="flex items-center justify-between border-t border-[#e5e7eb] pt-3 text-xs">
                                                    <span className="text-[#666666] uppercase tracking-wider">
                                                        Mode : {order.payment_method === 'stripe' ? 'Carte bancaire (Stripe)' : 'Paiement à la livraison'}
                                                    </span>
                                                    <div className="text-right">
                                                        <span className="text-[11px] text-[#666666] uppercase tracking-wider mr-2">Total :</span>
                                                        <span className="text-sm font-black text-black">
                                                            {Number(order.total_amount).toFixed(2)} DH
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        </div>
                    )}

                    {/* 2. PROFILE SETTINGS */}
                    {activeTab === 'profile' && (
                        <div className="border border-[#000000] bg-white p-6 sm:p-8">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                            />
                        </div>
                    )}

                    {/* 3. SECURITY & DANGER ZONE */}
                    {activeTab === 'security' && (
                        <div className="space-y-8">
                            <div className="border border-[#000000] bg-white p-6 sm:p-8">
                                <UpdatePasswordForm />
                            </div>

                            <div className="border border-rose-300 bg-rose-50/40 p-6 sm:p-8">
                                <DeleteUserForm />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </StoreLayout>
    );
}
