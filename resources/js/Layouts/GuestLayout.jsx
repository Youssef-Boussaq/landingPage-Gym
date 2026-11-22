import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#f0efe7] px-4 py-12 font-favorit">
            <div className="mb-8">
                <Link href="/" className="inline-block text-center">
                    <span className="font-favorit text-3xl font-black uppercase tracking-[0.08em] text-[#000000]">
                        FIT YOUNESS
                    </span>
                </Link>
            </div>

            <div className="w-full max-w-md border border-[#e5e7eb] bg-white p-8 sm:p-10 rounded-none shadow-none">
                {children}
            </div>

            <div className="mt-8 text-center text-[11px] text-[#666666] uppercase tracking-[0.025em]">
                <p>© {new Date().getFullYear()} Fit Youness. Tous droits réservés.</p>
            </div>
        </div>
    );
}
