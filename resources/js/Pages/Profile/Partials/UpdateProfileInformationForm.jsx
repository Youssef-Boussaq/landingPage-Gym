import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Check } from 'lucide-react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={`font-favorit ${className}`}>
            <header className="border-b border-black pb-4">
                <h2 className="text-sm font-bold uppercase tracking-[0.05em] text-black">
                    Informations Personnelles
                </h2>
                <p className="mt-1 text-xs text-[#666666]">
                    Mettez à jour vos coordonnées et votre adresse email de contact.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 max-w-xl space-y-5">
                <div>
                    <label
                        htmlFor="name"
                        className="block text-[11px] font-bold uppercase tracking-[0.05em] text-black"
                    >
                        Nom complet
                    </label>
                    <input
                        id="name"
                        type="text"
                        className="mt-1.5 block w-full rounded-[4px] border border-[#e5e7eb] px-3.5 py-2.5 text-sm text-black focus:border-black focus:outline-none focus:ring-0"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                    />
                    <InputError className="mt-1.5" message={errors.name} />
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="block text-[11px] font-bold uppercase tracking-[0.05em] text-black"
                    >
                        Adresse Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="mt-1.5 block w-full rounded-[4px] border border-[#e5e7eb] px-3.5 py-2.5 text-sm text-black focus:border-black focus:outline-none focus:ring-0"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-1.5" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="border border-amber-200 bg-amber-50 p-4">
                        <p className="text-xs text-amber-800">
                            Votre adresse email n'est pas vérifiée.{' '}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="font-bold underline hover:text-black"
                            >
                                Renvoyer l'email de vérification
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-xs font-bold text-emerald-700">
                                Un nouveau lien de vérification vous a été envoyé.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-black px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition disabled:opacity-50"
                    >
                        {processing ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out duration-500"
                        leaveTo="opacity-0"
                    >
                        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                            <Check className="h-4 w-4" /> Enregistré avec succès.
                        </span>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
