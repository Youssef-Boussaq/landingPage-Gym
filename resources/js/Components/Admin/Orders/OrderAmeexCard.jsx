import { useState } from 'react';
import {
    Check,
    Clipboard,
    ClipboardCheck,
    Clock3,
    MapPin,
    Package,
    PackageCheck,
    PackageOpen,
    PackageX,
    Radio,
    RotateCcw,
    ShieldCheck,
    Truck,
} from 'lucide-react';

function hexToRgba(hex, alpha = 0.1) {
    if (!hex) {
        return `color-mix(in srgb, var(--color-primary) calc(${alpha} * 100%), transparent)`;
    }

    const value = hex.replace('#', '');

    if (!/^[0-9a-fA-F]{6}$/.test(value)) {
        return `color-mix(in srgb, var(--color-primary) calc(${alpha} * 100%), transparent)`;
    }

    const r = parseInt(value.slice(0, 2), 16);
    const g = parseInt(value.slice(2, 4), 16);
    const b = parseInt(value.slice(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function formatDate(value) {
    if (!value) {
        return '—';
    }

    try {
        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(value));
    } catch {
        return value;
    }
}

function getStatusIcon(status) {
    switch (status) {
        case 'DELIVERED':
            return PackageCheck;

        case 'RETURNED':
            return PackageX;

        case 'DISTRIBUTION':
            return Truck;

        case 'PICKED_UP':
        case 'IN_PROGRESS':
        case 'IN_SHIPMENT':
            return Truck;

        case 'DRAFT':
        case 'NEW_PARCEL':
            return PackageOpen;

        default:
            return Package;
    }
}

function getStatusAccent(status, color) {
    if (status === 'RETURNED') {
        return '#ef4444';
    }

    if (status === 'DELIVERED') {
        return '#22c55e';
    }

    return color || 'var(--color-primary)';
}

function StatusBadge({ shipment }) {
    const color = getStatusAccent(
        shipment.status,
        shipment.status_color
    );

    return (
        <div
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5"
            style={{
                color,
                backgroundColor: hexToRgba(color, 0.08),
                borderColor: hexToRgba(color, 0.18),
            }}
        >
            <span
                className="h-2 w-2 rounded-full"
                style={{
                    backgroundColor: color,
                }}
            />

            <span className="text-xs font-bold">
                {shipment.status_name || 'Statut inconnu'}
            </span>
        </div>
    );
}

function ParcelCode({ code }) {
    const [copied, setCopied] = useState(false);

    async function copyCode() {
        if (!code) {
            return;
        }

        try {
            await navigator.clipboard.writeText(code);

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 1800);
        } catch {
            // Clipboard unavailable.
        }
    }

    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Numéro de colis
                    </p>

                    <p className="mt-1 truncate font-mono text-sm font-black tracking-wide text-slate-900">
                        {code || '—'}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={copyCode}
                    className="flex h-9 shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                >
                    {copied ? (
                        <>
                            <ClipboardCheck className="h-4 w-4 text-emerald-500" />
                            Copié
                        </>
                    ) : (
                        <>
                            <Clipboard className="h-4 w-4" />
                            Copier
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

function InfoItem({ icon: Icon, label, children }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-slate-400" />

                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    {label}
                </span>
            </div>

            <div className="mt-2">
                {children}
            </div>
        </div>
    );
}

function EventItem({ event, isLast, isFirst }) {
    const color = getStatusAccent(
        event.status,
        event.status_color
    );

    const Icon = getStatusIcon(event.status);

    return (
        <div className="relative flex gap-4">
            {/* Connector */}
            {!isLast && (
                <div className="absolute left-[15px] top-9 h-[calc(100%+1rem)] w-px bg-slate-200" />
            )}

            {/* Icon */}
            <div
                className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white"
                style={{
                    backgroundColor: hexToRgba(color, 0.1),
                    color,
                    boxShadow: isFirst
                        ? `0 0 0 4px ${hexToRgba(color, 0.06)}`
                        : 'none',
                }}
            >
                <Icon className="h-4 w-4" />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1 pb-5">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-800">
                            {event.status_name ||
                                event.status ||
                                'Événement'}
                        </p>

                        {isFirst && (
                            <span
                                className="rounded-full px-2 py-0.5 text-[9px] font-bold"
                                style={{
                                    color,
                                    backgroundColor: hexToRgba(
                                        color,
                                        0.08
                                    ),
                                }}
                            >
                                ACTUEL
                            </span>
                        )}
                    </div>

                    <time className="text-[10px] font-medium text-slate-400">
                        {formatDate(event.received_at)}
                    </time>
                </div>

                {event.sub_status_name && (
                    <p className="mt-1 text-xs text-slate-500">
                        {event.sub_status_name}
                    </p>
                )}

                {event.comment && (
                    <p className="mt-1.5 text-xs leading-5 text-slate-500">
                        {event.comment}
                    </p>
                )}
            </div>
        </div>
    );
}

export default function OrderAmeexCard({ shipment }) {
    /*
    |--------------------------------------------------------------------------
    | Empty state
    |--------------------------------------------------------------------------
    */

    if (!shipment) {
        return (
            <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-4 p-5 sm:p-6">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <PackageOpen className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-sm font-black uppercase tracking-wider text-slate-800">
                                Expédition AMEEX
                            </h2>

                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                                Pas encore expédiée
                            </span>
                        </div>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            Aucun colis AMEEX n'est encore associé à cette
                            commande.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    const statusColor = getStatusAccent(
        shipment.status,
        shipment.status_color
    );

    const events = shipment.events || [];

    return (
        <div className="space-y-5">

            {/* ============================================================
                MAIN AMEEX CARD
            ============================================================ */}

            <section
                className="overflow-hidden rounded-3xl border bg-white shadow-sm"
                style={{
                    borderColor: hexToRgba(statusColor, 0.2),
                }}
            >
                {/* Top accent */}
                <div
                    className="h-1"
                    style={{
                        backgroundColor: statusColor,
                    }}
                />

                <div className="p-5 sm:p-6">

                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-3">
                            <div
                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                                style={{
                                    backgroundColor: hexToRgba(
                                        statusColor,
                                        0.09
                                    ),
                                    color: statusColor,
                                }}
                            >
                                <Truck className="h-5 w-5" />
                            </div>

                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                                        Expédition AMEEX
                                    </h2>

                                    {shipment.sandbox && (
                                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-amber-700">
                                            <ShieldCheck className="h-3 w-3" />
                                            Sandbox
                                        </span>
                                    )}
                                </div>

                                <p className="mt-1 text-xs text-slate-500">
                                    Informations du colis et suivi de livraison
                                </p>
                            </div>
                        </div>

                        <StatusBadge shipment={shipment} />
                    </div>

                    {/* Parcel */}
                    <div className="mt-5">
                        <ParcelCode code={shipment.parcel_code} />
                    </div>

                    {/* Info grid */}
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <InfoItem
                            icon={MapPin}
                            label="Destination"
                        >
                            <p className="text-sm font-bold text-slate-800">
                                {shipment.city?.name || '—'}
                            </p>

                            {shipment.city?.name_fr &&
                                shipment.city.name_fr !==
                                shipment.city.name && (
                                    <p className="mt-0.5 text-xs text-slate-400">
                                        {shipment.city.name_fr}
                                    </p>
                                )}
                        </InfoItem>

                        <InfoItem
                            icon={Radio}
                            label="Sous-statut"
                        >
                            <p className="text-sm font-bold text-slate-800">
                                {shipment.sub_status_name || '—'}
                            </p>

                            {shipment.sub_status && (
                                <p className="mt-0.5 font-mono text-[10px] text-slate-400">
                                    {shipment.sub_status}
                                </p>
                            )}
                        </InfoItem>
                    </div>

                    {/* Comment */}
                    {shipment.comment && (
                        <div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3">
                            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                                Dernier message AMEEX
                            </p>

                            <p className="mt-1.5 text-xs leading-5 text-slate-600">
                                {shipment.comment}
                            </p>
                        </div>
                    )}

                    {/* Terminal state */}
                    {shipment.status === 'RETURNED' && (
                        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-red-500 shadow-sm">
                                <RotateCcw className="h-4 w-4" />
                            </div>

                            <div>
                                <p className="text-sm font-bold text-red-700">
                                    Colis retourné
                                </p>

                                <p className="mt-0.5 text-xs text-red-600/80">
                                    AMEEX a signalé le retour de cette
                                    expédition.
                                </p>
                            </div>
                        </div>
                    )}

                    {shipment.status === 'DELIVERED' && (
                        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-500 shadow-sm">
                                <Check className="h-4 w-4" />
                            </div>

                            <div>
                                <p className="text-sm font-bold text-emerald-700">
                                    Livraison terminée
                                </p>

                                <p className="mt-0.5 text-xs text-emerald-600/80">
                                    Le colis a été livré au client.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* ============================================================
                EVENTS
            ============================================================ */}

            {events.length > 0 && (
                <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                                    Activité du colis
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    Historique des événements AMEEX
                                </p>
                            </div>

                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                                {events.length}
                            </span>
                        </div>
                    </div>

                    <div className="p-5 sm:p-6">
                        <div>
                            {events.map((event, index) => (
                                <EventItem
                                    key={event.id}
                                    event={event}
                                    isFirst={index === 0}
                                    isLast={index === events.length - 1}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}