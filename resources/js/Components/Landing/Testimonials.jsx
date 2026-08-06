const testimonials = [
    {
        name: 'Laura',
        quote:
            'J’ai enfin trouvé un programme clair et efficace. Mes résultats sont bien au-delà de mes attentes.',
    },
    {
        name: 'Mathieu',
        quote:
            'Le coaching m’a aidé à garder le cap et à progresser sans me blesser.',
    },
];

export default function Testimonials() {
    return (
        <section id="testimonials" className="py-16">
            <div className="mx-auto max-w-5xl space-y-8 text-center">
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Témoignages</p>
                <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                    Des clients motivés par les résultats.
                </h2>
                <div className="grid gap-6 lg:grid-cols-2">
                    {testimonials.map((item) => (
                        <article
                            key={item.name}
                            className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 text-left"
                        >
                            <p className="text-lg leading-8 text-slate-300">“{item.quote}”</p>
                            <p className="mt-6 font-semibold text-white">{item.name}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
