export default function PromotionBanner({ promotion }) {
    if (!promotion || !promotion.is_active) {
        return null;
    }

    return (
        <section className="w-full">
            <div className="relative overflow-hidden">
                {promotion.image && (
                    <img
                        src={`/storage/${promotion.image}`}
                        alt={promotion.title}
                        className="h-32 w-full object-cover sm:h-40 md:h-48"
                    />
                )}

                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <h2 className="px-4 text-center font-archivo text-xl font-bold uppercase text-white drop-shadow-lg sm:text-2xl md:text-3xl">
                        {promotion.title}
                    </h2>
                </div>
            </div>
        </section>
    );
}