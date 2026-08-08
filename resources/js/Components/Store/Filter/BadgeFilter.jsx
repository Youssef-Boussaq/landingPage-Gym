import React from 'react';
import { Sparkles, Flame } from 'lucide-react';
import FilterButton from './FilterButton';

export default function BadgeFilter({ trending, topSeller, onToggleTrending, onToggleTopSeller }) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Badges & Tendances</label>
            <div className="grid grid-cols-2 gap-2">
                <FilterButton
                    active={trending}
                    onClick={onToggleTrending}
                    icon={Sparkles}
                    label="Tendances"
                    activeColorClass="bg-amber-500/10 border-amber-500/40 text-amber-600 shadow-sm"
                />
                <FilterButton
                    active={topSeller}
                    onClick={onToggleTopSeller}
                    icon={Flame}
                    label="Top Ventes"
                    activeColorClass="bg-rose-500/10 border-rose-500/40 text-rose-600 shadow-sm"
                />
            </div>
        </div>
    );
}