import { useReveal } from '@/hooks/useReveal';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

const TRANSFORMATIONS = [
    {
        id: 1,
        title: '12 Weeks Transformation',
        program: 'Weight Loss',
        beforeImg: '/images/user1.jpg',
        afterImg: '/images/user2.jpg',
        shape: 'fashion-card-shape-1',
        offset: '',
    },
    {
        id: 2,
        title: '6 Months Progress',
        program: 'Muscle Building',
        beforeImg: '/images/user3.jpg',
        afterImg: '/images/user1.jpg',
        shape: 'fashion-card-shape-2',
        offset: 'lg:translate-y-8',
    },
    {
        id: 3,
        title: '8 Weeks Prep',
        program: 'Strength & Power',
        beforeImg: '/images/user2.jpg',
        afterImg: '/images/user3.jpg',
        shape: 'fashion-card-shape-3',
        offset: '',
    },
];

function TransformationCard({ data, className }) {
    return (
        <article
            className={cn(
                'group relative',
                'flex flex-col',
                'gap-4',
                className
            )}
        >
            {/* =====================================================
                IMAGE COLLAGE
            ====================================================== */}
            <div className="relative h-[430px] sm:h-[500px]">

                {/* BEFORE */}
                <div
                    className={cn(
                        'absolute left-0 bottom-0',
                        'z-10',
                        'w-[43%] h-[67%]',
                        'overflow-hidden',
                        'bg-slate-100',
                        'shadow-lg',
                        'fashion-card-shape-sub',
                        'transition-transform duration-700 ease-out',
                        'group-hover:-translate-y-2'
                    )}
                >
                    <img
                        src={data.beforeImg}
                        alt={`${data.title} before`}
                        className="
                            w-full
                            h-full
                            object-cover
                            grayscale
                            transition-all
                            duration-700
                            group-hover:scale-105
                            group-hover:grayscale-0
                        "
                        onError={(e) => {
                            e.currentTarget.src =
                                '/images/placeholder.jpg';
                        }}
                    />

                    <span
                        className="
                            absolute
                            top-3
                            left-3
                            rounded-full
                            bg-black/75
                            px-2.5
                            py-1
                            text-[8px]
                            font-black
                            uppercase
                            tracking-[0.16em]
                            text-white
                            backdrop-blur-sm
                        "
                    >
                        Before
                    </span>
                </div>

                {/* AFTER / MAIN IMAGE */}
                <div
                    className={cn(
                        'absolute right-0 top-0',
                        'z-20',
                        'w-[68%] h-[88%]',
                        'overflow-hidden',
                        'bg-slate-100',
                        'shadow-xl',
                        data.shape,
                        'transition-transform duration-700 ease-out',
                        'group-hover:-translate-y-2'
                    )}
                >
                    <img
                        src={data.afterImg}
                        alt={`${data.title} after`}
                        className="
                            w-full
                            h-full
                            object-cover
                            transition-transform
                            duration-700
                            group-hover:scale-105
                        "
                        onError={(e) => {
                            e.currentTarget.src =
                                '/images/placeholder.jpg';
                        }}
                    />

                    {/* subtle image overlay */}
                    <div
                        className="
                            absolute
                            inset-0
                            bg-gradient-to-t
                            from-black/35
                            via-transparent
                            to-transparent
                        "
                    />

                    {/* AFTER LABEL */}
                    <span
                        className="
                            absolute
                            top-4
                            right-4
                            rounded-full
                            bg-[var(--color-primary)]
                            px-3
                            py-1.5
                            text-[8px]
                            font-black
                            uppercase
                            tracking-[0.16em]
                            text-black
                            shadow-lg
                        "
                    >
                        After
                    </span>

                    {/* Arrow */}
                    <div
                        className="
                            absolute
                            bottom-4
                            right-4
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-full
                            bg-white
                            text-black
                            transition-all
                            duration-500
                            group-hover:rotate-[-45deg]
                        "
                    >
                        <ArrowRight
                            size={15}
                            strokeWidth={2.5}
                        />
                    </div>
                </div>

                {/* =================================================
                    SMALL FLOATING RESULT BADGE
                ================================================== */}
                <div
                    className="
                        absolute
                        bottom-[10%]
                        left-[36%]
                        z-30
                        flex
                        h-12
                        w-12
                        rotate-[-8deg]
                        items-center
                        justify-center
                        rounded-full
                        bg-[var(--color-primary)]
                        text-center
                        text-[7px]
                        font-black
                        uppercase
                        leading-[0.9]
                        text-black
                        shadow-xl
                        transition-transform
                        duration-500
                        group-hover:rotate-0
                    "
                >
                    Real
                    <br />
                    Result
                </div>
            </div>

            {/* =====================================================
                CONTENT
            ====================================================== */}
            <div className="px-1">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p
                            className="
                                mb-1
                                text-[9px]
                                font-black
                                uppercase
                                tracking-[0.2em]
                                text-[var(--color-primary-dark)]
                            "
                        >
                            {data.program}
                        </p>

                        <h3
                            className="
                                text-lg
                                sm:text-xl
                                font-black
                                uppercase
                                italic
                                leading-tight
                                tracking-tight
                                text-slate-950
                            "
                        >
                            {data.title}
                        </h3>
                    </div>

                    <span
                        className="
                            pt-1
                            text-[9px]
                            font-black
                            tracking-[0.15em]
                            text-slate-300
                        "
                    >
                        0{data.id}
                    </span>
                </div>
            </div>
        </article>
    );
}

export default function Transformations() {
    const titleRef = useReveal();
    const gridRef = useReveal();

    return (
        <section
            id="transformations"
            className="
                relative
                overflow-hidden
                bg-white
                py-20
                lg:py-32
            "
        >
            <div
                className="
                    mx-auto
                    max-w-7xl
                    px-4
                    sm:px-6
                    lg:px-8
                "
            >
                {/* =================================================
                    FIT YOUNESS HEADER
                ================================================== */}
                <div
                    ref={titleRef}
                    className="
                        reveal-up
                        mx-auto
                        mb-14
                        max-w-3xl
                        text-center
                        lg:mb-20
                    "
                >
                    <p
                        className="
                            mb-3
                            text-[10px]
                            font-black
                            uppercase
                            tracking-[0.3em]
                            text-[var(--color-primary-dark)]
                        "
                    >
                        FIT YOUNESS
                    </p>

                    <h2
                        className="
                            text-4xl
                            font-black
                            uppercase
                            italic
                            leading-[0.9]
                            tracking-[-0.04em]
                            text-slate-950
                            sm:text-5xl
                            lg:text-7xl
                        "
                    >
                        Real
                        <br />
                        <span className="text-slate-300">
                            Transformations
                        </span>
                    </h2>
                </div>

                {/* =================================================
                    ASYMMETRIC CARD GRID
                ================================================== */}
                <div
                    ref={gridRef}
                    className="
                        reveal-group
                        grid
                        grid-cols-1
                        gap-14
                        sm:grid-cols-2
                        lg:grid-cols-3
                        lg:items-start
                        lg:gap-8
                    "
                >
                    {TRANSFORMATIONS.map((item, index) => (
                        <div
                            key={item.id}
                            className={cn(
                                'reveal-up reveal-item',
                                `delay-${(index + 1) * 100}`,
                                item.offset
                            )}
                        >
                            <TransformationCard data={item} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}