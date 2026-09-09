import { useEffect, useRef } from 'react';

export function useReveal(options = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }) {
    const ref = useRef(null);

    useEffect(() => {
        const currentRef = ref.current;
        if (!currentRef) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        }, options);

        observer.observe(currentRef);

        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, [options.threshold, options.rootMargin]);

    return ref;
}
