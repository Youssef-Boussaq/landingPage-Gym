import { useEffect } from 'react';

export default function AppearanceProvider({
    appearance,
    children,
}) {
    useEffect(() => {
        const root = document.documentElement;

        root.style.setProperty(
            '--color-primary',
            appearance?.primary || 'var(--color-primary)'
        );

        root.style.setProperty(
            '--color-primary-hover',
            appearance?.primary_hover || 'var(--color-primary-hover)'
        );

        root.style.setProperty(
            '--color-primary-dark',
            appearance?.primary_dark || 'var(--color-primary-dark)'
        );

        root.style.setProperty(
            '--color-primary-light',
            appearance?.primary_light || 'var(--color-primary-light)'
        );
    }, [appearance]);

    return children;
}