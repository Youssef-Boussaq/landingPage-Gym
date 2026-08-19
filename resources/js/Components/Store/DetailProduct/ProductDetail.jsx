import React from 'react';
import { useProductDetail } from '../../../hooks/useProductDetail';
import { isProductDigital } from '../../../utils/productHelpers';

// Shared Components
import ProductDetailLayout from './Shared/ProductDetailLayout';
import ProductGallery from './Shared/ProductGallery';
import ProductInfo from './Shared/ProductInfo';
import ProductDescription from './Shared/ProductDescription';
import ProductReviews from './Shared/ProductReviews';
import ProductTags from './Shared/ProductTags';
import ProductBreadcrumb from './Shared/ProductBreadcrumb';

// Specific Components
import DigitalProductDetails from './DigitalProduct/DigitalProductDetails';
import PhysicalProductDetails from './PhysicalProduct/PhysicalProductDetails';

export default function ProductDetail({ product }) {
    const {
        activeImage,
        setActiveImage,
        quantity,
        handleQuantityChange,
        selectedVariant,
        setSelectedVariant,
        handleAddToCart,
        handleBuyNow
    } = useProductDetail(product);

    if (!product) return null;

    const isDigital = isProductDigital(product);

    const galleryComponent = (
        <ProductGallery
            images={product.images}
            activeImage={activeImage}
            onImageClick={setActiveImage}
            title={product.title}
        />
    );

    const infoComponent = (
        <>
            <ProductBreadcrumb productName={product.title} />
            <ProductInfo
                title={product.title}
                categoryName={product.categories?.[0]?.name}
                price={product.price}
                sale_price={product.sale_price}
                originalPrice={product.original_price}
            />
            <ProductTags tags={product.categories} />
        </>
    );

    const detailsComponent = (
        <div className="flex flex-col gap-6">
            {isDigital ? (
                <DigitalProductDetails
                    product={product}
                    onBuyNow={handleBuyNow}
                />
            ) : (
                <PhysicalProductDetails
                    product={product}
                    quantity={quantity}
                    onQuantityChange={handleQuantityChange}
                    selectedVariant={selectedVariant}
                    onVariantSelect={setSelectedVariant}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                />
            )}

            <ProductDescription description={product.description} />
        </div>
    );

    const reviewsComponent = <ProductReviews />;

    return (
        <ProductDetailLayout
            gallery={galleryComponent}
            info={infoComponent}
            details={detailsComponent}
            reviews={reviewsComponent}
        />
    );
}
