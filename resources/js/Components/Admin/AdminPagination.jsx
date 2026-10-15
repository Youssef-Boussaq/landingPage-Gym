import { Link } from '@inertiajs/react';

export default function AdminPagination({ links = [] }) {
    if (!links.length || links.length <= 3) {
        return null;
    }

    return (
        <nav className="mt-4 flex flex-wrap items-center justify-end gap-1">
            {links.map((link, index) => {
                const className = [
                    'min-w-9 rounded-lg px-3 py-1.5 text-sm',
                    link.active
                        ? 'bg-slate-900 text-[var(--color-primary)]'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50',
                    !link.url ? 'opacity-40 pointer-events-none' : '',
                ].join(' ');

                return (
                    <Link
                        key={`${link.label}-${index}`}
                        href={link.url || '#'}
                        className={className}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        preserveScroll
                    />
                );
            })}
        </nav>
    );
}
