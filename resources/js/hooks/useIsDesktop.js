
import { useEffect, useState } from 'react';

export function useIsDesktop() {
    const [isDesktop, setIsDesktop] = useState(() => {
        if (typeof window === 'undefined') {
            return false;
        }

        return window.matchMedia('(min-width: 768px)').matches;
    });

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 768px)');

        const handleChange = (event) => {
            setIsDesktop(event.matches);
        };

        // Synchronize in case the viewport changed before the effect ran
        setIsDesktop(mediaQuery.matches);

        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    return isDesktop;
}

