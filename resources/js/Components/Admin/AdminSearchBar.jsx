import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function AdminSearchBar({
    value = '',
    placeholder = 'Rechercher…',
    onSearch,
}) {
    const [term, setTerm] = useState(value);

    const submit = (event) => {
        event.preventDefault();
        if (typeof onSearch === 'function') onSearch(term.trim());
    };

    return (
        <form onSubmit={submit} className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                aria-label={placeholder}
                type="search"
                placeholder={placeholder}
                className="w-full rounded-xl border-slate-200 py-2.5 pl-10 pr-3 text-sm shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
            />
        </form>
    );
}

export function visitWithQuery(url, params) {
    router.get(url, params, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
    });
}
