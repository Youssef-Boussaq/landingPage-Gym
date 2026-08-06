import { useState, useEffect, useRef } from 'react';

export default function CountUp({ end, suffix = '', duration = 2000 }) {
    const [count, setCount] = useState(0);
    const elementRef = useRef(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        let animationFrameId;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    let startTime = null;

                    const animate = (currentTime) => {
                        if (!startTime) startTime = currentTime;
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        
                        // Smooth ease-out quadratic curve
                        const easeOutQuad = progress * (2 - progress);
                        setCount(Math.floor(easeOutQuad * end));

                        if (progress < 1) {
                            animationFrameId = requestAnimationFrame(animate);
                        }
                    };

                    animationFrameId = requestAnimationFrame(animate);
                }
            },
            { threshold: 0.1 }
        );

        const currentRef = elementRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) observer.unobserve(currentRef);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [end, duration]);

    return <span ref={elementRef}>{count}{suffix}</span>;
}