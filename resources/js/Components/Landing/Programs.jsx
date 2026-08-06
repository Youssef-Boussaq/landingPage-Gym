const programs = [
    {
        title: 'Remise en forme',
        description: 'Idéal pour retrouver de l’énergie, de la force et un corps tonique.',
    },
    {
        title: 'Force & prise de masse',
        description: 'Un plan progressif pour augmenter la puissance et le volume musculaire.',
    },
    {
        title: 'Perte de poids',
        description: 'Un coaching structuré pour brûler plus de calories et conserver la masse musculaire.',
    },
];

export default function Programs() {
    return (
        <section id="programs" className="py-16">
            <div className="mx-auto max-w-6xl space-y-8 text-center">
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Programmes</p>
                <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                    Choisissez le plan qui vous correspond.
                </h2>
                <p className="mx-auto max-w-2xl text-base leading-7 text-slate-400">
                    Trois offres simplifiées pour vous aider à rester constant et à progresser rapidement.
                </p>
                <div className="grid gap-6 lg:grid-cols-3">
                    {programs.map((program) => (
                        <article
                            key={program.title}
                            className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-left"
                        >
                            <h3 className="text-xl font-semibold text-white">{program.title}</h3>
                            <p className="mt-4 text-sm leading-7 text-slate-400">
                                {program.description}
                            </p>
                            <div className="mt-6 inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-cyan-300">
                                À partir de 39€/semaine
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
