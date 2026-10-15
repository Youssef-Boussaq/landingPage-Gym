import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import CreateCategoryModal from './CreateCategoryModal';

import {
    Check,
    ChevronDown,
    Plus,
} from 'lucide-react';

import { useMemo, useState } from 'react';

export default function ProductCategorySelector({
    categories = [],
    selectedIds = [],
    onChange,
    onCategoryCreated,
    error,
}) {
    /*
    |--------------------------------------------------------------------------
    | Groups
    |--------------------------------------------------------------------------
    | Toutes les catégories parent sont fermées par défaut.
    */

    const [openGroups, setOpenGroups] = useState(
        new Set()
    );

    /*
    |--------------------------------------------------------------------------
    | Create category modal
    |--------------------------------------------------------------------------
    */

    const [modalParent, setModalParent] =
        useState(null);

    const [newCategoryName, setNewCategoryName] =
        useState('');

    const [creatingCategory, setCreatingCategory] =
        useState(false);

    const [categoryCreateError, setCategoryCreateError] =
        useState('');

    /*
    |--------------------------------------------------------------------------
    | Selected category
    |--------------------------------------------------------------------------
    | Une seule subcategory peut être sélectionnée.
    */

    const selectedCategoryId =
        selectedIds?.length > 0
            ? Number(selectedIds[0])
            : null;

    /*
    |--------------------------------------------------------------------------
    | Parents
    |--------------------------------------------------------------------------
    */

    const parents = useMemo(
        () =>
            categories.filter(
                (category) =>
                    category.parent_id === null
            ),
        [categories]
    );

    /*
    |--------------------------------------------------------------------------
    | Toggle parent group
    |--------------------------------------------------------------------------
    */

    const toggleGroup = (parentId) => {
        const id = Number(parentId);

        setOpenGroups((previous) => {
            const next = new Set(previous);

            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }

            return next;
        });
    };

    /*
    |--------------------------------------------------------------------------
    | Select ONE category
    |--------------------------------------------------------------------------
    */

    const selectCategory = (categoryId) => {
        const id = Number(categoryId);

        /*
         * Si on clique sur la catégorie déjà sélectionnée,
         * on la désélectionne.
         */
        if (selectedCategoryId === id) {
            onChange([]);
            return;
        }

        /*
         * Sinon elle remplace automatiquement
         * l'ancienne sélection.
         */
        onChange([categoryId]);
    };

    /*
    |--------------------------------------------------------------------------
    | Open create modal
    |--------------------------------------------------------------------------
    */

    const openCreateModal = (parent) => {
        setModalParent(parent);
        setNewCategoryName('');
        setCategoryCreateError('');
    };

    /*
    |--------------------------------------------------------------------------
    | Close modal
    |--------------------------------------------------------------------------
    */

    const closeCreateModal = () => {
        /*
         * Ici on ne bloque PAS la fermeture après création.
         *
         * Le bouton Annuler / Escape ne doit simplement
         * pas fermer pendant le chargement.
         */
        if (creatingCategory) {
            return;
        }

        setModalParent(null);
        setNewCategoryName('');
        setCategoryCreateError('');
    };

    /*
    |--------------------------------------------------------------------------
    | Create category
    |--------------------------------------------------------------------------
    */

    const createCategory = async () => {
        const name = newCategoryName.trim();

        if (!name) {
            setCategoryCreateError(
                'Le nom de la catégorie est obligatoire.'
            );

            return;
        }

        if (!modalParent) {
            return;
        }

        setCreatingCategory(true);
        setCategoryCreateError('');

        try {
            const csrfToken =
                document
                    .querySelector(
                        'meta[name="csrf-token"]'
                    )
                    ?.getAttribute('content') || '';

            const response = await fetch(
                route(
                    'admin.categories.quick-store'
                ),
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json',

                        Accept:
                            'application/json',

                        'X-CSRF-TOKEN':
                            csrfToken,
                    },

                    credentials:
                        'same-origin',

                    body: JSON.stringify({
                        name,
                        parent_id:
                            modalParent.id,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.errors?.name?.[0] ||
                    data?.message ||
                    'Impossible de créer la catégorie.'
                );
            }

            const newCategory =
                data.category;

            /*
             * Add new category to ProductForm local state.
             */
            onCategoryCreated?.(
                newCategory
            );

            /*
             * IMPORTANT:
             * Une seule catégorie.
             *
             * La nouvelle catégorie remplace
             * automatiquement l'ancienne.
             */
            onChange([
                newCategory.id,
            ]);

            /*
             * Ouvrir le parent pour montrer
             * la nouvelle catégorie.
             */
            setOpenGroups((previous) => {
                const next = new Set(previous);

                next.add(
                    Number(
                        newCategory.parent_id
                    )
                );

                return next;
            });

            /*
             * Fermer directement le modal.
             *
             * On ne passe PAS par closeCreateModal()
             * car creatingCategory est encore true
             * à cet instant.
             */
            setModalParent(null);
            setNewCategoryName('');
            setCategoryCreateError('');
        } catch (error) {
            setCategoryCreateError(
                error.message ||
                'Une erreur est survenue.'
            );
        } finally {
            setCreatingCategory(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Selected count
    |--------------------------------------------------------------------------
    */

    const isSelected = (categoryId) =>
        selectedCategoryId ===
        Number(categoryId);

    return (
        <>
            <div>
                {/* =====================================================
                    HEADER
                ====================================================== */}

                <div className="mb-2 flex items-center justify-between">
                    <InputLabel value="Catégorie" />

                    {selectedCategoryId !== null && (
                        <span className="rounded-full bg-[var(--color-primary)]/15 px-2.5 py-1 text-[10px] font-semibold text-slate-700">
                            1 sélectionnée
                        </span>
                    )}
                </div>

                {/* =====================================================
                    CATEGORY LIST
                ====================================================== */}

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    {parents.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                            <p className="text-sm text-slate-500">
                                Aucune catégorie disponible.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {parents.map(
                                (parent) => {
                                    const children =
                                        categories.filter(
                                            (
                                                category
                                            ) =>
                                                Number(
                                                    category.parent_id
                                                ) ===
                                                Number(
                                                    parent.id
                                                )
                                        );

                                    const isOpen =
                                        openGroups.has(
                                            Number(
                                                parent.id
                                            )
                                        );

                                    const selectedCount =
                                        children.some(
                                            (
                                                child
                                            ) =>
                                                isSelected(
                                                    child.id
                                                )
                                        )
                                            ? 1
                                            : 0;

                                    return (
                                        <div
                                            key={
                                                parent.id
                                            }
                                        >
                                            {/* =================================================
                                                PARENT
                                            ================================================== */}

                                            <div className="flex items-center justify-between gap-3 bg-slate-50/70 px-4 py-3">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        toggleGroup(
                                                            parent.id
                                                        )
                                                    }
                                                    className="flex min-w-0 flex-1 items-center gap-2 text-left"
                                                >
                                                    <ChevronDown
                                                        className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${isOpen
                                                                ? 'rotate-0'
                                                                : '-rotate-90'
                                                            }`}
                                                    />

                                                    <span className="truncate text-sm font-semibold text-slate-800">
                                                        {
                                                            parent.name
                                                        }
                                                    </span>

                                                    {selectedCount >
                                                        0 && (
                                                            <span className="rounded-full bg-[var(--color-primary)]/20 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                                                                1
                                                            </span>
                                                        )}
                                                </button>

                                                {/* New category */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openCreateModal(
                                                            parent
                                                        )
                                                    }
                                                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-[var(--color-primary)]/15 hover:text-slate-950"
                                                >
                                                    <Plus className="h-3.5 w-3.5" />

                                                    Nouvelle
                                                </button>
                                            </div>

                                            {/* =================================================
                                                CHILDREN
                                            ================================================== */}

                                            {isOpen && (
                                                <div className="space-y-1 px-4 py-3">
                                                    {children.length ===
                                                        0 ? (
                                                        <div className="rounded-xl border border-dashed border-slate-200 px-4 py-4 text-center">
                                                            <p className="text-xs text-slate-400">
                                                                Aucune
                                                                sous-catégorie.
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        children.map(
                                                            (
                                                                child
                                                            ) => {
                                                                const selected =
                                                                    isSelected(
                                                                        child.id
                                                                    );

                                                                return (
                                                                    <button
                                                                        key={
                                                                            child.id
                                                                        }
                                                                        type="button"
                                                                        onClick={() =>
                                                                            selectCategory(
                                                                                child.id
                                                                            )
                                                                        }
                                                                        className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${selected
                                                                                ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
                                                                                : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
                                                                            }`}
                                                                    >
                                                                        {/* Checkbox */}
                                                                        <span
                                                                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${selected
                                                                                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-slate-950'
                                                                                    : 'border-slate-300 bg-white'
                                                                                }`}
                                                                        >
                                                                            {selected && (
                                                                                <Check className="h-3.5 w-3.5" />
                                                                            )}
                                                                        </span>

                                                                        {/* Name */}
                                                                        <span
                                                                            className={`text-sm ${selected
                                                                                    ? 'font-semibold text-slate-900'
                                                                                    : 'text-slate-600'
                                                                                }`}
                                                                        >
                                                                            {
                                                                                child.name
                                                                            }
                                                                        </span>
                                                                    </button>
                                                                );
                                                            }
                                                        )
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    )}
                </div>

                <InputError
                    message={error}
                    className="mt-2"
                />
            </div>

            {/* =========================================================
                CREATE CATEGORY MODAL
            ========================================================== */}

            <CreateCategoryModal
                open={Boolean(modalParent)}
                parent={modalParent}
                name={newCategoryName}
                onNameChange={
                    setNewCategoryName
                }
                error={categoryCreateError}
                loading={creatingCategory}
                onClose={
                    closeCreateModal
                }
                onCreate={
                    createCategory
                }
            />
        </>
    );
}