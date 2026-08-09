import React from 'react';
import DigitalFileInfo from './DigitalFileInfo';
import DigitalProductActions from './DigitalProductActions';

export default function DigitalProductDetails({ product, onBuyNow }) {
    return (
        <div className="space-y-6">
            <DigitalFileInfo 
                format={product.file_format || 'PDF'} 
                size={product.file_size || '2.4 MB'} 
                pages={product.pages} 
            />
            
            <DigitalProductActions onBuyNow={onBuyNow} />
        </div>
    );
}
