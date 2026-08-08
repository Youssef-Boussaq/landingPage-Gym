import MenuCategory from '@/Components/Category/MenuCatgory';
import FilterHeader from './Filter/FilterHeader';
import BadgeFilter from './Filter/BadgeFilter';
import ProductTypeFilter from './Filter/ProductTypeFilter';
import PriceFilter from './Filter/PriceFilter';


export default function StoreFilterSidebar({
    categories = [],
    selectedCategory = null,

    filters = {},

    isPending = false,

    isOpen = false,

    onClose,

    onReset,

    onSelectCategory,

    onToggleTrending,

    onToggleTopSeller,

    onTypeChange,

    onPriceChange,

    onPriceCommit,
}) {
    const hasActiveFilters =
        selectedCategory ||
        filters.trending ||
        filters.top_seller ||
        filters.type !== 'all' ||
        filters.max_price < 500;

    const handleCategorySelect = (slug) => {
        onSelectCategory?.(slug);
        onClose?.();
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
                />
            )}

            <aside
                className={`
                    fixed inset-y-0 left-0 z-50
                    w-72 sm:w-80
                    bg-white
                    shadow-2xl
                    transition-transform duration-300
                    lg:relative
                    lg:translate-x-0
                    lg:w-72
                    lg:shadow-none
                    lg:bg-transparent
                    lg:block
                    ${
                        isOpen
                            ? 'translate-x-0'
                            : '-translate-x-full lg:translate-x-0'
                    }
                `}
            >
                <div className="h-full lg:h-auto rounded-3xl bg-white lg:border lg:border-slate-200/80 lg:shadow-xs p-5 space-y-6">

                    <FilterHeader
                        isPending={isPending}
                        onClose={onClose}
                        onReset={onReset}
                    />

                    <div
                        className={`space-y-6 ${
                            isPending
                                ? 'pointer-events-none opacity-60'
                                : ''
                        }`}
                    >
                        {/* Categories */}

                       <div className="flex items-center justify-between gap-3 px-3.5 py-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-2xl transition-all duration-200 shadow-2xs">
    {/* Label à gauche */}
    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 shrink-0">
        Catégories
    </span>

    {/* Menu / Dropdown / Badges à droite */}
    <MenuCategory
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={handleCategorySelect}
    />
</div>

                        {/* Badges */}

                        <BadgeFilter
                            trending={filters.trending}
                            topSeller={filters.top_seller}
                            onToggleTrending={onToggleTrending}
                            onToggleTopSeller={onToggleTopSeller}
                        />

                        {/* Product Type */}

                        <ProductTypeFilter
                            type={filters.type}
                            onChange={onTypeChange}
                        />

                        {/* Price */}

                        <PriceFilter
                            value={filters.max_price}
                            onChange={onPriceChange}
                            onCommit={onPriceCommit}
                        />
                    </div>

                    {hasActiveFilters && (
                        <button
                            onClick={onReset}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                        >
                            Réinitialiser les filtres
                        </button>
                    )}
                </div>
            </aside>
        </>
    );
}