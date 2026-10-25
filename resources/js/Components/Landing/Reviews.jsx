import { Star } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';
import { cn } from '@/lib/utils';

function ReviewCard({ review, className }) {
    const rating      = Math.min(5, Math.max(1, Number(review.rating) || 5));
    const initial     = (review.name || '?').charAt(0).toUpperCase();
    const hasAvatar   = Boolean(review.avatar);

    return (
        <div className={cn(
            "bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
            "transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]",
            className
        )}>
            {/* Star rating */}
            <div className="flex items-center gap-1 mb-4" aria-label={`${rating} out of 5 stars`}>
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={cn(
                            "w-4 h-4",
                            i < rating
                                ? "fill-[var(--color-primary-dark)] text-[var(--color-primary-dark)]"
                                : "fill-slate-200 text-slate-200"
                        )}
                        aria-hidden="true"
                    />
                ))}
            </div>

            {/* Review text — dir="auto" handles Arabic RTL naturally */}
            <p
                className="text-slate-600 text-sm sm:text-base italic mb-6 leading-relaxed"
                dir="auto"
                lang={/[\u0600-\u06FF]/.test(review.text || '') ? 'ar' : undefined}
            >
                &ldquo;{review.text}&rdquo;
            </p>

            {/* Reviewer */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-900 overflow-hidden shrink-0">
                    {hasAvatar ? (
                        <img
                            src={review.avatar}
                            alt={review.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <span aria-hidden="true">{initial}</span>
                    )}
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 text-sm">{review.name}</h4>
                    {review.role && (
                        <p className="text-xs text-slate-500">{review.role}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * Reviews / Testimonials landing section.
 * Receives `reviews` (array from DB) and `sectionConfig` (eyebrow/heading).
 */
export default function Reviews({ reviews = [], sectionConfig = {} }) {
    const titleRef = useReveal();
    const gridRef  = useReveal();

    const eyebrow = sectionConfig.eyebrow ?? 'Success Stories';
    const heading = sectionConfig.heading ?? 'What Clients Say';

    // Graceful fallback preserving original Arabic testimonials
    const items = reviews.length > 0 ? reviews : [
        { id: 1, name: 'Amine B.',    role: 'Weight Loss Program', rating: 5, text: 'مدرب محترف، متمكن وملتزم. ساعدني على تجاوز مراحل الثبات في تطوري بطريقة آمنة وفعالة.' },
        { id: 2, name: 'Sarah M.',    role: 'Muscle Building',     rating: 5, text: 'لم أشعر بالقوة بهذا الشكل من قبل. اهتمامه بأدق تفاصيل أدائي وتحفيزه المستمر ساعداني على الاستمرار حتى عندما كنت أفكر في الاستسلام. أنصح به بشدة! ' },
        { id: 3, name: 'Youssef T.', role: 'Weight Loss Program', rating: 5, text: 'مدرب رائع! خسرت 15 كيلوغرامًا خلال 3 أشهر. كانت الخطة الغذائية سهلة التطبيق، والتمارين مصممة بشكل مثالي لتناسب مستواي.' },
    ];

    return (
        <section id="testimonials" className="py-16 lg:py-28 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div ref={titleRef} className="reveal-up text-center max-w-2xl mx-auto mb-12 lg:mb-20">
                    <h2 className="text-sm font-bold text-[var(--color-primary-dark)] uppercase tracking-widest mb-2">
                        {eyebrow}
                    </h2>
                    <h3 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase italic tracking-tight">
                        {heading}
                    </h3>
                </div>

                <div ref={gridRef} className="reveal-group grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {items.map((review, idx) => (
                        <div key={review.id ?? idx} className={`reveal-up reveal-item delay-${(idx + 1) * 100}`}>
                            <ReviewCard review={review} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
