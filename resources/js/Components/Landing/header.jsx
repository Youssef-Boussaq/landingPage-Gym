import { Dumbbell, Search, Heart, User, ShoppingBag } from 'lucide-react';

export default function Header({ user }) {
    return (
        /* group : Permet de déclencher des styles enfants au survol du header */
        /* hover:bg-white hover:shadow-lg : Passe le fond en blanc avec une légère ombre */
        /* transition-all duration-300 : Rend le changement de couleur fluide */
        <header className="group absolute top-0 inset-x-0 z-30 hidden w-full bg-gradient-to-b from-black/80 via-black/40 to-transparent py-4 transition-all duration-300 hover:bg-white  md:block">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
                
                {/* Logo / Brand — Passe en noir au survol */}
                <a 
                    href="#hero" 
                    className="flex items-center gap-2 text-xl font-extrabold uppercase tracking-wider text-white transition-colors duration-300 group-hover:text-slate-900"
                >
                    <Dumbbell className="h-6 w-6 text-[#9de500]" />
                    <span>Fit Youness</span>
                </a>

                {/* Navigation Links — Passent en gris/noir au survol */}
                <nav className="flex items-center gap-8">
                    <a 
                        href="#programs" 
                        className="text-sm font-medium text-white/90 transition-colors duration-300 hover:text-[#9de500] group-hover:text-slate-700 group-hover:hover:text-[#82be00]"
                    >
                        Programs
                    </a>
                    <a 
                        href="#testimonials" 
                        className="text-sm font-medium text-white/90 transition-colors duration-300 hover:text-[#9de500] group-hover:text-slate-700 group-hover:hover:text-[#82be00]"
                    >
                        Testimonials
                    </a>
                    <a 
                        href="#faq" 
                        className="text-sm font-medium text-white/90 transition-colors duration-300 hover:text-[#9de500] group-hover:text-slate-700 group-hover:hover:text-[#82be00]"
                    >
                        FAQ
                    </a>
                    <a 
                        href="/store" 
                        className="text-sm font-medium text-white/90 transition-colors duration-300 hover:text-[#9de500] group-hover:text-slate-700 group-hover:hover:text-[#82be00]"
                    >
                        Store
                    </a>
                </nav>

                <div className="flex items-center gap-3 text-white">
                    <button type="button" className="rounded-full border border-white/30 bg-white/10 p-3 transition hover:border-white hover:bg-white/20">
                        <Search className="h-4 w-4" />
                        <span className="sr-only">Search</span>
                    </button>
                    <button type="button" className="rounded-full border border-white/30 bg-white/10 p-3 transition hover:border-white hover:bg-white/20">
                        <Heart className="h-4 w-4" />
                        <span className="sr-only">Favorites</span>
                    </button>
                    <a
                        href={user ? '/dashboard' : '/login'}
                        className="rounded-full border border-white/30 bg-white/10 p-3 transition hover:border-white hover:bg-white/20"
                    >
                        <User className="h-4 w-4" />
                        <span className="sr-only">{user ? 'Dashboard' : 'Login'}</span>
                    </a>
                    <a
                        href="/store/cart"
                        className="rounded-full border border-white/30 bg-white/10 p-3 transition hover:border-white hover:bg-white/20"
                    >
                        <ShoppingBag className="h-4 w-4" />
                        <span className="sr-only">Panier</span>
                    </a>
                </div>
            </div>
        </header>
    );
}