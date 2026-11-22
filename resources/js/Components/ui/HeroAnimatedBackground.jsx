import React, { useEffect, useRef } from 'react';

export default function HeroAnimatedBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let width = (canvas.width = canvas.parentElement.offsetWidth);
        let height = (canvas.height = canvas.parentElement.offsetHeight);

        const handleResize = () => {
            if (!canvas.parentElement) return;
            width = canvas.width = canvas.parentElement.offsetWidth;
            height = canvas.height = canvas.parentElement.offsetHeight;
        };

        window.addEventListener('resize', handleResize);

        // Ambient particles
        const particleCount = 28;
        const particles = Array.from({ length: particleCount }).map(() => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 1,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            opacity: Math.random() * 0.35 + 0.1,
            pulseSpeed: Math.random() * 0.02 + 0.005,
            phase: Math.random() * Math.PI * 2,
        }));

        let time = 0;

        const render = () => {
            time += 0.01;
            ctx.clearRect(0, 0, width, height);

            // Subtle luminous floating radial glow in top-right and bottom-left
            const g1 = ctx.createRadialGradient(
                width * 0.75 + Math.sin(time * 0.5) * 40,
                height * 0.35 + Math.cos(time * 0.5) * 30,
                10,
                width * 0.75,
                height * 0.35,
                width * 0.45
            );
            g1.addColorStop(0, 'rgba(163, 230, 53, 0.06)'); // subtle lime glow
            g1.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = g1;
            ctx.fillRect(0, 0, width, height);

            const g2 = ctx.createRadialGradient(
                width * 0.2 + Math.cos(time * 0.4) * 30,
                height * 0.7 + Math.sin(time * 0.4) * 30,
                10,
                width * 0.2,
                height * 0.7,
                width * 0.4
            );
            g2.addColorStop(0, 'rgba(255, 255, 255, 0.04)');
            g2.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = g2;
            ctx.fillRect(0, 0, width, height);

            // Draw calm drifting particles
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                const currentOpacity = p.opacity + Math.sin(time * 2 + p.phase) * 0.1;
                ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.05, currentOpacity)})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
            {/* Subtle mesh background base */}
            <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03]" />
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
}
