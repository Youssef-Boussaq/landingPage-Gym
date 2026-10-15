
import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    ImagePlus,
    Save,
    Eye,
    EyeOff,
    Flame,
    CheckCircle2,
} from 'lucide-react';

const textFields = [
    { name: 'badge', label: 'Badge', description: 'Petit texte au-dessus du titre.' },
    { name: 'title_line1', label: 'Titre - ligne 1' },
    { name: 'title_line2', label: 'Titre - ligne 2' },
    { name: 'title_line3', label: 'Titre - ligne 3' },
    { name: 'keywords', label: 'Mots-clés', description: 'Texte sous le titre.' },
    { name: 'cta_text', label: 'Texte du bouton' },
    { name: 'cta_href', label: 'Lien du bouton', description: 'Exemple : #contact' },
    { name: 'coach_image_alt', label: 'Texte alternatif de l’image' },
];

const visibilityFields = [
    { name: 'show_badge', label: 'Afficher le badge' },
    { name: 'show_title', label: 'Afficher le titre' },
    { name: 'show_keywords', label: 'Afficher les mots-clés' },
    { name: 'show_cta', label: 'Afficher le bouton' },
    { name: 'show_coach_image', label: 'Afficher l’image du coach' },
    { name: 'show_background_image', label: 'Afficher l’image de fond' },
    { name: 'show_slashes', label: 'Afficher les lignes vertes' },
];

function ImageUpload({
    title,
    name,
    currentImage,
    file,
    onChange,
    error,
}) {
    const [preview, setPreview] = useState(null);

    function handleChange(event) {
        const selectedFile = event.target.files?.[0] ?? null;

        onChange(selectedFile);
        setPreview(selectedFile ? URL.createObjectURL(selectedFile) : null);
    }

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="font-bold text-slate-900">{title}</h3>

            <div className="mt-4 flex min-h-48 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                <img
                    src={preview || currentImage}
                    alt={title}
                    className="max-h-64 w-full object-contain"
                />
            </div>

            <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
                <ImagePlus size={18} />
                {file ? file.name : 'Choisir une image'}

                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={handleChange}
                />
            </label>

            <p className="mt-2 text-xs text-slate-500">
                JPG, PNG ou WebP · 4 Mo maximum
            </p>

            {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}

export default function Edit({
    setting,
    backgroundImageUrl,
    coachImageUrl,
}) {
    const { data, setData, post, processing, errors, recentlySuccessful } =
        useForm({
            badge: setting.badge ?? '',
            title_line1: setting.title_line1 ?? '',
            title_line2: setting.title_line2 ?? '',
            title_line3: setting.title_line3 ?? '',
            keywords: setting.keywords ?? '',
            cta_text: setting.cta_text ?? '',
            cta_href: setting.cta_href ?? '#contact',
            coach_image_alt: setting.coach_image_alt ?? '',

            show_badge: Boolean(setting.show_badge),
            show_title: Boolean(setting.show_title),
            show_keywords: Boolean(setting.show_keywords),
            show_cta: Boolean(setting.show_cta),
            show_coach_image: Boolean(setting.show_coach_image),
            show_background_image: Boolean(setting.show_background_image),
            show_slashes: Boolean(setting.show_slashes),

            background_image: null,
            coach_image: null,
            _method: 'PUT',
        });

    function updateField(name, value) {
        setData(name, value);
    }

    function submit(event) {
        event.preventDefault();

        post(route('admin.hero.update'), {
            forceFormData: true,
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="Gestion du Hero" />

            <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <Link
                                href={route('admin.dashboard')}
                                className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900"
                            >
                                <ArrowLeft size={16} />
                                Retour au dashboard
                            </Link>

                            <h1 className="flex items-center gap-3 text-3xl font-black tracking-tight text-slate-900">
                                <Flame className="text-lime-600" size={30} />
                                Gestion du Hero
                            </h1>

                            <p className="mt-2 text-sm text-slate-500">
                                Modifiez le contenu principal de votre page d’accueil.
                            </p>
                        </div>

                        <a
                            href="/"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100"
                        >
                            <Eye size={18} />
                            Voir le site
                        </a>
                    </div>

                    {recentlySuccessful && (
                        <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-800">
                            <CheckCircle2 size={20} />
                            Les modifications ont été enregistrées.
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-8">
                        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
                            <div className="mb-6">
                                <h2 className="text-xl font-black text-slate-900">
                                    Textes du Hero
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Ces textes apparaissent dans la section principale.
                                </p>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                {textFields.map((field) => (
                                    <div
                                        key={field.name}
                                        className={
                                            ['keywords', 'cta_href'].includes(field.name)
                                                ? 'md:col-span-2'
                                                : ''
                                        }
                                    >
                                        <label
                                            htmlFor={field.name}
                                            className="mb-2 block text-sm font-bold text-slate-700"
                                        >
                                            {field.label}
                                        </label>

                                        <input
                                            id={field.name}
                                            type="text"
                                            value={data[field.name]}
                                            onChange={(event) =>
                                                updateField(field.name, event.target.value)
                                            }
                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-lime-500 focus:ring-2 focus:ring-lime-100"
                                        />

                                        {field.description && (
                                            <p className="mt-1 text-xs text-slate-500">
                                                {field.description}
                                            </p>
                                        )}

                                        {errors[field.name] && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors[field.name]}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
                            <h2 className="mb-2 text-xl font-black text-slate-900">
                                Images
                            </h2>

                            <p className="mb-6 text-sm text-slate-500">
                                Choisissez les images à utiliser dans le Hero.
                            </p>

                            <div className="grid gap-6 md:grid-cols-2">
                                <ImageUpload
                                    title="Image de fond"
                                    name="background_image"
                                    currentImage={backgroundImageUrl}
                                    file={data.background_image}
                                    onChange={(file) =>
                                        updateField('background_image', file)
                                    }
                                    error={errors.background_image}
                                />

                                <ImageUpload
                                    title="Image du coach"
                                    name="coach_image"
                                    currentImage={coachImageUrl}
                                    file={data.coach_image}
                                    onChange={(file) =>
                                        updateField('coach_image', file)
                                    }
                                    error={errors.coach_image}
                                />
                            </div>
                        </section>

                        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
                            <h2 className="mb-2 text-xl font-black text-slate-900">
                                Visibilité des éléments
                            </h2>

                            <p className="mb-6 text-sm text-slate-500">
                                Activez ou désactivez les éléments du Hero.
                            </p>

                            <div className="grid gap-3 sm:grid-cols-2">
                                {visibilityFields.map((field) => (
                                    <label
                                        key={field.name}
                                        className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50"
                                    >
                                        <span className="text-sm font-semibold text-slate-700">
                                            {field.label}
                                        </span>

                                        <input
                                            type="checkbox"
                                            checked={data[field.name]}
                                            onChange={(event) =>
                                                updateField(
                                                    field.name,
                                                    event.target.checked
                                                )
                                            }
                                            className="h-5 w-5 accent-lime-600"
                                        />

                                        {data[field.name] ? (
                                            <Eye size={16} className="text-lime-700" />
                                        ) : (
                                            <EyeOff size={16} className="text-slate-400" />
                                        )}
                                    </label>
                                ))}
                            </div>
                        </section>

                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <Link
                                href={route('admin.dashboard')}
                                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 font-bold text-slate-700 hover:bg-slate-50"
                            >
                                Annuler
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-lime-500 px-7 py-3 font-black text-slate-950 transition hover:bg-lime-400 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Save size={18} />
                                {processing ? 'Enregistrement...' : 'Enregistrer les modifications'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
