import React from 'react';

export default function ShippingInformation({
    data,
    setData,
    errors,
}) {
    return (
        <section className="mt-6 border border-[#e5e7eb] bg-white p-6 sm:p-8 rounded-none font-favorit">
            <div className="mb-6 flex items-center gap-3 border-b border-[#e5e7eb] pb-4">
                <span className="flex h-6 w-6 items-center justify-center rounded-[4px] bg-[#000000] text-xs font-bold text-white">
                    2
                </span>
                <h2 className="text-[14px] font-bold uppercase tracking-[0.025em] text-[#000000]">
                    Adresse de livraison
                </h2>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-[12px] font-medium uppercase tracking-[0.025em] text-[#333333] mb-1.5">
                        Numéro de téléphone *
                    </label>
                    <input
                        type="text"
                        value={data.customer_phone || ''}
                        onChange={(e) => setData('customer_phone', e.target.value)}
                        placeholder="06 12 34 56 78"
                        className="w-full rounded-[4px] border border-[#e5e7eb] px-3.5 py-2.5 text-sm text-[#000000] focus:border-[#000000] focus:outline-none focus:ring-0"
                    />
                    {errors?.customer_phone && (
                        <p className="mt-1 text-xs text-red-600">{errors.customer_phone}</p>
                    )}
                </div>

                <div>
                    <label className="block text-[12px] font-medium uppercase tracking-[0.025em] text-[#333333] mb-1.5">
                        Adresse complète *
                    </label>
                    <textarea
                        rows={2}
                        value={data.shipping_address || ''}
                        onChange={(e) => setData('shipping_address', e.target.value)}
                        placeholder="Numéro, rue, quartier, étage..."
                        className="w-full rounded-[4px] border border-[#e5e7eb] px-3.5 py-2.5 text-sm text-[#000000] focus:border-[#000000] focus:outline-none focus:ring-0"
                    />
                    {errors?.shipping_address && (
                        <p className="mt-1 text-xs text-red-600">{errors.shipping_address}</p>
                    )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="block text-[12px] font-medium uppercase tracking-[0.025em] text-[#333333] mb-1.5">
                            Ville *
                        </label>
                        <input
                            type="text"
                            value={data.city || ''}
                            onChange={(e) => setData('city', e.target.value)}
                            placeholder="Casablanca, Rabat, Marrakech..."
                            className="w-full rounded-[4px] border border-[#e5e7eb] px-3.5 py-2.5 text-sm text-[#000000] focus:border-[#000000] focus:outline-none focus:ring-0"
                        />
                        {errors?.city && (
                            <p className="mt-1 text-xs text-red-600">{errors.city}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-[12px] font-medium uppercase tracking-[0.025em] text-[#333333] mb-1.5">
                            Code Postal
                        </label>
                        <input
                            type="text"
                            value={data.postal_code || ''}
                            onChange={(e) => setData('postal_code', e.target.value)}
                            placeholder="Optionnel"
                            className="w-full rounded-[4px] border border-[#e5e7eb] px-3.5 py-2.5 text-sm text-[#000000] focus:border-[#000000] focus:outline-none focus:ring-0"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}