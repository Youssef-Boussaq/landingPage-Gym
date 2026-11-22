import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Mot de passe oublié" />

            <div className="mb-6 text-center">
                <h1 className="text-2xl font-normal uppercase tracking-[0.025em] text-[#000000]">
                    Mot de passe oublié
                </h1>
                <p className="mt-2 text-[13px] text-[#666666] leading-relaxed">
                    Entrez votre adresse email pour recevoir un lien de réinitialisation sécurisé.
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
                        autoFocus
                        placeholder="exemple@domaine.com"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-1.5 text-xs text-red-600" />
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="filled-action-btn w-full py-3.5 text-center text-[12px] font-medium uppercase tracking-[0.025em] disabled:opacity-40"
                    >
                        {processing ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
                    </button>
                </div>

                <div className="pt-3 text-center">
                    <Link
                        href={route('login')}
                        className="text-[12px] text-[#666666] uppercase tracking-[0.025em] hover:text-[#000000] hover:underline"
                    >
                        Retour à la connexion
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
