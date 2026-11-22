import React, { Component } from 'react';

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Unhandled React Error:', error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-white px-4 py-16 text-center font-sans">
                    <div className="max-w-md w-full border border-stone-200 p-8 rounded-none">
                        <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-none bg-stone-100 text-black font-semibold text-base border border-stone-300">
                            !
                        </div>
                        <h2 className="text-xl font-bold tracking-tight text-black mb-2 uppercase">
                            Une erreur est survenue
                        </h2>
                        <p className="text-xs text-stone-600 mb-6 leading-relaxed">
                            Une anomalie inattendue a été rencontrée. Vous pouvez recharger la page ou revenir à l'accueil.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={this.handleReload}
                                className="px-5 py-2.5 text-xs font-medium tracking-wide uppercase bg-black text-white hover:bg-stone-800 transition-colors"
                            >
                                Recharger
                            </button>
                            <button
                                onClick={this.handleGoHome}
                                className="px-5 py-2.5 text-xs font-medium tracking-wide uppercase border border-black text-black bg-transparent hover:bg-stone-50 transition-colors"
                            >
                                Accueil
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
