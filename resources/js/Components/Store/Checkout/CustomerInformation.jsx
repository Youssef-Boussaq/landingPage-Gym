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
        <section className="border border-[#e5e7eb] bg-white p-6 sm:p-8 rounded-none font-favorit">
            <div className="mb-6 flex items-center justify-between border-b border-[#e5e7eb] pb-4">
                <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-[4px] bg-[#000000] text-xs font-bold text-white">
                        1
                    </span>
                    <h2 className="text-[14px] font-bold uppercase tracking-[0.025em] text-[#000000]">
                        Vos coordonnées {isDigital && <span className="font-normal text-[#666666]">(Produit numérique)</span>}
                    </h2>
                </div>
                {isDigital && (
                    <span className="rounded-none border border-[#000000] bg-[#f0efe7] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.05em] text-[#000000]">
                        Email livraison
                    </span>
                )}
            </div>

            {isAuthenticated ? (
                <div className="border border-[#e5e7eb] bg-[#f0efe7] p-4 rounded-none">
                    <p className="text-[13px] font-bold uppercase tracking-[0.025em] text-[#000000]">
                        {user?.name}
                    </p>
                    <p className="text-[12px] text-[#666666] mt-0.5">
                        {user?.email}
                    </p>
                    {isDigital && (
                        <p className="mt-2 text-[11px] font-medium text-[#000000]">
                            ✓ Vos liens de téléchargement seront envoyés à cette adresse email.
                        </p>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    <div>
                        <label className="block text-[12px] font-medium uppercase tracking-[0.025em] text-[#333333] mb-1.5">
                            Nom complet *
                        </label>
                        <input
                            type="text"
                            value={data?.customer_name ?? ''}
                            onChange={(e) => setData('customer_name', e.target.value)}
                            className="w-full rounded-[4px] border border-[#e5e7eb] px-3.5 py-2.5 text-sm text-[#000000] focus:border-[#000000] focus:outline-none focus:ring-0"
                            placeholder="Votre nom complet"
                        />
                        {errors?.customer_name && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.customer_name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-[12px] font-medium uppercase tracking-[0.025em] text-[#333333] mb-1.5">
                            Adresse Email {isDigital ? '* (Requis pour la livraison de vos fichiers)' : '*'}
                        </label>
                        <input
                            type="email"
                            required
                            value={data?.customer_email ?? ''}
                            onChange={(e) => setData('customer_email', e.target.value)}
                            className="w-full rounded-[4px] border border-[#e5e7eb] px-3.5 py-2.5 text-sm text-[#000000] focus:border-[#000000] focus:outline-none focus:ring-0"
                            placeholder="exemple@domaine.com"
                        />
                        {errors?.customer_email && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.customer_email}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}