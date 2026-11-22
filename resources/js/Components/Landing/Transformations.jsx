import { useReveal } from '@/hooks/useReveal';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

// Static fallback data — used when no dynamic props are passed (SSG, storybook, etc.)
const STATIC_TRANSFORMATIONS = [
    {
        id: 1,
        title: '12 Weeks Transformation',
        program: 'Weight Loss',
        beforeImg: '/images/tran1.jpeg',
        afterImg: '/images/tran1after.jpeg',
        resultBadge: 'Real Result',
        shape: 'fashion-card-shape-1',
        offset: '',
    },
    {
        id: 2,
        title: '3 Months Progress',
        program: 'Muscle Building',
        afterImg: '/images/after_fog.jpg',
        beforeImg: '/images/before_fog.jpg',
        resultBadge: 'Real Result',
        shape: 'fashion-card-shape-2',
        offset: 'lg:translate-y-8',
    },
    {
        id: 3,
        title: '1 year Progress',
        program: 'Strength & Power',
        afterImg: '/images/man_right_fog.jpg',
        beforeImg: '/images/man_left_fog.jpg',
        resultBadge: 'Real Result',
        shape: 'fashion-card-shape-3',
        offset: '',
    },
];

// Shape cycle for dynamic items that don't specify a shape
const SHAPES = ['', '', ''];
const OFFSETS = ['', '', ''];

function TransformationCard({ data, className }) {
    return (
        <article
            className={cn(
                'group relative',
                'flex flex-col',
                'gap-4',
                'bg-white border border-[#e5e7eb] p-4',
                className
            )}
        >
            {/* =====================================================
                IMAGE COLLAGE (Editorial Sharp Rectangles)
            ====================================================== */}
            <div className="relative h-[430px] sm:h-[480px] bg-[#f0efe7] overflow-hidden">

                {/* BEFORE */}
                <div
                    className={cn(
                        'absolute left-3 bottom-3',
                        'z-10',
                        'w-[46%] h-[68%]',
                        'overflow-hidden',
                        'bg-white border border-[#e5e7eb]',
                        'rounded-none',
                        'transition-transform duration-500 ease-out',
                        'group-hover:z-30'
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
                            transition-transform
                            duration-500
                            group-hover:scale-105
                        "
                        onError={(e) => {
                            e.currentTarget.src =
                                '/images/placeholder.jpg';
                        }}
                    />

                    <span
                        className="
                            absolute
                            top-2
                            left-2
                            rounded-none
                            bg-[#000000]
                            px-2
                            py-1
                            text-[9px]
                            font-medium
                            uppercase
                            tracking-[0.05em]
                            text-white
                        "
                    >
                        Before
                    </span>
                </div>

                {/* AFTER / MAIN IMAGE */}
                <div
                    className={cn(
                        'absolute right-3 top-3',
                        'z-20',
                        'w-[66%] h-[88%]',
                        'overflow-hidden',
                        'bg-white border border-[#e5e7eb]',
                        'rounded-none',
                        'transition-transform duration-500 ease-out'
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
                            duration-500
                            group-hover:scale-105
                        "
                        onError={(e) => {
                            e.currentTarget.src =
                                '/images/placeholder.jpg';
                        }}
                    />

                    {/* AFTER LABEL */}
                    <span
                        className="
                            absolute
                            top-2
                            right-2
                            rounded-none
                            bg-[#000000]
                            px-2.5
                            py-1
                            text-[9px]
                            font-medium
                            uppercase
                            tracking-[0.05em]
                            text-white
                        "
                    >
                        After
                    </span>
                </div>

                {/* SMALL FLOATING RESULT BADGE */}
                <div
                    className="
                        absolute
                        bottom-4
                        left-4
                        z-30
                        flex
                        items-center
                        justify-center
                        rounded-none
                        bg-[#000000]
                        px-3
                        py-1.5
                        text-center
                        text-[9px]
                        font-medium
                        uppercase
                        tracking-[0.05em]
                        text-white
                    "
                >
                    {data.resultBadge || 'Real Result'}
                </div>
            </div>

            {/* =====================================================
                CONTENT
            ====================================================== */}
            <div className="pt-2">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p
                            className="
                                mb-1
                                text-[11px]
                                font-medium
                                uppercase
                                tracking-[0.025em]
                                text-[#666666]
                                font-favorit
                            "
                        >
                            {data.program}
                        </p>

                        <h3
                            className="
                                text-[16px]
                                font-bold
                                uppercase
                                tracking-[0.025em]
                                text-[#000000]
                                font-favorit
                            "
                        >
                            {data.title}
                        </h3>
                    </div>

                    <span
                        className="
                            pt-1
                            text-[11px]
                            font-medium
                            tracking-[0.05em]
                            text-[#cccccc]
                            font-favorit
                        "
                    >
                        0{data.id}
                    </span>
                </div>
            </div>
        </article>
    );
}

export default function Transformations({ transformations: dynamicItems, sectionConfig } = {}) {
    const titleRef = useReveal();
    const gridRef = useReveal();

    // Use dynamic data from DB if passed, otherwise fall back to static array
    const items = (Array.isArray(dynamicItems) && dynamicItems.length > 0)
        ? dynamicItems.map((item, index) => ({
              ...item,
              shape:  '',
              offset: '',
          }))
        : STATIC_TRANSFORMATIONS;

    // Section config (eyebrow / heading) — fall back to hardcoded values
    const eyebrow  = sectionConfig?.eyebrow ?? 'FIT YOUNESS';
    const heading  = sectionConfig?.heading ?? 'Clients Transformations';

    return (
        <section
            id="transformations"
            className="
                relative
                overflow-hidden
                bg-white
                py-20
                lg:py-28
            "
        >
            <div
                className="
                    mx-auto
                    max-w-[1440px]
                    px-4
                    sm:px-6
                    lg:px-8
                "
            >
                {/* =================================================
                    HEADER
                ================================================== */}
                <div
                    ref={titleRef}
                    className="
                        reveal-up
                        mx-auto
                        mb-16
                        max-w-3xl
                        text-center
                        lg:mb-20
                    "
                >
                    <div className="mb-3 flex items-center justify-center gap-3">
                        <span className="h-px w-8 bg-[#000000]" />
                        <p
                            className="
                                text-[12px]
                                font-medium
                                uppercase
                                tracking-[0.025em]
                                text-[#333333]
                                font-favorit
                            "
                        >
                            {eyebrow}
                        </p>
                        <span className="h-px w-8 bg-[#000000]" />
                    </div>

                    <h2
                        className="
                            text-3xl
                            sm:text-4xl
                            lg:text-5xl
                            font-normal
                            uppercase
                            tracking-[0.025em]
                            text-[#000000]
                            font-favorit
                        "
                    >
                        {heading}
                    </h2>
                </div>

                {/* =================================================
                    CARD GRID
                ================================================== */}
                <div
                    ref={gridRef}
                    className="
                        reveal-group
                        grid
                        grid-cols-1
                        gap-8
                        sm:grid-cols-2
                        lg:grid-cols-3
                        lg:items-start
                    "
                >
                    {items.map((item, index) => (
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