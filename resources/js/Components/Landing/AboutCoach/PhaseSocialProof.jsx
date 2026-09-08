import React from 'react';

const FALLBACK_AVATAR =
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop';

export default function PhaseSocialProof({ data }) {
    if (!data) {
        return null;
    }

    return (
        <div className="flex items-center gap-2 sm:gap-3 pt-0.5 sm:pt-2">
            {/* Avatars */}
            <div className="flex items-center shrink-0">
                {data.avatars.map((avatar, index) => (
                    <img
                        key={`${avatar}-${index}`}
                        src={avatar}
                        alt=""
                        width="32"
                        height="32"
                        loading="lazy"
                        decoding="async"
                        draggable="false"
                        onError={(e) => {
                            const img = e.currentTarget;
                            if (!img.dataset.fallback) {
                                img.dataset.fallback = 'true';
                                img.src = FALLBACK_AVATAR;
                            }
                        }}
                        className={`
                            h-6
                            w-6
                            sm:h-8
                            sm:w-8
                            rounded-full
                            border-2
                            border-[#fbfdf7]
                            object-cover
                            shadow-2xs
                            ${index > 0 ? '-ml-1.5 sm:-ml-2' : ''}
                        `}
                    />
                ))}
            </div>

            {/* Social proof label */}
            <div className="flex flex-col leading-none">
                <span
                    className="
                        text-xs
                        sm:text-sm
                        font-black
                        tracking-tight
                        text-zinc-950
                    "
                >
                    {data.value}
                </span>

                <span
                    className="
                        mt-0.5
                        sm:mt-1
                        text-[8px]
                        sm:text-[10px]
                        font-medium
                        uppercase
                        tracking-wider
                        text-zinc-500
                        truncate
                    "
                >
                    {data.label}
                </span>
            </div>
        </div>
    );
}
