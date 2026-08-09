export const formatPrice = (price, currency = 'MAD') => {
    if (price === undefined || price === null) return `0.00 ${currency}`;
    const parsedPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(parsedPrice)) return `0.00 ${currency}`;
    
    return `${parsedPrice.toFixed(2)} ${currency}`;
};

export const getDiscountPercentage = (originalPrice, currentPrice) => {
    if (!originalPrice || !currentPrice || originalPrice <= currentPrice) return 0;
    const discount = ((originalPrice - currentPrice) / originalPrice) * 100;
    return Math.round(discount);
};

export const isProductDigital = (product) => {
    // Assuming product has a type or is_digital flag
    return product?.type === 'digital' || product?.is_digital === true;
};
