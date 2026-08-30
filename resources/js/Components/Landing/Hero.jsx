import { motion } from 'framer-motion';
import { ArrowRight, Flame } from 'lucide-react';

export default function Hero() {
    const customEase = [0.16, 1, 0.3, 1];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.1 },
        },
    };

    const fadeSlideLeft = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.7, ease: customEase },
        },
    };

    // Animation ZOOM IN progressive pour l'image 2.png
    const imageZoomIn = {
        hidden: {
            opacity: 0,
            scale: 0.3 // Part d'une petite taille
        },
        visible: {
            opacity: 1,
            scale: 1, // Zoom jusqu'à la taille réelle
            transition: {
                duration: 1.3,
                delay: 0.2,
                ease: [0.215, 0.61, 0.355, 1] // Easing très fluide pour l'effet Zoom
            },
        },
    };

    return (
        <section className="relative w-full h-auto min-h-[480px] lg:min-h-screen flex items-center bg-white lg:bg-slate-950 text-slate-900 p-0 m-0 pt-4 lg:pt-20 overflow-hidden select-none">

            {/* Background Image (Desktop Only) */}
            <motion.img
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 0.12, scale: 1, y: [0, 8, 0] }}
                transition={{
                    scale: { duration: 1.5 },
                    opacity: { duration: 1.5 },
                    y: { duration: 4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
                }}
                src="/images/1.jpg"
                alt="Gym Background"
                className="hidden lg:block absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
            />

            {/* White Left Diagonal Cut (Desktop Only) */}
            <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                transition={{ duration: 1, ease: customEase }}
                className="hidden lg:block absolute inset-0 bg-white z-10 pointer-events-none shadow-2xl"
                style={{ clipPath: 'polygon(0 0, 52% 0, 36% 100%, 0 100%)' }}
            />

            {/* Content Layer (Left Aligned Text & Button) */}
            <div className="relative z-40 w-full max-w-7xl mx-auto flex items-center justify-start px-4 sm:px-8 lg:px-12 pointer-events-none py-6 lg:py-0">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-7/12 sm:w-1/2 lg:w-full lg:max-w-xl text-slate-900 pointer-events-auto flex flex-col items-start"
                >
                    {/* Badge */}
                    <motion.div
                        variants={fadeSlideLeft}
                        className="mb-2 sm:mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-lime-400 text-[10px] sm:text-xs md:text-sm font-black tracking-widest uppercase shadow-xl"
                    >
                        <Flame className="w-3.5 h-3.5 fill-lime-400" />
                        <span>FIT YOUNESS</span>
                    </motion.div>

                    {/* Titre */}
                    <motion.h1
                        variants={fadeSlideLeft}
                        className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter italic leading-[0.95] mb-2 sm:mb-4"
                    >
                        TRANSFORME. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-600 to-emerald-600">
                            DÉPASSE-TOI.
                        </span> <br />
                        RÉUSSIS.
                    </motion.h1>

                    {/* Mots-Clés */}
                    <motion.p
                        variants={fadeSlideLeft}
                        className="text-slate-700 font-extrabold text-[10px] sm:text-xs md:text-base uppercase tracking-wider mb-4 sm:mb-8"
                    >
                        Coaching Sur-Mesure • Nutrition • Suivi 24/7
                    </motion.p>

                    {/* Bouton */}
                    <motion.div variants={fadeSlideLeft} className="w-full sm:w-auto">
                        <motion.a
                            href="#contact"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="
                                relative
                                inline-flex
                                items-center
                                justify-center
                                gap-2 sm:gap-3
                                px-5 py-3 sm:px-9 sm:py-4.5
                                bg-lime-400
                                text-slate-950
                                font-black
                                text-xs sm:text-base md:text-lg
                                uppercase
                                tracking-wider
                                rounded-xl sm:rounded-2xl
                                shadow-[0_0_25px_rgba(163,230,53,0.6)]
                                hover:shadow-[0_0_45px_rgba(163,230,53,0.85)]
                                transition-all
                                duration-300
                                cursor-pointer
                                group
                                overflow-hidden
                            "
                        >
                            <span className="relative z-10">DÉMARRER</span>
                            <ArrowRight className="relative z-10 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                            <span className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </motion.a>
                    </motion.div>
                </motion.div>
            </div>

            {/* Container Image 2.png - Zoom In Animation */}
            <div className="absolute inset-0 right-0 z-30 flex items-center justify-end lg:justify-center pointer-events-none">
                <motion.div
                    variants={imageZoomIn}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div
                        animate={{ y: [0, -12, 0] }}
                        transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                        className="relative w-[75vw] sm:w-[60vw] md:w-[48vw] max-w-[550px] aspect-square drop-shadow-2xl"
                    >
                        <img
                            src="/images/2.png"
                            alt="Coach"
                            className="w-full h-full object-cover object-center select-none"
                        />
                    </motion.div>
                </motion.div>
            </div>

            {/* LIME GREEN SLASHES (Desktop Only) */}
            <motion.div
                initial={{ y: '-100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
                className="hidden lg:block absolute inset-0 bg-lime-400 z-20 pointer-events-none"
                style={{
                    clipPath: 'polygon(46.5% 0, 47.5% 0, 41% 40%, 40% 40%)',
                    WebkitMaskImage:
                        'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0) 40%)',
                    maskImage:
                        'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0) 40%)',
                }}
            />

            <motion.div
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
                className="hidden lg:block absolute inset-0 bg-lime-400 z-20 pointer-events-none"
                style={{
                    clipPath: 'polygon(38.5% 55%, 39.5% 55%, 32.5% 100%, 31.5% 100%)',
                    WebkitMaskImage:
                        'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 55%, rgba(0,0,0,0.1) 85%, rgba(0,0,0,0) 100%)',
                    maskImage:
                        'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 55%, rgba(0,0,0,0.1) 85%, rgba(0,0,0,0) 100%)',
                }}
            />

            <motion.div
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="hidden lg:block absolute inset-0 bg-lime-400 z-20 pointer-events-none origin-top"
                style={{
                    clipPath: 'polygon(49% 0, 52% 0, 37% 100%, 34% 100%)',
                    WebkitMaskImage:
                        'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 5%, rgba(0,0,0,0.1) 85%, rgba(0,0,0,0) 100%)',
                    maskImage:
                        'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 5%, rgba(0,0,0,0.1) 85%, rgba(0,0,0,0) 100%)',
                }}
            />

            <motion.div
                initial={{ y: '-100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
                className="hidden lg:block absolute inset-0 bg-lime-400 z-10 pointer-events-none"
                style={{
                    clipPath: 'polygon(53.5% 0, 54.5% 0, 48% 45%, 47% 45%)',
                    WebkitMaskImage:
                        'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.1) 35%, rgba(0,0,0,0) 45%)',
                    maskImage:
                        'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.1) 35%, rgba(0,0,0,0) 45%)',
                }}
            />

        </section>
    );
}