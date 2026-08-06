export default function StatCard({ children, className = "" }) {
    return (
        <div
            className={`group relative p-6 rounded-3xl 
            /* Base Layer - Moderately Frosted Opaque */
            bg-slate-900/55 backdrop-blur-xl 
            border border-white/15 
            shadow-[0_8px_32px_0_rgba(0,0,0,0.42)] 
            /* Surface texture gradient */
            bg-gradient-to-br from-white/10 via-slate-900/40 to-transparent
            text-center flex flex-col items-center justify-center 
            transition-all duration-500 ease-out 
            hover:-translate-y-2 hover:scale-[1.02] 
            hover:bg-slate-900/80 hover:border-[#9de500]/60 
            hover:shadow-[0_12px_40px_0_rgba(157,229,0,0.2)] 
            cursor-pointer overflow-hidden ${className}`}
        >
            {/* Top Light Reflection Shine Effect */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-t-3xl" />

            {/* Glowing Accent Ring on Hover */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#9de500]/0 via-[#9de500]/20 to-[#9de500]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center w-full">
                {children}
            </div>
        </div>
    );
}