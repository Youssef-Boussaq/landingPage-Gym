import '../css/app.css';
// import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import AppearanceProvider from './Components/AppearanceProvider';
import ErrorBoundary from './Components/ErrorBoundary';
import SmoothScroll from './Components/SmoothScroll';

const appName = import.meta.env.VITE_APP_NAME || 'Fit Youness';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,

    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),

    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ErrorBoundary>
                <AppearanceProvider
                    appearance={props.initialPage.props.appearance}
                >
                    <SmoothScroll>
                        <App {...props} />
                    </SmoothScroll>
                </AppearanceProvider>
            </ErrorBoundary>
        );
    },

    progress: {
        color: '#4B5563',
    },
});