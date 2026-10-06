import { useForm } from '@inertiajs/react';
import {
    Check,
    Palette,
    RotateCcw,
    Save,
} from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
const defaultColors = {
    primary: '#9de500',
    primary_hover: '#8cd000',
    primary_dark: '#7ec000',
    primary_light: '#b8f526',
};


const colorFields = [
    {
        key: 'primary',
        label: 'Couleur principale',
        description: 'Couleur principale de votre interface.',
    },
    {
        key: 'primary_hover',
        label: 'Couleur au survol',
        description: 'Utilisée lorsque l’utilisateur survole un élément.',
    },
    {
        key: 'primary_dark',
        label: 'Couleur principale foncée',
        description: 'Utilisée pour les textes et accents plus foncés.',
    },
    {
        key: 'primary_light',
        label: 'Couleur principale claire',
        description: 'Utilisée pour les arrière-plans et accents légers.',
    },
];

export default function Index({ appearance }) {
    const form = useForm({
        primary: appearance?.primary || defaultColors.primary,
        primary_hover:
            appearance?.primary_hover ||
            defaultColors.primary_hover,
        primary_dark:
            appearance?.primary_dark ||
            defaultColors.primary_dark,
        primary_light:
            appearance?.primary_light ||
            defaultColors.primary_light,
    });

    const submit = (e) => {
        e.preventDefault();

        form.patch(route('admin.settings.appearance.update'));
    };

    const resetColors = () => {
        form.setData({
            primary: defaultColors.primary,
            primary_hover: defaultColors.primary_hover,
            primary_dark: defaultColors.primary_dark,
            primary_light: defaultColors.primary_light,
        });
    };

    return (
        <AdminLayout title="Paramètres">
            <div className="min-h-screen bg-[#f7f9f4] px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl">

                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3">
                            <div
                                className="
                                flex h-11 w-11
                                items-center justify-center
                                rounded-2xl
                                bg-[var(--color-primary)]/15
                                text-[var(--color-primary-dark)]
                            "
                            >
                                <Palette
                                    size={21}
                                    strokeWidth={2.2}
                                />
                            </div>

                            <div>
                                <h1
                                    className="
                                    font-archivo
                                    text-xl
                                    uppercase
                                    tracking-wide
                                    text-[var(--color-black)]
                                "
                                >
                                    Paramètres
                                </h1>

                                <p className="mt-1 text-sm text-[#596254]">
                                    Personnalisez l’apparence de votre boutique.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Appearance card */}
                    <form onSubmit={submit}>
                        <section
                            className="
                            overflow-hidden
                            rounded-3xl
                            border border-black/[0.08]
                            bg-white
                            shadow-[0_15px_45px_rgba(11,12,14,0.06)]
                        "
                        >
                            {/* Section header */}
                            <div
                                className="
                                border-b
                                border-black/[0.06]
                                px-5
                                py-5
                                sm:px-6
                            "
                            >
                                <h2 className="text-base font-black text-[var(--color-black)]">
                                    Couleurs de l’interface
                                </h2>

                                <p className="mt-1 text-xs leading-5 text-[#596254]">
                                    Modifiez les couleurs principales utilisées
                                    dans toute l’application.
                                </p>
                            </div>

                            {/* Colors */}
                            <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
                                {colorFields.map((field) => (
                                    <div
                                        key={field.key}
                                        className="
                                        rounded-2xl
                                        border border-black/[0.07]
                                        bg-[#f8faf5]
                                        p-4
                                    "
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <label
                                                    htmlFor={field.key}
                                                    className="
                                                    text-sm
                                                    font-bold
                                                    text-[var(--color-black)]
                                                "
                                                >
                                                    {field.label}
                                                </label>

                                                <p className="mt-1 text-[11px] leading-5 text-[#7b8475]">
                                                    {field.description}
                                                </p>
                                            </div>

                                            {/* Color picker */}
                                            <input
                                                id={field.key}
                                                type="color"
                                                value={form.data[field.key]}
                                                onChange={(e) =>
                                                    form.setData(
                                                        field.key,
                                                        e.target.value
                                                    )
                                                }
                                                className="
                                                h-11
                                                w-14
                                                shrink-0
                                                cursor-pointer
                                                rounded-xl
                                                border
                                                border-black/[0.08]
                                                bg-white
                                                p-1
                                            "
                                            />
                                        </div>

                                        {/* Hex value */}
                                        <div className="mt-4">
                                            <input
                                                type="text"
                                                value={form.data[field.key]}
                                                onChange={(e) =>
                                                    form.setData(
                                                        field.key,
                                                        e.target.value
                                                    )
                                                }
                                                className="
                                                w-full
                                                rounded-xl
                                                border
                                                border-black/[0.08]
                                                bg-white
                                                px-3
                                                py-2.5
                                                font-mono
                                                text-sm
                                                font-semibold
                                                text-[var(--color-black)]
                                                outline-none
                                                transition
                                                focus:border-[var(--color-primary-dark)]
                                                focus:ring-2
                                                focus:ring-[var(--color-primary)]/20
                                            "
                                                placeholder="#9de500"
                                            />
                                        </div>

                                        {form.errors[field.key] && (
                                            <p className="mt-2 text-xs font-semibold text-red-500">
                                                {form.errors[field.key]}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Preview */}
                            <div className="border-t border-black/[0.06] px-5 py-5 sm:px-6">
                                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#8a9384]">
                                    Aperçu
                                </p>

                                <div className="flex flex-wrap gap-3">
                                    <div
                                        className="rounded-xl px-4 py-2.5 text-sm font-bold text-black"
                                        style={{
                                            backgroundColor:
                                                form.data.primary,
                                        }}
                                    >
                                        Principal
                                    </div>

                                    <div
                                        className="rounded-xl px-4 py-2.5 text-sm font-bold text-white"
                                        style={{
                                            backgroundColor:
                                                form.data.primary_dark,
                                        }}
                                    >
                                        Principal foncé
                                    </div>

                                    <div
                                        className="rounded-xl px-4 py-2.5 text-sm font-bold text-black"
                                        style={{
                                            backgroundColor:
                                                form.data.primary_light,
                                        }}
                                    >
                                        Principal clair
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div
                                className="
                                flex
                                flex-col-reverse
                                gap-3
                                border-t
                                border-black/[0.06]
                                bg-[#fbfcf9]
                                px-5
                                py-4
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                                sm:px-6
                            "
                            >
                                <button
                                    type="button"
                                    onClick={resetColors}
                                    className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    border border-black/[0.08]
                                    bg-white
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-bold
                                    text-[#596254]
                                    transition
                                    hover:bg-[#f3f5ef]
                                "
                                >
                                    <RotateCcw size={16} />
                                    Valeurs par défaut
                                </button>

                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-[var(--color-primary)]
                                    px-5
                                    py-2.5
                                    text-sm
                                    font-black
                                    text-black
                                    shadow-sm
                                    transition
                                    hover:bg-[var(--color-primary-hover)]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                                >
                                    {form.processing ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                                            Enregistrement...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={16} />
                                            Enregistrer
                                        </>
                                    )}
                                </button>
                            </div>
                        </section>
                    </form>

                    {/* Success message */}
                    {form.recentlySuccessful && (
                        <div
                            className="
                            mt-4
                            flex
                            items-center
                            gap-2
                            rounded-2xl
                            border
                            border-[var(--color-primary-dark)]/20
                            bg-[var(--color-primary)]/10
                            px-4
                            py-3
                            text-sm
                            font-semibold
                            text-[var(--color-primary-dark)]
                        "
                        >
                            <Check size={17} />
                            Les couleurs ont été enregistrées avec succès.
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}