import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Créer un compte" />

            <div className="mb-6 text-center">
                <h1 className="text-2xl font-normal uppercase tracking-[0.025em] text-[#000000]">
                    Créer un compte
                </h1>
                <p className="mt-1 text-[13px] text-[#666666] tracking-[0.025em]">
                    Rejoignez l'univers Fit Youness
                </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block text-[12px] font-medium uppercase tracking-[0.025em] text-[#333333] mb-1.5">
                        Nom complet
                    </label>

                    <input
                        id="name"
                        name="name"
                        value={data.name}
                        className="w-full rounded-[4px] border border-[#e5e7eb] px-3.5 py-2.5 text-sm text-[#000000] focus:border-[#000000] focus:outline-none focus:ring-0"
                        autoComplete="name"
                        autoFocus
                        placeholder="Votre nom"
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-1.5 text-xs text-red-600" />
                </div>

                <div>
                    <label className="block text-[12px] font-medium uppercase tracking-[0.025em] text-[#333333] mb-1.5">
                        Adresse Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="w-full rounded-[4px] border border-[#e5e7eb] px-3.5 py-2.5 text-sm text-[#000000] focus:border-[#000000] focus:outline-none focus:ring-0"
                        autoComplete="username"
                        placeholder="exemple@domaine.com"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-1.5 text-xs text-red-600" />
                </div>

                <div>
                    <label className="block text-[12px] font-medium uppercase tracking-[0.025em] text-[#333333] mb-1.5">
                        Mot de passe
                    </label>

                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="w-full rounded-[4px] border border-[#e5e7eb] px-3.5 py-2.5 text-sm text-[#000000] focus:border-[#000000] focus:outline-none focus:ring-0"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-1.5 text-xs text-red-600" />
                </div>

                <div>
                    <label className="block text-[12px] font-medium uppercase tracking-[0.025em] text-[#333333] mb-1.5">
                        Confirmer le mot de passe
                    </label>

                    <input
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="w-full rounded-[4px] border border-[#e5e7eb] px-3.5 py-2.5 text-sm text-[#000000] focus:border-[#000000] focus:outline-none focus:ring-0"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-1.5 text-xs text-red-600"
                    />
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="filled-action-btn w-full py-3.5 text-center text-[12px] font-medium uppercase tracking-[0.025em] disabled:opacity-40"
                    >
                        {processing ? 'Création en cours...' : 'Créer mon compte'}
                    </button>
                </div>

                <div className="pt-3 text-center">
                    <Link
                        href={route('login')}
                        className="text-[12px] text-[#666666] uppercase tracking-[0.025em] hover:text-[#000000] hover:underline"
                    >
                        Déjà un compte ? Se connecter
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
