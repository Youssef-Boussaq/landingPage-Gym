import React from 'react';

export default function PhaseBadges({ items }) {
    if (!items || items.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-1.5 sm:gap-2 text-[9px] sm:text-xs">
            {items.map((item) => {
                const Icon = item.icon;

                return (
                    <span
                        key={item.text}
                        className="
                            inline-flex
                            items-center
                            gap-1
                            sm:gap-1.5
                            px-2
                            py-0.5
                            sm:px-2.5
                            sm:py-1
                            rounded
                            sm:rounded-md
                            bg-white/95
                            border
                            border-zinc-200
                            text-zinc-700
                            font-medium
                            shadow-2xs
                            select-none
                        "
                    >
                        {Icon && (
                            <Icon
                                className={`
                                    w-3
                                    h-3
                                    sm:w-3.5
                                    sm:h-3.5
                                    shrink-0
                                    ${item.accent
                                        ? 'text-[var(--color-primary-dark)]'
                                        : (item.accentClass || 'text-zinc-700')
                                    }
                                `}
                            />
                        )}

                        <span className="whitespace-nowrap">{item.text}</span>
                    </span>
                );
            })}
        </div>
    );
}
