import React from 'react';

export default function CartBadge({
    count = 0,
}) {
    if (count <= 0) {
        return null;
    }

    return (
        <span
            className="
                absolute
                -right-1
                -top-1
                flex
                min-h-5
                min-w-5
                items-center
                justify-center
                rounded-full
                bg-slate-950
                px-1
                text-[10px]
                font-bold
                leading-none
                text-white
                ring-2
                ring-white
            "
        >
            {count > 99 ? '99+' : count}
        </span>
    );
}