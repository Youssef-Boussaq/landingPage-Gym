import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

export default function AdminBreadcrumbs({ items = [] }) {
    return (
        <nav className="mb-4 flex flex-wrap items-center gap-1 text-sm text-slate-500">
            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1">
                        {item.href && !isLast ? (
                            <Link href={item.href} className="hover:text-slate-900">
                                {item.label}
                            </Link>
                        ) : (
                            <span className={isLast ? 'font-semibold text-slate-900' : ''}>
                                {item.label}
                            </span>
                        )}
                        {!isLast && <ChevronRight className="h-3.5 w-3.5" />}
                    </span>
                );
            })}
        </nav>
    );
}
