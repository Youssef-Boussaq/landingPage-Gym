import React from 'react';
import PhaseBadges from './PhaseBadges';
import PhaseSocialProof from './PhaseSocialProof';
import { PHASES } from './aboutCoachData';

export default function PhaseContent({ phase, onBookCall }) {
    const data = PHASES[phase];

    if (!data) {
        return null;
    }

    return (
        <div
            className={`
                text-phase-${phase}
                absolute inset-0
                flex flex-col justify-center
                gap-1.5 sm:gap-3.5
                opacity-0
                will-change-[transform,opacity]
            `}
        >
            {/* 1. Phase Indicator at the top */}
            <div className="flex items-center gap-1.5 shrink-0">
                <span
                    className="
                        font-mono
                        text-[9px]
                        sm:text-xs
                        font-bold
                        uppercase
                        tracking-wider
                        text-[var(--color-primary-dark)]
                        px-2
                        py-0.5
                        rounded-full
                        bg-[var(--color-primary)]/10
                        border
                        border-[var(--color-primary)]/30
                        select-none
                    "
                >
                    PHASE 0{phase}
                </span>

                <span className="hidden sm:inline-block text-xs font-semibold text-zinc-300 select-none">
                    •
                </span>

                <span
                    className="
                        text-[9px]
                        sm:text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                        text-zinc-500
                        truncate
                        select-none
                    "
                >
                    {data.label}
                </span>
            </div>

            {/* 2. Title below it */}
            <h2
                className="
                    text-[21px]
                    font-black
                    uppercase
                    italic
                    leading-[0.9]
                    tracking-[-0.06em]
                    font-archivo
                    text-zinc-950
                    sm:text-4xl
                    lg:text-5xl
                    sm:leading-[0.95]
                    sm:tracking-tight
                "
            >
                <span>{data.titleLine1}</span>
                {data.titleLine2 && (
                    <>
                        <br />
                        <span className="text-zinc-800">{data.titleLine2}</span>
                    </>
                )}
            </h2>

            {/* 3. Description below title */}
            <p
                className="
                    text-[10px]
                    font-medium
                    leading-[1.38]
                    text-zinc-600
                    sm:text-sm
                    lg:text-base
                    sm:font-normal
                    sm:leading-relaxed
                "
            >
                {data.description}
            </p>

            {/* 4. Badges below description */}
            {data.badgeItems && data.badgeItems.length > 0 && (
                <div className={`badge-phase-${phase} will-change-[transform,opacity]`}>
                    <PhaseBadges items={data.badgeItems} />
                </div>
            )}

            {/* 5. Social proof below badges */}
            {data.socialProof && (
                <PhaseSocialProof data={data.socialProof} />
            )}

            {/* 6. CTA below when available */}
            {data.cta && (
                <div className="pt-0.5 sm:pt-1">
                    <button
                        type="button"
                        id={`phase-cta-btn-${phase}`}
                        onClick={onBookCall}
                        className="
                            inline-flex
                            items-center
                            justify-center
                            px-3
                            py-1.5
                            sm:px-5
                            sm:py-2.5
                            rounded-md
                            sm:rounded-lg
                            bg-zinc-950
                            hover:bg-zinc-800
                            text-white
                            font-bold
                            text-[10px]
                            sm:text-xs
                            uppercase
                            tracking-wider
                            transition-all
                            duration-200
                            cursor-pointer
                            pointer-events-auto
                            shadow-xs
                            hover:shadow-sm
                        "
                    >
                        {data.cta}
                    </button>
                </div>
            )}
        </div>
    );
}
