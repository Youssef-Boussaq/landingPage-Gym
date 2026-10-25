import React, { useState } from 'react';
import { Laptop, Tablet, Smartphone, Maximize2, Minimize2 } from 'lucide-react';
import AboutCoach from '@/Components/Landing/AboutCoach';

/**
 * Live preview canvas for the About section editor.
 * Mirrors the HeroPreviewCanvas pattern exactly.
 */
export default function AboutPreviewCanvas({ config = {}, title = 'Aperçu About en direct' }) {
    const [device, setDevice]       = useState('desktop');
    const [isExpanded, setExpanded] = useState(false);

    const frameClass = {
        desktop: 'fy-hero-editor__frame--desktop',
        tablet:  'fy-hero-editor__frame--tablet',
        mobile:  'fy-hero-editor__frame--mobile',
    }[device];

    return (
        <div className={`fy-hero-editor__canvas-wrapper ${isExpanded ? 'fixed inset-4 z-50 bg-slate-900/40 backdrop-blur-md p-6 overflow-y-auto' : ''}`}>
            {/* Device Bar */}
            <div className="fy-hero-editor__device-bar">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700">{title}</span>
                    <span className="hidden sm:inline-block text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                        {device === 'desktop' && '1280 px'}
                        {device === 'tablet'  && '768 px'}
                        {device === 'mobile'  && '375 px'}
                    </span>
                </div>

                <div className="fy-hero-editor__device-buttons">
                    {[
                        { id: 'desktop', Icon: Laptop,     label: 'Desktop',  title: 'Vue Ordinateur (1280px)' },
                        { id: 'tablet',  Icon: Tablet,     label: 'Tablette', title: 'Vue Tablette (768px)' },
                        { id: 'mobile',  Icon: Smartphone, label: 'Mobile',   title: 'Vue Mobile (375px)' },
                    ].map(({ id, Icon, label, title: t }) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setDevice(id)}
                            className={`fy-hero-editor__device-btn ${device === id ? 'fy-hero-editor__device-btn--active' : ''}`}
                            title={t}
                        >
                            <Icon size={15} />
                            <span className="hidden sm:inline">{label}</span>
                        </button>
                    ))}

                    <button
                        type="button"
                        onClick={() => setExpanded(x => !x)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                        title={isExpanded ? 'Réduire' : 'Plein écran'}
                    >
                        {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </button>
                </div>
            </div>

            {/* Viewport */}
            <div className="fy-hero-editor__viewport-container">
                <div className={`fy-hero-editor__frame ${frameClass}`}>
                    <AboutCoach config={config} />
                </div>
            </div>
        </div>
    );
}
