import React from 'react';

export default function CustomerInformation({
    isAuthenticated,
    user,
    data,
    setData,
    errors,
    isDigital = false,
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6">

            <h2 className="mb-6 text-xl font-semibold text-slate-900">
                Vos informations {isDigital && <span className="text-sm font-normal text-slate-500">(Produit digital)</span>}
            </h2>

            {isAuthenticated ? (

                <div className="rounded-xl bg-slate-50 p-4">

                    <p className="font-semibold text-slate-900">
                        {user?.name}
                    </p>

                    <p className="text-sm text-slate-600">
                        {user?.email}
                    </p>
                    {isDigital && (
                        <p className="mt-2 text-xs font-medium text-emerald-700">
                            ✓ Vos liens de téléchargement seront envoyés à cette adresse email.
                        </p>
                    )}

                </div>

            ) : (

                <div className="space-y-5">

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Nom complet *
                        </label>

                        <input
                            type="text"
                            value={data?.customer_name ?? ''}
                            onChange={(e) =>
                                setData(
                                    'customer_name',
                                    e.target.value
                                )
                            }
                            className="w-full rounded-lg border border-slate-300 p-3"
                            placeholder="Votre nom complet"
                        />

                        {errors?.customer_name && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.customer_name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Email {isDigital ? '* (Requis pour la livraison des fichiers)' : ''}
                        </label>

                        <input
                            type="email"
                            required={isDigital}
                            value={data?.customer_email ?? ''}
                            onChange={(e) =>
                                setData(
                                    'customer_email',
                                    e.target.value
                                )
                            }
                            className="w-full rounded-lg border border-slate-300 p-3"
                            placeholder="exemple@email.com"
                        />

                        {isDigital && (
                            <p className="mt-1 text-xs text-slate-500">
                                Le fichier numérique sera envoyé directement à cette adresse.
                            </p>
                        )}

                        {errors?.customer_email && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.customer_email}
                            </p>
                        )}
                    </div>

                </div>

            )}

        </section>
    );
}