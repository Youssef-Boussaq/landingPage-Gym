import React from 'react';

export default function PriceFilter({ value, onChange, onCommit }) {
    return (
        <div className="space-y-2.5">
            <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Prix maximum</label>
                <span className="px-2 py-0.5 bg-slate-900 text-primary text-xs font-black rounded-md">
                    {value} €
                </span>
            </div>

            <input
                type="range"
                min="10"
                max="500"
                step="5"
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                onMouseUp={onCommit}
                onTouchEnd={onCommit}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />

            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                <span>10 €</span>
                <span>250 €</span>
                <span>500 €</span>
            </div>
        </div>
    );
}