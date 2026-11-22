import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Connexion" />

            <div className="mb-6 text-center">
                <h1 className="text-2xl font-normal uppercase tracking-[0.025em] text-[#000000]">
                    Connexion
                </h1>
                <p className="mt-1 text-[13px] text-[#666666] tracking-[0.025em]">
                    Accédez à votre espace sécurisé
                </p>
            </div>

            {status && (
                <div className="mb-6 border border-emerald-300 bg-emerald-50 p-3 text-[12px] text-emerald-800">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
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
                        autoFocus
                        placeholder="exemple@domaine.com"
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-1.5 text-xs text-red-600" />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[12px] font-medium uppercase tracking-[0.025em] text-[#333333]">
                            Mot de passe
                        </label>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-[11px] text-[#666666] uppercase tracking-[0.025em] hover:text-[#000000] hover:underline"
                            >
                                Oublié ?
                            </Link>
                        )}
                    </div>

                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="w-full rounded-[4px] border border-[#e5e7eb] px-3.5 py-2.5 text-sm text-[#000000] focus:border-[#000000] focus:outline-none focus:ring-0"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-1.5 text-xs text-red-600" />
                </div>

                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center cursor-pointer">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-[12px] text-[#666666]">
                            Se souvenir de moi
                        </span>
                    </label>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="filled-action-btn w-full py-3.5 text-center text-[12px] font-medium uppercase tracking-[0.025em] disabled:opacity-40"
                    >
                        {processing ? 'Connexion en cours...' : 'Se connecter'}
                    </button>
                </div>

                <div className="mt-6 border-t border-[#e5e7eb] pt-6 text-center">
                    <p className="text-[12px] text-[#666666] tracking-[0.025em]">
                        Vous n'avez pas encore de compte ?
                    </p>
                    <Link
                        href={route('register')}
                        className="mt-3 block w-full border border-black bg-white py-3 text-center text-[11px] font-bold uppercase tracking-[0.05em] text-black hover:bg-black hover:text-white transition-colors"
                    >
                        Créer un compte (Inscription)
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
