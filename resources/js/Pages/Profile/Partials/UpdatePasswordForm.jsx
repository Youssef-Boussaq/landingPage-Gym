import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
import { Check, Lock } from 'lucide-react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={`font-favorit ${className}`}>
            <header className="border-b border-black pb-4">
                <h2 className="text-sm font-bold uppercase tracking-[0.05em] text-black flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Sécurité du Compte
                </h2>
                <p className="mt-1 text-xs text-[#666666]">
                    Choisissez un mot de passe robuste et sécurisé pour protéger votre compte.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 max-w-xl space-y-5">
                <div>
                    <label
                        htmlFor="current_password"
                        className="block text-[11px] font-bold uppercase tracking-[0.05em] text-black"
                    >
                        Mot de passe actuel
                    </label>
                    <input
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        type="password"
                        className="mt-1.5 block w-full rounded-[4px] border border-[#e5e7eb] px-3.5 py-2.5 text-sm text-black focus:border-black focus:outline-none focus:ring-0"
                        autoComplete="current-password"
                    />
                    <InputError message={errors.current_password} className="mt-1.5" />
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="block text-[11px] font-bold uppercase tracking-[0.05em] text-black"
                    >
                        Nouveau mot de passe
                    </label>
                    <input
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className="mt-1.5 block w-full rounded-[4px] border border-[#e5e7eb] px-3.5 py-2.5 text-sm text-black focus:border-black focus:outline-none focus:ring-0"
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                <div>
                    <label
                        htmlFor="password_confirmation"
                        className="block text-[11px] font-bold uppercase tracking-[0.05em] text-black"
                    >
                        Confirmer le nouveau mot de passe
                    </label>
                    <input
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        type="password"
                        className="mt-1.5 block w-full rounded-[4px] border border-[#e5e7eb] px-3.5 py-2.5 text-sm text-black focus:border-black focus:outline-none focus:ring-0"
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password_confirmation} className="mt-1.5" />
                </div>

                <div className="flex items-center gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-black px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition disabled:opacity-50"
                    >
                        {processing ? 'Modification...' : 'Mettre à jour le mot de passe'}
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out duration-500"
                        leaveTo="opacity-0"
                    >
                        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                            <Check className="h-4 w-4" /> Mot de passe mis à jour.
                        </span>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
