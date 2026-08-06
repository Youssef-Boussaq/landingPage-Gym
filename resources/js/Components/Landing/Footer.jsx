export default function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-white py-10">
            <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 text-slate-600 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
                <div className="space-y-2">
                    <p className="text-xl font-semibold text-black">GymFit</p>
                    <p className="max-w-xl text-sm leading-6 text-slate-600">
                        Coaching personnalisé pour progresser en confiance et en plaisir.
                    </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <a href="#hero" className="text-sm text-slate-600 transition hover:text-black">
                        Retour en haut
                    </a>
                    <a href="#contact" className="text-sm text-slate-600 transition hover:text-black">
                        Contact
                    </a>
                </div>
            </div>
        </footer>
    );
}