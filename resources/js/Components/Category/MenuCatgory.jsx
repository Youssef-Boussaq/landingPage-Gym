import { useState, useRef, useEffect } from "react";
import { Filter, X, Check } from "lucide-react";

export default function MenuCategory({ categories = [], selectedCategory = null, onSelect }) {
    const [isOpen, setIsOpen] = useState(true);
    const menuRef = useRef(null);

    // Clic en dehors pour fermer le menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [isOpen]);

    const handleSelect = (category) => {
        const slug = typeof category === "object" ? category?.slug : category;
        if (onSelect) {
            onSelect(slug);
        }
        setIsOpen(false);
    };

    return (
        <div ref={menuRef} className="relative">
            {/* Bouton de déclenchement avec styles interactifs */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="
                    transition-transform duration-300
                    hover:-translate-y-1
                    active:scale-95
                    focus:outline-none
                    flex items-center justify-center
                "
                aria-label="Filtrer par catégorie"
                aria-haspopup="menu"
                aria-expanded={isOpen}
                aria-controls="category-menu-dropdown"
            >
                {isOpen ? (
                    <X className="h-5 w-5 text-primary drop-shadow-md" />
                ) : (
                    <Filter className="h-5 w-5 text-primary drop-shadow-md" />
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    id="category-menu-dropdown"
                    role="menu"
                    className="mt-3 w-full z-10 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-800 shadow-xl p-2 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                    {categories.length === 0 ? (
                        <div className="px-4 py-2 text-xs text-slate-400 text-center" role="menuitem">
                            Aucune catégorie disponible
                        </div>
                    ) : (
                        <ul className="flex flex-col gap-1">
                            {/* Option "Tous les produits" */}
                            <li>
                                <button
                                    role="menuitem"
                                    aria-current={!selectedCategory ? "page" : undefined}
                                    onClick={() => handleSelect(null)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${!selectedCategory
                                            ? "bg-primary text-slate-950 font-bold"
                                            : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                                        }`}
                                >
                                    <span>Tous les produits</span>
                                    {!selectedCategory && <Check className="h-3.5 w-3.5 text-slate-950" />}
                                </button>
                            </li>

                            <hr className="my-1 border-slate-800" />

                            {/* Liste des catégories */}
                            {categories.map((cat) => {
                                const isActive = selectedCategory === cat.slug;

                                return (
                                    <li key={cat.id || cat.slug}>
                                        <button
                                            role="menuitem"
                                            aria-current={isActive ? "page" : undefined}
                                            onClick={() => handleSelect(cat)}
                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${isActive
                                                    ? "bg-primary text-slate-950 font-bold"
                                                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                                                }`}
                                        >
                                            <span className="truncate">{cat.name}</span>
                                            {isActive && <Check className="h-3.5 w-3.5 shrink-0 text-slate-950" />}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}