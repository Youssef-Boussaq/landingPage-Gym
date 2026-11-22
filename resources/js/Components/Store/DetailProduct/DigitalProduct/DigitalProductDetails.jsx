import React from 'react';
import DigitalFileInfo from './DigitalFileInfo';
import DigitalProductActions from './DigitalProductActions';

export default function DigitalProductDetails({ product, onBuyNow }) {
    let format = 'FICHIER NUMÉRIQUE';
    if (product?.digital_file_name) {
        const ext = product.digital_file_name.split('.').pop()?.toUpperCase();
        if (ext) format = ext;
    } else if (product?.digital_download_link) {
        format = "LIEN D'ACCÈS CLOUD";
    }

    return (
        <div className="space-y-6">
            <DigitalFileInfo 
                format={format} 
                size={product?.formatted_file_size || (product?.digital_download_link ? 'En ligne' : 'Immédiat')} 
                fileName={product?.digital_file_name}
                hasLink={!!product?.digital_download_link}
            />
            
            <DigitalProductActions onBuyNow={onBuyNow} />
        </div>
    );
}
