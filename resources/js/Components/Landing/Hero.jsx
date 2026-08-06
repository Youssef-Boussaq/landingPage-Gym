import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
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
        <section className="relative flex h-screen min-h-[650px] w-full items-center justify-center overflow-hidden bg-[#0A0B0D] text-white md:items-end md:justify-start">
            
           

            {/* Full-width Edge-to-Edge Gymshark-style Video */}
            <video
                className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden object-cover object-center"
                src="/images/Hero.mp4"
                poster="https://assets.mixkit.co/videos/47760/47760-thumb-360-3.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="none"
            />

            {/* Gymshark Overlay */}
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:bg-gradient-to-tr md:from-black/85 md:via-black/30 md:to-transparent" />

            {/* Main Content — Bottom-Left Framed */}
            <div className="relative z-20 w-full max-w-2xl px-6 pb-12 pt-20 text-center md:mx-0 md:px-0 md:pb-14 md:pl-10 md:text-left lg:pl-16">
                
                {/* Badge */}
                <div className="font-inter mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-[#9de500]/40 bg-[#9de500]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#9de500] backdrop-blur-md md:mx-0">
                    <ShieldCheck className="h-4 w-4" />
                    <span>100% Custom Online Coaching</span>
                </div>

                {/* Main Title */}
                <h1 className="font-archivo text-5xl uppercase leading-none tracking-tight text-white drop-shadow-md sm:text-6xl md:text-5xl lg:text-6xl">
                    FIT YOUNESS
                </h1>

                {/* Body Copy */}
                <p className="font-inter font-regular mx-auto mt-4 max-w-lg text-base leading-relaxed text-gray-200 drop-shadow sm:text-lg md:mx-0">
                    Transform your physique and push your limits no matter where
                    you are. Get a custom training and nutrition plan tailored
                    to your lifestyle and goals.
                </p>

                {/* Action Button */}
                <div className="mt-6 flex justify-center md:justify-start">
                    <a
                        href="#lead-capture"
                        className="font-inter group inline-flex items-center justify-center gap-3 rounded-full bg-[#9de500] px-8 py-4 text-sm font-bold uppercase tracking-wider text-black transition-all duration-300 hover:scale-105 hover:bg-[#8cd000] hover:shadow-[0_0_25px_rgba(157,229,0,0.5)] focus:outline-none sm:text-base"
                    >
                        <span>START NOW</span>
                        <Zap className="h-4 w-4 fill-black transition-transform duration-300 group-hover:rotate-12 group-hover:scale-125" />
                    </a>
                </div>
            </div>
        </section>
    );
}