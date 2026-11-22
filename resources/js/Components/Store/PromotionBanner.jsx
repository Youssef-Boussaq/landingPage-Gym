import React from 'react';

export default function PromotionBanner({ promotion }) {
    if (!promotion || !promotion.is_active) {
        return null;
    }

    return (
        <section className="w-full">
            <div className="relative overflow-hidden bg-stone-100 rounded-none border-b border-black">
                {promotion.image && (
                    <img
                        src={`/storage/${promotion.image}`}
                        alt={promotion.title}
                        className="h-32 w-full object-cover sm:h-40 md:h-48 rounded-none"
                    />
                )}

                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <h2 className="px-4 text-center font-sans text-lg sm:text-2xl font-normal uppercase tracking-[0.05em] text-white">
                        {promotion.title}
                    </h2>
                </div>
            </div>
        </section>
    );
}
