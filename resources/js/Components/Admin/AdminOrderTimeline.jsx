import { CheckCircle2 } from 'lucide-react';
import { formatDate } from '@/helpers/format';

export default function AdminOrderTimeline({ events = [] }) {
    if (!events.length) {
        return (
            <p className="text-sm text-slate-500">Aucun événement disponible.</p>
        );
    }

    return (
        <ol className="space-y-4">
            {events.map((event, index) => (
                <li key={`${event.key}-${index}`} className="flex gap-3">
                    <div className="mt-0.5 text-[var(--color-primary)]">
                        <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">{event.label}</p>
                        <p className="text-xs text-slate-500">
                            {event.at ? formatDate(event.at) : 'Horodatage non enregistré'}
                        </p>
                    </div>
                </li>
            ))}
        </ol>
    );
}
