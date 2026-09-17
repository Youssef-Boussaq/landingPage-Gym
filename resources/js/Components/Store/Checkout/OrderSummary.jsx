export default function OrderSummary({ cart = [] }) {
    const subtotal = cart.reduce(
        (total, item) =>
            total +
            Number(item.price ?? 0) * Number(item.quantity ?? 0),
        0
    );

    const shipping = subtotal > 250 ? 0 : 35;
    const totalAmount = subtotal + shipping;
    const amountForFreeShipping = 250 - subtotal;

    return (
        <aside className="rounded-2xl border border-slate-200 bg-white p-6">

            <h2 className="mb-6 text-xl font-semibold">
                Your Order
            </h2>

            <div className="space-y-5">
                {cart.map((item) => {
                    const itemTotal =
                        Number(item.price ?? 0) *
                        Number(item.quantity ?? 0);

                    return (
                        <div
                            key={item.key}
                            className="flex gap-4"
                        >
                            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">

                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-xs text-slate-400">
                                        No image
                                    </div>
                                )}

                                <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-slate-900 px-1.5 text-xs text-white">
                                    {item.quantity}
                                </span>
                            </div>

                            <div className="min-w-0 flex-1">

                                <div className="flex justify-between gap-3">

                                    <div>
                                        <h3 className="font-medium">
                                            {item.name}
                                        </h3>

                                        {item.variant_id && (
                                            <p className="text-sm text-slate-500">
                                                Variant #{item.variant_id}
                                            </p>
                                        )}

                                        <p className="mt-1 text-sm text-slate-500">
                                            {Number(item.price).toFixed(2)} DH
                                        </p>
                                    </div>

                                    <p className="font-semibold">
                                        {itemTotal.toFixed(2)} DH
                                    </p>

                                </div>

                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="my-6 border-t border-slate-200" />

            {/* Free Shipping UI */}
            <div className="mb-6 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-xl shadow-sm">
                        {subtotal > 250 ? '🎉' : '🚚'}
                    </div>
                    <div className="flex-1">
                        {subtotal > 250 ? (
                            <p className="font-bold text-green-600">
                                Livraison gratuite offerte !
                            </p>
                        ) : (
                            <>
                                <p className="font-bold text-slate-900">
                                    Livraison 35 DH
                                </p>
                                <p className="mt-0.5 text-xs text-orange-500">
                                    Ajoutez encore {amountForFreeShipping.toFixed(2)} DH pour profiter de la livraison gratuite.
                                </p>
                            </>
                        )}
                    </div>
                </div>
                {subtotal <= 250 && (
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                        <div 
                            className="h-full bg-slate-900 transition-all duration-500"
                            style={{ width: `${Math.min((subtotal / 250) * 100, 100)}%` }}
                        />
                    </div>
                )}
            </div>

            <div className="flex justify-between text-sm">
                <span className="text-slate-500">Sous-total</span>
                <span className="font-medium text-slate-900">
                    {subtotal.toFixed(2)} DH
                </span>
            </div>

            <div className="mt-3 flex justify-between text-sm">
                <span className="text-slate-500">Livraison</span>
                <span className="font-medium text-slate-900">
                    {shipping === 0 ? 'Offerte' : `${shipping.toFixed(2)} DH`}
                </span>
            </div>

            <div className="my-4 border-t border-slate-200" />

            <div className="flex justify-between text-lg font-bold">
                <span className="text-slate-900">Total</span>
                <span className="text-slate-900">
                    {totalAmount.toFixed(2)} DH
                </span>
            </div>

        </aside>
    );
}