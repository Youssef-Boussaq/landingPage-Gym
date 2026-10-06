import {
    MessageCircle,
    Phone,
    UserRound,
    Copy,
    Check,
} from 'lucide-react';
import { useState } from 'react';

function normalizePhone(phone) {
    if (!phone) {
        return '';
    }

    // Remove spaces, +, -, parentheses, etc.
    let value = String(phone).replace(/\D/g, '');

    // Morocco local format: 0612345678 → 212612345678
    if (value.startsWith('0') && value.length === 10) {
        value = `212${value.slice(1)}`;
    }

    // Already international Morocco format
    if (value.startsWith('212')) {
        return value;
    }

    return value;
}

function buildWhatsAppMessage(order) {
    const customerName = order.customer?.name || 'Client';

    return `Bonjour ${customerName},

Nous vous contactons concernant votre commande ${order.order_number}.

Nous souhaitons confirmer les informations de votre commande et sa livraison.

Merci.`;
}

export default function OrderWhatsApp({ order }) {
    const [copied, setCopied] = useState(false);

    const phone = order.customer?.phone;
    const normalizedPhone = normalizePhone(phone);

    if (!phone) {
        return null;
    }

    const message = buildWhatsAppMessage(order);

    const whatsappUrl = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(
        message
    )}`;

    const phoneUrl = `tel:${phone}`;

    async function copyPhone() {
        try {
            await navigator.clipboard.writeText(phone);

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 1600);
        } catch {
            // Clipboard unavailable.
        }
    }

    return (
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="p-5 sm:p-6">
                {/* Header */}
                <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                        <MessageCircle className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                        <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                            Contacter le client
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            Contact rapide pour confirmer la commande
                        </p>
                    </div>
                </div>

                {/* Customer */}
                <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
                            <UserRound className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-800">
                                {order.customer?.name || 'Client'}
                            </p>

                            <p className="mt-0.5 font-mono text-xs text-slate-500">
                                {phone}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={copyPhone}
                        className="flex h-9 shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-bold text-slate-500 transition hover:bg-slate-50"
                        title="Copier le numéro"
                    >
                        {copied ? (
                            <Check className="h-4 w-4 text-emerald-600" />
                        ) : (
                            <Copy className="h-4 w-4" />
                        )}

                        <span className="hidden sm:inline">
                            {copied ? 'Copié' : 'Copier'}
                        </span>
                    </button>
                </div>

                {/* Actions */}
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
                    >
                        <MessageCircle className="h-4 w-4 transition-transform group-hover:scale-110" />
                        Ouvrir WhatsApp
                    </a>

                    <a
                        href={phoneUrl}
                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                        <Phone className="h-4 w-4" />
                        Appeler
                    </a>
                </div>

                {/* Notice */}
                <p className="mt-3 text-center text-[10px] leading-4 text-slate-400">
                    Le contact avec le client ne modifie pas automatiquement
                    le statut de la commande.
                </p>
            </div>
        </section>
    );
}