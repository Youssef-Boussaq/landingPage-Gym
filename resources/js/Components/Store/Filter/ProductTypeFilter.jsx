import React from 'react';
import { Package, Download, Box } from 'lucide-react';

export default function ProductTypeFilter({ type, onChange }) {
    const types = [
        { id: 'all', label: 'Tous', icon: Box },
        { id: 'physical', label: 'Physique', icon: Package },
        { id: 'digital', label: 'Numérique', icon: Download },
    ];

    return (
        <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Type de produit</label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
                {types.map((item) => {
                    const Icon = item.icon;
                    const isActive = type === item.id;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => onChange(item.id)}
                            className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-xs font-bold transition-all ${
                                isActive
                                    ? 'bg-white text-slate-900 shadow-xs'
                                    : 'text-slate-500 hover:text-slate-900'
                            }`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}