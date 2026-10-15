import { useState, useEffect, useRef } from 'react';

export default function HighlightItem({ icon: Icon, text, delay = 0 }) {
    const [isVisible, setIsVisible] = useState(false);
    const itemRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.15 }
        );

        const currentRef = itemRef.current;
        if (currentRef) observer.observe(currentRef);
        
        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, []);

    return (
        <li
            ref={itemRef}
            style={{ transitionDelay: `${delay}ms` }}
            className={`group flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm transition-all duration-700 transform ${
                isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-6'
            } hover:border-[var(--color-primary)] hover:shadow-md hover:translate-x-1.5`}
        >
            {/* Custom Icon Container */}
            <div className="flex items-center justify-center p-2.5 rounded-xl bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/40 text-slate-900 shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:bg-[var(--color-primary)]">
                <Icon className="h-5 w-5" />
            </div>

            {/* Text */}
            <span className="text-slate-700 font-medium text-sm sm:text-base leading-relaxed group-hover:text-slate-900 transition-colors">
                {text}
            </span>
        </li>
    );
}