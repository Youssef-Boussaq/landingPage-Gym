import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { router } from '@inertiajs/react';

// Register GSAP plugin safely
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScroll({ children }) {
    useEffect(() => {
        let lenis = null;
        let updateTicker = null;

        // Respect prefers-reduced-motion for smooth scrolling
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!prefersReducedMotion) {
            // Initialize Lenis
            lenis = new Lenis({
                duration: 1.1,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                smoothWheel: true,
                touchMultiplier: 1.5,
            });

            // Synchronize Lenis with GSAP ScrollTrigger
            lenis.on('scroll', ScrollTrigger.update);

            updateTicker = (time) => {
                lenis.raf(time * 1000);
            };

            gsap.ticker.add(updateTicker);
            gsap.ticker.lagSmoothing(0);
        }

        // Auto-scroll to top on every navigation
        const handleScrollToTop = () => {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;

            if (lenis) {
                lenis.scrollTo(0, { immediate: true });
            }

            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 60);
        };

        const removeNavigateListener = router.on('navigate', handleScrollToTop);
        const removeFinishListener = router.on('finish', handleScrollToTop);

        return () => {
            removeNavigateListener();
            removeFinishListener();
            if (updateTicker) {
                gsap.ticker.remove(updateTicker);
            }
            if (lenis) {
                lenis.destroy();
            }
        };
    }, []);

    return <>{children}</>;
}
