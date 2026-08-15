import { Link } from '@inertiajs/react';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

export default function Success({ order }) {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="mx-auto max-w-4xl px-4">

                {/* Success Header */}
                <div className="mb-8 text-center">

                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle
                            className="h-9 w-9 text-green-600"
                        />
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900">
                        Commande confirmée !
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Merci pour votre commande.
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        Commande #{order.order_number}
                    </p>

                </div>


                {/* Order Card */}
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

                    {/* Header */}
                    <div className="border-b px-6 py-5">

                        <div className="flex items-center gap-3">

                            <Package className="h-6 w-6 text-gray-700" />

                            <div>
                                <h2 className="font-semibold text-gray-900">
                                    Votre commande
                                </h2>

                                <p className="text-sm text-gray-500">
                                    #{order.order_number}
                                </p>
                            </div>

                        </div>

                    </div>


                    {/* Items */}
                    <div className="divide-y">

                        {order.items.map((item) => {

                            const product = item.product;

                            const image =
                                product?.primary_image?.path ?? null;

                            return (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-4 p-6"
                                >

                                    {/* Image */}
                                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">

                                        {image ? (
                                            <img
                                                src={image}
                                                alt={product?.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-xs text-gray-400">
                                                No image
                                            </div>
                                        )}

                                    </div>


                                    {/* Product */}
                                    <div className="min-w-0 flex-1">

                                        <h3 className="font-medium text-gray-900">
                                            {product?.title}
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Quantité : {item.quantity}
                                        </p>

                                    </div>


                                    {/* Price */}
                                    <div className="text-right">

                                        <p className="font-semibold text-gray-900">
                                            {(
                                                Number(item.unit_price) *
                                                item.quantity
                                            ).toFixed(2)} MAD
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            {Number(item.unit_price).toFixed(2)} MAD / unité
                                        </p>

                                    </div>

                                </div>
                            );
                        })}

                    </div>


                    {/* Total */}
                    <div className="border-t bg-gray-50 px-6 py-5">

                        <div className="flex items-center justify-between">

                            <span className="font-medium text-gray-600">
                                Total
                            </span>

                            <span className="text-2xl font-bold text-gray-900">
                                {Number(order.total_amount).toFixed(2)} MAD
                            </span>

                        </div>

                    </div>

                </div>


                {/* Actions */}
                <div className="mt-8 flex justify-center">

                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
                    >
                        Continuer mes achats

                        <ArrowRight className="h-4 w-4" />
                    </Link>

                </div>

            </div>
        </div>
    );
}