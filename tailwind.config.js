import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'Favorit', ...defaultTheme.fontFamily.sans],
                favorit: ['Favorit', 'Inter', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                // Adanola Design System Color Tokens
                'carbon-ink': '#000000',
                'paper-white': '#ffffff',
                'soft-mist': '#e5e7eb',
                'warm-fog': '#f0efe7',
                'blush-sand': '#f5ebd5',
                'smoke-charcoal': '#333333',
                'onyx': '#1d1d1d',
                'stone-gray': '#cccccc',
                'slate-editorial': '#2f3440',
                'olive-drab': '#636355',
                'maroon-clay': '#523037',
                'deep-iris': '#222845',
                'pewter': '#677284',
                'driftwood': '#dfccbe',
                'pale-tide': '#badce4',

                border: 'var(--border, #000000)',
                input: 'var(--input, #e5e7eb)',
                ring: 'var(--ring, #000000)',
                background: 'var(--background, #ffffff)',
                foreground: 'var(--foreground, #000000)',

                primary: {
                    DEFAULT: '#000000',
                    foreground: '#ffffff',
                    hover: '#1d1d1d',
                    dark: '#000000',
                    light: '#333333',
                },
                secondary: {
                    DEFAULT: '#f0efe7',
                    foreground: '#000000',
                },
                destructive: {
                    DEFAULT: '#dc2626',
                    foreground: '#ffffff',
                },
                muted: {
                    DEFAULT: '#e5e7eb',
                    foreground: '#333333',
                },
                accent: {
                    DEFAULT: '#f5ebd5',
                    foreground: '#000000',
                },
                card: {
                    DEFAULT: '#ffffff',
                    foreground: '#000000',
                },
            },
            letterSpacing: {
                tightest: '-0.05em',
                tighter: '-0.025em',
                tight: '0.025em',
                normal: '0.025em',
                wide: '0.05em',
            },
            borderRadius: {
                'none': '0px',
                'sm': '2px',
                'DEFAULT': '4px',
                'md': '4px',
                'lg': '4px',
                'xl': '4px',
                '2xl': '4px',
                '3xl': '4px',
                'full': '9999px',
            },
            boxShadow: {
                'none': 'none',
                'sm': 'none',
                'DEFAULT': 'none',
                'md': 'none',
                'lg': 'none',
                'xl': 'none',
                '2xl': 'none',
            },
        },
    },

    plugins: [forms],
};
