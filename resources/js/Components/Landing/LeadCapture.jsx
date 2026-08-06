export default function LeadCapture() {
    return (
        <section id="lead" className="py-16">
            <div className="mx-auto max-w-4xl rounded-[2rem] border border-cyan-500/20 bg-slate-900/80 p-10 shadow-xl">
                <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-center">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Inscription</p>
                        <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                            Rejoignez le coaching et recevez un plan gratuit.
                        </h2>
                        <p className="mt-4 text-base leading-7 text-slate-400">
                            Laissez votre email pour recevoir une session de découverte offerte et un début de plan personnalisé.
                        </p>
                    </div>
                    <form className="space-y-4 rounded-3xl bg-slate-950/90 p-6">
                        <label className="block text-sm font-medium text-slate-300">
                            Email
                            <input
                                type="email"
                                placeholder="votre@email.com"
                                className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                            />
                        </label>
                        <button
                            type="submit"
                            className="w-full rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                        >
                            Recevoir mon plan gratuit
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
