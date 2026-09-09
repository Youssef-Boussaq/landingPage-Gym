import { useReveal } from '@/Hooks/useReveal';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

const TRANSFORMATIONS = [
    {
        id: 1,
        title: "12 Weeks Transformation",
        program: "Weight Loss Program",
        beforeImg: "/images/user1.jpg",
        afterImg: "/images/user2.jpg",
    },
    {
        id: 2,
        title: "6 Months Progress",
        program: "Muscle Building",
        beforeImg: "/images/user3.jpg",
        afterImg: "/images/user1.jpg",
    },
    {
        id: 3,
        title: "8 Weeks Prep",
        program: "Powerlifting",
        beforeImg: "/images/user2.jpg",
        afterImg: "/images/user3.jpg",
    }
];

function TransformationCard({ data, className }) {
    return (
        <div className={cn("group flex flex-col gap-4", className)}>
            <div className="flex flex-col md:flex-row gap-2 md:gap-4 overflow-hidden rounded-3xl bg-slate-100 p-2 border border-slate-200">
                {/* Before Image */}
                <div className="relative flex-1 rounded-2xl overflow-hidden aspect-[4/5] sm:aspect-square md:aspect-[4/5]">
                    <img 
                        src={data.beforeImg} 
                        alt="Before" 
                        className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop" }}
                    />
                    <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                        Before
                    </div>
                </div>

                {/* After Image */}
                <div className="relative flex-1 rounded-2xl overflow-hidden aspect-[4/5] sm:aspect-square md:aspect-[4/5]">
                    <img 
                        src={data.afterImg} 
                        alt="After" 
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop" }}
                    />
                    <div className="absolute top-4 right-4 bg-[var(--color-primary)] text-slate-900 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                        After
                    </div>
                </div>
            </div>

            <div className="px-2">
                <h4 className="text-lg sm:text-xl font-black text-slate-900 uppercase italic tracking-tight">
                    {data.title}
                </h4>
                <p className="text-sm text-slate-500 font-medium">
                    {data.program}
                </p>
            </div>
        </div>
    );
}

export default function Transformations() {
    const titleRef = useReveal();
    const gridRef = useReveal();

    return (
        <section id="transformations" className="py-16 lg:py-28 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div ref={titleRef} className="reveal-up text-center max-w-2xl mx-auto mb-12 lg:mb-20">
                    <h2 className="text-sm font-bold text-[var(--color-primary-dark)] uppercase tracking-widest mb-2">
                        Real Results
                    </h2>
                    <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 uppercase italic tracking-tight">
                        Client Transformations
                    </h3>
                </div>

                <div ref={gridRef} className="reveal-group grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
                    {TRANSFORMATIONS.map((item, idx) => (
                        <div key={item.id} className={`reveal-up reveal-item delay-${(idx + 1) * 100}`}>
                            <TransformationCard data={item} />
                        </div>
                    ))}
                </div>
                
            </div>
        </section>
    );
}
