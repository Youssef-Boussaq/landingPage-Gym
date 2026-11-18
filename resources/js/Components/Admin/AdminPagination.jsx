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
                        className={`${className} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]`}
                        aria-current={link.active ? 'page' : undefined}
                        aria-disabled={!link.url ? 'true' : undefined}
                        aria-label={paginationLabel(link.label)}
                        tabIndex={!link.url ? -1 : undefined}
                        preserveScroll
                    >
                        {decodePaginationLabel(link.label)}
                    </Link>
                );
            })}
        </nav>
    );
}

function decodePaginationLabel(label = '') {
    return label
        .replace(/<[^>]*>/g, '')
        .replace(/&laquo;/g, '«')
        .replace(/&raquo;/g, '»')
        .replace(/&amp;/g, '&');
}

function paginationLabel(label = '') {
    const text = decodePaginationLabel(label).trim();
    if (text === '« Previous' || text === '‹ Previous') return 'Previous page';
    if (text === 'Next »' || text === 'Next ›') return 'Next page';
    return text;
}
