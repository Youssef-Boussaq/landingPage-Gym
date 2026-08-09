import { useEffect, useState } from 'react';
import { Zap, ShieldCheck } from 'lucide-react';

export default function Hero({ user: customUser }) {
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReduced(mq.matches);
        const handler = (e) => setReduced(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    return (
        /* Section Plein Écran (100% de la largeur du navigateur) */
        <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden bg-[#0A0B0D] text-white">

            {/* Vidéo Full Bleed (du bord gauche au bord droit) */}
            <video
                className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-center"
                src="/images/Hero.mp4"
                poster="https://assets.mixkit.co/videos/47760/47760-thumb-360-3.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="none"
            />

            {/* Dégradé sombre pour la lisibilité */}
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

            {/* Contenu aligné en bas à gauche sur la grille du site */}
            <div className="relative z-20 flex h-full w-full items-end pb-12 pt-20">
                <div className="mx-auto w-full max-w-7xl px-6 lg:px-12">
                    <div className="max-w-xl text-left">

                        {/* Badge */}
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#9de500]/40 bg-[#9de500]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#9de500] backdrop-blur-md">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            <span>100% Custom Online Coaching</span>
                        </div>

                        {/* Titre */}
                        <h1 className="font-archivo text-5xl uppercase leading-none tracking-tight text-white drop-shadow-md sm:text-6xl lg:text-7xl">
                            FIT YOUNESS
                        </h1>

                        {/* Paragraphe */}
                        <p className="font-inter mt-4 text-base leading-relaxed text-gray-200 drop-shadow sm:text-lg">
                            Transform your physique and push your limits no matter where
                            you are. Get a custom training and nutrition plan tailored
                            to your lifestyle and goals.
                        </p>

                        {/* Bouton */}
                        <div className="mt-6">
                            <a
                                href="#lead-capture"
                                className="font-inter group inline-flex items-center justify-center gap-3 rounded-full bg-[#9de500] px-8 py-4 text-xs font-bold uppercase tracking-wider text-black transition-all duration-300 hover:scale-105 hover:bg-[#8cd000] hover:shadow-[0_0_25px_rgba(157,229,0,0.5)] focus:outline-none sm:text-sm"
                            >
                                <span>START NOW</span>
                                <Zap className="h-4 w-4 fill-black transition-transform duration-300 group-hover:rotate-12 group-hover:scale-125" />
                            </a>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}