'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShopifyProduct } from '@/lib/shopify/types';
import { useCart } from '@/contexts/CartContext';

interface ProductDetailProps {
  product: ShopifyProduct;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { addItem, loading } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants.edges[0]?.node.id || ''
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    
    setIsAdding(true);
    try {
      await addItem(selectedVariant, quantity);
      // Cart notification will show automatically
    } catch {
      alert('Error adding to cart. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const currentVariant = product.variants.edges.find(
    (v) => v.node.id === selectedVariant
  )?.node;

  const price = currentVariant ? parseFloat(currentVariant.price.amount) : 0;
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currentVariant?.price.currencyCode || 'USD',
  }).format(price);

  const images = product.images?.edges || [];
  const hasImages = images.length > 0;
  const currentImage = images[selectedImage];
  
  // Debug logging for production
  if (typeof window !== 'undefined' && !currentImage && hasImages) {
    console.error('Image carousel issue:', {
      selectedImage,
      imagesLength: images.length,
      images: images.map(img => ({ url: img.node.url }))
    });
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            {hasImages && currentImage && !imageError ? (
              <Image
                src={currentImage.node.url}
                alt={currentImage.node.altText || product.title}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                onError={() => {
                  console.error('Failed to load image:', currentImage.node.url);
                  setImageError(true);
                }}
                onLoad={() => setImageError(false)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedImage(index);
                    setImageError(false);
                  }}
                  className={`relative aspect-square overflow-hidden rounded-lg bg-gray-100 ${
                    selectedImage === index ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <Image
                    src={image.node.url}
                    alt={image.node.altText || ''}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 25vw, 12.5vw"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4 text-white">{product.title}</h1>
          <p className="text-2xl font-semibold mb-6 text-gray-200">{formattedPrice}</p>
          
          <div className="mb-6">
            <p className="text-gray-300 whitespace-pre-wrap">{product.description}</p>
          </div>

          {/* Variant Selector */}
          {product.variants.edges.length > 1 && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-200">
                Options
              </label>
              <select
                value={selectedVariant}
                onChange={(e) => setSelectedVariant(e.target.value)}
                className="w-64 px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {product.variants.edges.map((variant) => (
                  <option
                    key={variant.node.id}
                    value={variant.node.id}
                    disabled={!variant.node.availableForSale}
                  >
                    {variant.node.title}
                    {!variant.node.availableForSale && ' (Out of Stock)'}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-200">
              Quantity
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 bg-gray-800 text-white border border-gray-600 rounded-lg hover:bg-gray-700"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 px-3 py-2 text-center bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 bg-gray-800 text-white border border-gray-600 rounded-lg hover:bg-gray-700"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!currentVariant?.availableForSale || isAdding || loading}
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed mb-6 md:mb-0"
          >
            {!currentVariant?.availableForSale
              ? 'Out of Stock'
              : isAdding
              ? 'Adding...'
              : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}