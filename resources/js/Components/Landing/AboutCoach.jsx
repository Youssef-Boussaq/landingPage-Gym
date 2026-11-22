import React from "react";
import { ArrowUpRight, Award, Dumbbell } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

/**
 * About / AboutCoach landing section.
 * Accepts a `config` prop populated from the published CMS configuration.
 * Falls back to static defaults when config values are absent.
 */
const About = ({ config = {} }) => {
    const headerRef           = useReveal();
    const coachImageRef       = useReveal();
    const coachContentRef     = useReveal();
    const certificateImageRef = useReveal();
    const certificateContentRef = useReveal();

    // Resolve values with safe defaults
    const eyebrow              = config.eyebrow              ?? "About the coach";
    const heading              = config.heading              ?? "Built through";
    const headingHighlight     = config.heading_highlight    ?? "discipline.";
    const description          = config.description          ?? "A coaching philosophy built around discipline, experience and measurable results.";

    const coachLabel           = config.coach_label          ?? "The Coach";
    const coachHeading         = config.coach_heading        ?? "Discipline.\nExperience.\nResults.";
    const coachDescription     = config.coach_description    ?? "A passion for fitness built through discipline, consistency, and the constant pursuit of becoming stronger — both physically and mentally.";
    const coachStatement       = config.coach_statement      ?? "Strength is built daily";
    const coachImageUrl        = config.coach_image_url      ?? "/images/3.png";
    const coachImageAlt        = config.coach_image_alt      ?? "Fit Youness coach";
    const coachNumber          = config.coach_number         ?? "01";

    const certEyebrow          = config.cert_eyebrow         ?? "Professional certification";
    const certHeading          = config.cert_heading         ?? "IFBB";
    const certHeadingHighlight = config.cert_heading_highlight ?? "Certified.";
    const certDescription      = config.cert_description     ?? "Knowledge behind the training. Professional certification in fitness and nutrition, combining proven training principles with a personalized approach to help every client progress with confidence.";
    const certStatement        = config.cert_statement       ?? "Knowledge • Training • Nutrition";
    const certImageUrl         = config.cert_image_url       ?? "/images/4.png";
    const certImageAlt         = config.cert_image_alt       ?? "IFBB certified coach";
    const certNumber           = config.cert_number          ?? "02";

    const bottomStatement      = config.bottom_statement     ?? "Train with purpose.\nProgress with confidence.";
    const bottomHighlight      = config.bottom_highlight     ?? "Progress with confidence.";
    const ctaLabel             = config.cta_label            ?? "Start your journey";
    const ctaHref              = config.cta_href             ?? "#contact";

    // Render multi-line headings respecting \n
    const renderLines = (text, highlightText, highlightClass = "text-[var(--color-primary)]") => {
        const lines = text.split("\n");
        return lines.map((line, i) => {
            const isLast = i === lines.length - 1;
            const isHighlight = highlightText && line.trim() === highlightText.trim();
            return (
                <React.Fragment key={i}>
                    <span className={isHighlight ? highlightClass : undefined}>{line}</span>
                    {!isLast && <br />}
                </React.Fragment>
            );
        });
    };

    return (
        <section
            id="about"
            className="relative overflow-hidden bg-[#f0efe7] text-[#000000]"
        >
            <div className="relative mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">

                {/* =====================================================
                    HEADER
                ===================================================== */}
                <div
                    ref={headerRef}
                    className="reveal mb-16 max-w-3xl lg:mb-24"
                >
                    <div className="mb-4 flex items-center gap-3">
                        <span className="h-px w-8 bg-[#000000]" />
                        <span className="font-favorit text-[12px] font-medium uppercase tracking-[0.025em] text-[#333333]">
                            {eyebrow}
                        </span>
                    </div>

                    <h2 className="font-favorit text-3xl uppercase leading-[1.2] tracking-[0.025em] text-[#000000] sm:text-4xl lg:text-5xl">
                        {heading}{" "}
                        <span className="text-[#333333]">
                            {headingHighlight}
                        </span>
                    </h2>

                    <p className="mt-6 max-w-xl font-favorit text-[14px] leading-[1.4] tracking-[0.025em] text-[#333333]">
                        {description}
                    </p>
                </div>

                {/* =====================================================
                    COACH
                ===================================================== */}
                <article className="grid items-center gap-12 lg:grid-cols-2 lg:gap-24">

                    {/* IMAGE */}
                    <div ref={coachImageRef} className="reveal reveal-left relative mx-auto w-full max-w-[320px] sm:max-w-[360px] lg:max-w-[400px]">
                        <div className="group relative aspect-[9/16] bg-white border border-[#e5e7eb] rounded-none overflow-hidden">
                            <img
                                src={coachImageUrl}
                                alt={coachImageAlt}
                                loading="lazy"
                                decoding="async"
                                className="h-full w-full object-contain object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                            />
                            <span className="absolute left-4 top-4 font-favorit text-3xl font-bold leading-none text-[#cccccc]">
                                {coachNumber}
                            </span>
                        </div>
                    </div>

                    {/* CONTENT */}
                    <div
                        ref={coachContentRef}
                        className="reveal reveal-right max-w-xl"
                    >
                        <div className="mb-6 flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-[#000000] text-[#000000]">
                                <Dumbbell size={16} strokeWidth={1.5} />
                            </span>
                            <span className="font-favorit text-[12px] font-medium uppercase tracking-[0.025em] text-[#333333]">
                                {coachLabel}
                            </span>
                        </div>

                        <h3 className="font-favorit text-2xl uppercase leading-[1.2] tracking-[0.025em] text-[#000000] sm:text-3xl lg:text-4xl">
                            {renderLines(coachHeading, "Results.", "text-[#666666]")}
                        </h3>

                        <p className="mt-6 max-w-lg font-favorit text-[14px] leading-[1.4] tracking-[0.025em] text-[#333333]">
                            {coachDescription}
                        </p>

                        <div className="mt-8 flex items-center gap-4">
                            <span className="h-px w-10 bg-[#000000]" />
                            <span className="font-favorit text-[12px] font-medium uppercase tracking-[0.025em] text-[#666666]">
                                {coachStatement}
                            </span>
                        </div>
                    </div>
                </article>

                {/* =====================================================
                    IFBB CERTIFICATE
                ===================================================== */}
                <article className="mt-24 grid items-center gap-12 lg:mt-32 lg:grid-cols-2 lg:gap-24">

                    {/* CONTENT */}
                    <div
                        ref={certificateContentRef}
                        className="reveal reveal-left order-2 max-w-xl lg:order-1"
                    >
                        <div className="mb-6 flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-[#000000] text-[#000000]">
                                <Award size={16} strokeWidth={1.5} />
                            </span>
                            <span className="font-favorit text-[12px] font-medium uppercase tracking-[0.025em] text-[#333333]">
                                {certEyebrow}
                            </span>
                        </div>

                        <h3 className="font-favorit text-2xl uppercase leading-[1.2] tracking-[0.025em] text-[#000000] sm:text-3xl lg:text-4xl">
                            {certHeading}
                            <br />
                            <span className="text-[#333333]">
                                {certHeadingHighlight}
                            </span>
                        </h3>

                        <p className="mt-6 max-w-lg font-favorit text-[14px] leading-[1.4] tracking-[0.025em] text-[#333333]">
                            {certDescription}
                        </p>

                        <div className="mt-8 inline-flex items-center gap-3">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#000000]" />
                            <span className="font-favorit text-[12px] font-medium uppercase tracking-[0.025em] text-[#666666]">
                                {certStatement}
                            </span>
                        </div>
                    </div>

                    {/* CERTIFICATE IMAGE */}
                    <div ref={certificateImageRef} className="reveal reveal-right order-1 relative mx-auto w-full max-w-[320px] sm:max-w-[360px] lg:max-w-[400px] lg:order-2">
                        <div className="group relative aspect-[9/16] bg-white border border-[#e5e7eb] rounded-none overflow-hidden">
                            <img
                                src={certImageUrl}
                                alt={certImageAlt}
                                loading="lazy"
                                decoding="async"
                                className="h-full w-full object-contain object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                            />
                            <span className="absolute right-4 top-4 font-favorit text-3xl font-bold leading-none text-[#cccccc]">
                                {certNumber}
                            </span>
                        </div>
                    </div>
                </article>

                {/* =====================================================
                    BOTTOM STATEMENT
                ===================================================== */}
                <div className="mt-24 border-t border-[#000000] pt-10 lg:mt-32 lg:pt-12">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

                        <p className="font-favorit text-xl uppercase leading-[1.2] tracking-[0.025em] text-[#000000] sm:text-2xl">
                            {renderLines(bottomStatement, bottomHighlight, "text-[#666666]")}
                        </p>

                        <a
                            href={ctaHref}
                            className="ghost-cta-btn inline-flex items-center justify-center gap-2 hover:bg-[#000000] hover:text-white transition-colors"
                        >
                            <span>{ctaLabel}</span>
                            <ArrowUpRight size={14} strokeWidth={1.5} />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
