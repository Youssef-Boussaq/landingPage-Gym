import { ShoppingBag, User, Bell } from 'lucide-react';
import { Link, usePage, router } from '@inertiajs/react';

export default function MobileHeader({ user }) {
    const { categories = [], selectedCategory = null } = usePage().props;

    // Déterminer si nous sommes actuellement sur la boutique (pour afficher le filtre de catégorie)
    const isStorePage = (typeof route !== 'undefined' && route().current('store.*')) || window.location.pathname.includes('/store');

    // Gestion de la sélection de catégorie avec scroll préservé et rechargement partiel
    const handleCategorySelect = (slug) => {
        const queryParams = (selectedCategory === slug || !slug) ? {} : { category: slug };
        router.get(route('store.index'), queryParams, {
            preserveState: true,
            preserveScroll: true,
            only: ['products', 'selectedCategory']
        });
    };

    return (
        <header
            className="
                fixed top-0 inset-x-0 z-40
                flex items-center justify-between
                px-5 py-4
                bg-transparent
                md:hidden
            "
        >
            {/* LEFT SIDE */}
            <div className="flex items-center gap-4">
                <Link
                    href={user ? "/profile" : "/login"}
                    className="
                        transition-transform duration-300
                        hover:-translate-y-1
                        active:scale-95
                    "
                >
                    {user?.avatar ? (
                        <img
                            src={user.avatar}
                            alt={user.name || "Avatar"}
                            className="
                                h-9 w-9
                                rounded-full
                                object-cover
                                border border-white/30
                            "
                        />
                    ) : (
                        <User
                            className="
                                h-5 w-5
                                text-primary
                                drop-shadow-md
                            "
                        />
                    )}
                </Link>

                <Link
                    href="/store/cart"
                    className="
                        transition-transform duration-300
                        hover:-translate-y-1
                        active:scale-95
                    "
                >
                    <ShoppingBag
                        className="
                            h-5 w-5
                            text-primary
                            drop-shadow-md
                        "
                    />
                </Link>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-4">

                {/* Notifications */}
                <button
                    type="button"
                    className="
                        relative
                        transition-transform duration-300
                        hover:-translate-y-1
                        active:scale-95
                    "
                >
                    <Bell
                        className="
                            h-5 w-5
                            text-primary
                            drop-shadow-md
                        "
                    />
                    <span
                        className="
                            absolute
                            top-0 right-0
                            h-2 w-2
                            rounded-full
                            bg-red-600
                        "
                    />
                </button>
            </div>
        </header>
    );
}