const faqs = [
    {
        question: 'Est-ce adapté aux débutants ?',
        answer:
            'Oui. Les programmes sont conçus pour s’adapter à tous les niveaux et évoluer progressivement.',
    },
    {
        question: 'Ai-je besoin de matériel ?',
        answer:
            'Non. Le coaching propose des versions sans matériel et avec matériel pour s’adapter à votre situation.',
    },
    {
        question: 'Comment suivre ma progression ?',
        answer:
            'Vous recevez un plan clair et des repères de progression pour rester motivé chaque semaine.',
    },
];

export default function FAQ() {
    return (
        <section id="faq" className="py-16">
            <div className="mx-auto max-w-5xl space-y-8 text-center">
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Questions fréquentes</p>
                <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                    Vos questions, nos réponses.
                </h2>
                <div className="space-y-4">
                    {faqs.map((item) => (
                        <div
                            key={item.question}
                            className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-left"
                        >
                            <h3 className="text-lg font-semibold text-white">{item.question}</h3>
                            <p className="mt-3 text-sm leading-7 text-slate-400">{item.answer}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
