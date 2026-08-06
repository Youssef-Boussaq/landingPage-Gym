import { Link } from '@inertiajs/react';

export default function CategoryToggle({ categories = [], selectedCategory }) {
    return (
        <div className="flex flex-wrap gap-2">
            <Link
                href={route('store.index')}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    !selectedCategory
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
            >
                Tous
            </Link>
            {categories.map((category) => (
                <Link
                    key={category.id}
                    href={route('store.index', { category: category.slug })}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                        selectedCategory === category.slug
                            ? 'border-slate-900 bg-slate-900 text-white'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                >
                    {category.name} ({category.products_count})
                </Link>
            ))}
        </div>
    );
}
