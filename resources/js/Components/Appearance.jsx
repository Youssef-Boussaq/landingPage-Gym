import { useEffect } from 'react';

export default function AppearanceProvider({
    appearance,
    children,
}) {
    useEffect(() => {
        const root = document.documentElement;

        root.style.setProperty(
            '--color-primary',
            appearance?.primary || '#9de500'
        );

        root.style.setProperty(
            '--color-primary-hover',
            appearance?.primary_hover || '#8cd000'
        );

        root.style.setProperty(
            '--color-primary-dark',
            appearance?.primary_dark || '#7ec000'
        );

        root.style.setProperty(
            '--color-primary-light',
            appearance?.primary_light || '#b8f526'
        );
    }, [appearance]);

    return children;
}