import React, { useState } from 'react';
import { Laptop, Tablet, Smartphone, Maximize2, Minimize2 } from 'lucide-react';
import Hero from '@/Components/Landing/Hero';

export default function HeroPreviewCanvas({ config = {}, title = 'Aperçu en direct' }) {
    const [device, setDevice] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
    const [isExpanded, setIsExpanded] = useState(false);

    const frameClass = {
        desktop: 'fy-hero-editor__frame--desktop',
        tablet: 'fy-hero-editor__frame--tablet',
        mobile: 'fy-hero-editor__frame--mobile',
    }[device];

    return (
        <div className={`fy-hero-editor__canvas-wrapper ${isExpanded ? 'fixed inset-4 z-50 bg-slate-900/40 backdrop-blur-md p-6 overflow-y-auto' : ''}`}>
            {/* Device Switcher & Controls */}
            <div className="fy-hero-editor__device-bar">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                        {title}
                    </span>
                    <span className="hidden sm:inline-block text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                        {device === 'desktop' && '1280 px'}
                        {device === 'tablet' && '768 px'}
                        {device === 'mobile' && '375 px'}
                    </span>
                </div>

                <div className="fy-hero-editor__device-buttons">
                    <button
                        type="button"
                        onClick={() => setDevice('desktop')}
                        className={`fy-hero-editor__device-btn ${device === 'desktop' ? 'fy-hero-editor__device-btn--active' : ''}`}
                        title="Vue Ordinateur (1280px)"
                    >
                        <Laptop size={15} />
                        <span className="hidden sm:inline">Desktop</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setDevice('tablet')}
                        className={`fy-hero-editor__device-btn ${device === 'tablet' ? 'fy-hero-editor__device-btn--active' : ''}`}
                        title="Vue Tablette (768px)"
                    >
                        <Tablet size={15} />
                        <span className="hidden sm:inline">Tablette</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setDevice('mobile')}
                        className={`fy-hero-editor__device-btn ${device === 'mobile' ? 'fy-hero-editor__device-btn--active' : ''}`}
                        title="Vue Mobile (375px)"
                    >
                        <Smartphone size={15} />
                        <span className="hidden sm:inline">Mobile</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                        title={isExpanded ? 'Réduire' : 'Plein écran'}
                    >
                        {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </button>
                </div>
            </div>

            {/* Viewport Render Area */}
            <div className="fy-hero-editor__viewport-container">
                <div className={`fy-hero-editor__frame ${frameClass}`}>
                    <Hero config={config} isPreview={true} />
                </div>
            </div>
        </div>
    );
}
