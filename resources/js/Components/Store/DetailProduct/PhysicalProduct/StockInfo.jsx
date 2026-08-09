import React from 'react';

export default function StockInfo({ inStock, stockCount }) {
    return (
        <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={`text-sm font-medium font-inter ${inStock ? 'text-green-700' : 'text-red-700'}`}>
                {inStock ? (stockCount ? `${stockCount} en stock` : 'En stock') : 'Rupture de stock'}



            </span>
        </div>
    );
}
