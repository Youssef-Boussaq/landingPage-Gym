import { Loader2, X } from 'lucide-react';

export default function CreateCategoryModal({
    open,
    parent,
    name,
    onNameChange,
    error,
    loading,
    onClose,
    onCreate,
}) {
    if (!open || !parent) {
        return null;
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Escape' && !loading) {
            onClose();
        }

        if (event.key === 'Enter' && !loading) {
            event.preventDefault();
            onCreate();
        }
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose();
                }
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="create-category-title"
                tabIndex={-1}
                onKeyDown={handleKeyDown}
                className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                    <div>
                        <h2
                            id="create-category-title"
                            className="text-lg font-semibold text-slate-900"
                        >
                            Nouvelle catégorie
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Ajouter une sous-catégorie à{' '}
                            <span className="font-medium text-slate-700">
                                {parent.name}
                            </span>
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Fermer"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="space-y-5 px-6 py-6">
                    <div>
                        <label
                            htmlFor="new-category-name"
                            className="text-sm font-medium text-slate-700"
                        >
                            Nom de la catégorie
                        </label>

                        <input
                            id="new-category-name"
                            type="text"
                            value={name}
                            onChange={(event) =>
                                onNameChange(
                                    event.target.value
                                )
                            }
                            autoFocus
                            disabled={loading}
                            placeholder="Ex: Protein"
                            className="mt-2 block w-full rounded-xl border-slate-300 text-sm shadow-sm focus:border-[#9de500] focus:ring-[#9de500] disabled:bg-slate-50"
                        />

                        {error && (
                            <p className="mt-2 text-sm text-red-600">
                                {error}
                            </p>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Annuler
                    </button>

                    <button
                        type="button"
                        onClick={onCreate}
                        disabled={
                            loading ||
                            !name.trim()
                        }
                        className="inline-flex items-center gap-2 rounded-xl bg-[#9de500] px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-[#8cd000] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        )}

                        {loading
                            ? 'Création...'
                            : 'Créer la catégorie'}
                    </button>
                </div>
            </div>
        </div>
    );
}