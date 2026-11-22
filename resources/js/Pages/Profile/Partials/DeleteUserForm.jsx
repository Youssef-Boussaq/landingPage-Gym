import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`font-favorit ${className}`}>
            <header className="border-b border-rose-300 pb-4">
                <h2 className="text-sm font-bold uppercase tracking-[0.05em] text-rose-900 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-rose-600" />
                    Zone de Danger — Suppression du compte
                </h2>
                <p className="mt-1 text-xs text-rose-700">
                    Une fois votre compte supprimé, toutes vos données personnelles seront définitivement effacées.
                </p>
            </header>

            <div className="mt-6">
                <button
                    type="button"
                    onClick={confirmUserDeletion}
                    className="inline-flex items-center gap-2 border border-rose-700 bg-rose-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-rose-700 transition"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Supprimer mon compte</span>
                </button>
            </div>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6 font-favorit">
                    <h2 className="text-sm font-bold uppercase tracking-[0.05em] text-black">
                        Confirmer la suppression de votre compte ?
                    </h2>

                    <p className="mt-2 text-xs text-[#666666] leading-relaxed">
                        Cette action est irréversible. Pour des raisons de sécurité, veuillez saisir votre mot de passe afin de confirmer la suppression définitive de votre compte.
                    </p>

                    <div className="mt-5">
                        <label
                            htmlFor="delete_password"
                            className="block text-[11px] font-bold uppercase tracking-[0.05em] text-black"
                        >
                            Mot de passe
                        </label>
                        <input
                            id="delete_password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="mt-1.5 block w-full rounded-[4px] border border-[#e5e7eb] px-3.5 py-2.5 text-sm text-black focus:border-black focus:outline-none focus:ring-0"
                            placeholder="Votre mot de passe"
                            autoFocus
                        />
                        <InputError message={errors.password} className="mt-1.5" />
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#e5e7eb] pt-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="border border-[#e5e7eb] bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-black hover:bg-[#f0efe7] transition"
                        >
                            Annuler
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-rose-600 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-rose-700 transition disabled:opacity-50"
                        >
                            {processing ? 'Suppression...' : 'Confirmer la suppression'}
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
