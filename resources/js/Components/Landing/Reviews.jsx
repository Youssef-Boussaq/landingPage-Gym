import { Star } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';
import { cn } from '@/lib/utils';

const REVIEWS = [
    {
        id: 1,
        name: "Amine B.",
        role: "Weight Loss Program",
        rating: 5,
        text: "Incredible coach! I lost 15kg in 3 months. The nutrition plan was easy to follow, and the workouts were perfectly tailored to my level.",
    },
    {
        id: 2,
        name: "Sarah M.",
        role: "Muscle Building",
        rating: 5,
        text: "I've never felt stronger. The attention to detail in my form and the constant motivation kept me going when I wanted to quit. Highly recommended!",
    },
    {
        id: 3,
        name: "Youssef T.",
        role: "Powerlifting prep",
        rating: 5,
        text: "Professional, knowledgeable, and dedicated. He helped me break through my plateaus safely and effectively.",
    }
];

function ReviewCard({ review, className }) {
    return (
        <div className={cn(
            "bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
            "transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]",
            className
        )}>
            <div className="flex items-center gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[var(--color-primary-dark)] text-[var(--color-primary-dark)]" />
                ))}
            </div>

            <p className="text-slate-600 text-sm sm:text-base italic mb-6 leading-relaxed">
                "{review.text}"
            </p>

            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-900">
                    {review.name.charAt(0)}
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 text-sm">{review.name}</h4>
                    <p className="text-xs text-slate-500">{review.role}</p>
                </div>
            </div>
        </div>
    );
}

export default function Reviews() {
    const titleRef = useReveal();
    const gridRef = useReveal();

    return (
        <section id="testimonials" className="py-16 lg:py-28 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div ref={titleRef} className="reveal-up text-center max-w-2xl mx-auto mb-12 lg:mb-20">
                    <h2 className="text-sm font-bold text-[var(--color-primary-dark)] uppercase tracking-widest mb-2">
                        Success Stories
                    </h2>
                    <h3 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase italic tracking-tight">
                        What Clients Say
                    </h3>
                </div>

                <div ref={gridRef} className="reveal-group grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {REVIEWS.map((review, idx) => (
                        <div key={review.id} className={`reveal-up reveal-item delay-${(idx + 1) * 100}`}>
                            <ReviewCard review={review} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
