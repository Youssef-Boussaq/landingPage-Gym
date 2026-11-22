import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function SplitText({
    text = '',
    className = '',
    delay = 0.1,
    duration = 0.7,
    stagger = 0.02,
    splitBy = 'chars', // 'chars' | 'words'
    ease = 'power3.out',
    as: Component = 'span',
}) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current || !text) return;

        // Respect prefers-reduced-motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            return;
        }

        const elements = containerRef.current.querySelectorAll('.split-item');
        if (elements.length === 0) return;

        gsap.set(elements, {
            opacity: 0,
            y: 28,
            willChange: 'transform, opacity',
        });

        const tween = gsap.to(elements, {
            opacity: 1,
            y: 0,
            duration: duration,
            stagger: stagger,
            delay: delay,
            ease: ease,
            clearProps: 'willChange',
        });

        return () => {
            tween.kill();
        };
    }, [text, delay, duration, stagger, ease, splitBy]);

    if (!text) return null;

    const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        return <Component className={className}>{text}</Component>;
    }

    if (splitBy === 'words') {
        const words = text.split(' ');
        return (
            <Component ref={containerRef} className={`inline-block ${className}`} aria-label={text}>
                {words.map((word, wordIndex) => (
                    <span
                        key={wordIndex}
                        className="split-item inline-block whitespace-nowrap"
                        aria-hidden="true"
                    >
                        {word}
                        {wordIndex < words.length - 1 && '\u00A0'}
                    </span>
                ))}
            </Component>
        );
    }

    // Default: split by characters, grouped by words to prevent awkward line breaks
    const words = text.split(' ');
    return (
        <Component ref={containerRef} className={`inline-block ${className}`} aria-label={text}>
            {words.map((word, wordIdx) => (
                <span key={wordIdx} className="inline-block whitespace-nowrap" aria-hidden="true">
                    {word.split('').map((char, charIdx) => (
                        <span
                            key={charIdx}
                            className="split-item inline-block"
                            style={{ display: 'inline-block' }}
                        >
                            {char}
                        </span>
                    ))}
                    {wordIdx < words.length - 1 && (
                        <span className="inline-block">&nbsp;</span>
                    )}
                </span>
            ))}
        </Component>
    );
}
