import React from 'react';

export default function FilterButton({ active, onClick, icon: Icon, label, activeColorClass = "bg-primary/10 border-primary text-primary" }) {
    const baseStyle = "flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer";
    const inactiveStyle = "border-slate-200 text-slate-600 hover:bg-slate-50";

    return (
        <button
            type="button"
            onClick={onClick}
            className={`${baseStyle} ${active ? activeColorClass : inactiveStyle}`}
        >
            {Icon && <Icon className={`w-3.5 h-3.5 ${active ? 'fill-current' : 'text-slate-400'}`} />}
            <span>{label}</span>
        </button>
    );
}