import ProductCard from '@/Components/Store/ProductCard';

export default function AdminProductPreview({ product }) {
    const inStock = !product.manage_stock || (product.stock_quantity ?? 0) > 0;

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Live Preview
            </h3>
            <ProductCard product={product} preview />
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-slate-500">Type</span>
                    <span className="font-semibold capitalize text-slate-900">
                        {product.type || 'physical'}
                    </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                    <span className="text-slate-500">Stock</span>
                    <span className={`font-semibold ${product.type === 'digital' ? 'text-emerald-700' : (inStock ? 'text-emerald-700' : 'text-rose-700')}`}>
                        {product.type === 'digital'
                            ? 'Illimité (Digital)'
                            : (product.manage_stock
                                ? `${product.stock_quantity ?? 0} ${inStock ? 'en stock' : 'rupture'}`
                                : 'Non géré')}
                    </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                    <span className="text-slate-500">Statut</span>
                    <span className={`font-semibold ${product.is_active ? 'text-emerald-700' : 'text-slate-500'}`}>
                        {product.is_active ? 'Actif' : 'Inactif'}
                    </span>
                </div>
            </div>
        </div>
    );
}
