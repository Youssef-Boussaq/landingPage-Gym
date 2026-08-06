import { Store, Dumbbell, Home, MessageSquareText } from 'lucide-react';

const mobileLinks = [
    { href: '#hero', label: 'Home', icon: Home },
    { href: '#programs', label: 'Programs', icon: Dumbbell },
    { href: '#testimonials', label: 'Reviews', icon: MessageSquareText },
    { href: '/store', label: 'Store', icon: Store },
];

export default function Navbar() {
    return (
        <>
            <header className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur md:sticky md:top-0 md:border-b md:border-t-0">
                

                <nav className="flex items-center justify-around gap-1 px-2 py-2 md:hidden">
                    {mobileLinks.map(({ href, label, icon: Icon }) => (
                        <a
                            key={href}
                            href={href}
                            className="relative flex flex-1 flex-col items-center justify-center rounded-xl px-2 py-2 text-[11px] font-medium text-gray-700 transition hover:text-[#9de500] focus:text-[#9de500] active:text-[#9de500] after:mt-1 after:h-0.5 after:w-5 after:rounded-full after:bg-[#9de500] after:opacity-0 hover:after:opacity-100 focus:after:opacity-100 active:after:opacity-100 after:transition after:duration-300 after:ease-in-out">
                            <Icon className="h-5 w-5" />
                            <span className="mt-1 text-[11px]">{label}</span>
                        </a>
                    ))}
                </nav>
            </header>

            
        </>
    );
}