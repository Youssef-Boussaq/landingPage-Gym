import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import MegaMenu from '../MegaMenu';

export default function DesktopNavigation({ categories = [] }) {
    const [activeCategory, setActiveCategory] = useState(null);

    const isOpen = (category) => activeCategory?.id === category.id;

    const handleCategoryClick = (event, category) => {
        if (window.innerWidth < 1024) {
            event.preventDefault();
            setActiveCategory((current) =>
                current?.id === category.id ? null : category
            );
        }
    };

    const handleMouseEnter = (category) => {
        if (window.innerWidth >= 1024) {
            setActiveCategory(category);
        }
    };

    const handleMouseLeave = () => {
        if (window.innerWidth >= 1024) {
            setActiveCategory(null);
        }
    };

    return (
        <nav
            aria-label="Navigation principale"
            className="hidden h-full items-center gap-1 md:flex lg:gap-2"
            onMouseLeave={handleMouseLeave}
        >
            {categories.map((category) => {
                const active = isOpen(category);
                const hasChildren = category.children?.length > 0;

                return (
                    <div
                        key={category.id}
                        className="relative flex h-full items-center"
                        onMouseEnter={() => handleMouseEnter(category)}
                    >
                        <Link
                            href={route('store.index', {
                                category: category.slug,
                            })}
                            onClick={(event) =>
                                handleCategoryClick(event, category)
                            }
                            aria-expanded={hasChildren ? active : undefined}
                            aria-haspopup={hasChildren ? 'true' : undefined}
                            className={`
                                group relative flex h-full items-center gap-1.5 px-3 py-3
                                text-[12px] font-medium tracking-[0.025em] uppercase transition-opacity duration-150
                                ${active
                                    ? 'text-black font-bold'
                                    : 'text-black hover:opacity-60'
                                }
                            `}
                        >
                            <span>{category.name}</span>

                            {hasChildren && (
                                <ChevronDown
                                    className={`
                                        h-3.5 w-3.5 text-black transition-transform duration-200 ease-out
                                        ${active ? 'rotate-180' : ''}
                                    `}
                                />
                            )}

                            {/* Hairline indication line */}
                            <span
                                className={`
                                    absolute bottom-0 left-0 h-[1.5px] w-full bg-black
                                    transition-all duration-200 ease-out
                                    ${active
                                        ? 'scale-x-100 opacity-100'
                                        : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100'
                                    }
                                `}
                            />
                        </Link>

                        {/* Menu déroulant MegaMenu */}
                        {active && <MegaMenu category={category} />}
                    </div>
                );
            })}

            {/* Lien d'exploration générale */}
            <div className="relative flex h-full items-center ml-1">
                <Link
                    href={route('store.index')}
                    className="
                        group relative flex h-full items-center px-3.5 py-5
                        text-sm font-semibold tracking-wide text-slate-600
                        transition-colors duration-200 hover:text-slate-950
                    "
                >
                    <span>Explore</span>
                    <span className="absolute bottom-0 left-0 h-[2.5px] w-full scale-x-0 rounded-full bg-[var(--color-primary)] opacity-0 transition-all duration-200 group-hover:scale-x-100 group-hover:opacity-100" />
                </Link>
            </div>
        </nav>
    );
}