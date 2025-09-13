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

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    
    setIsAdding(true);
    try {
      await addItem(selectedVariant, quantity);
      // Show success feedback
      alert('Added to cart!');
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

  const images = product.images.edges;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            {images[selectedImage] && (
              <Image
                src={images[selectedImage].node.url}
                alt={images[selectedImage].node.altText || product.title}
                fill
                className="object-cover object-center"
              />
            )}
          </div>
          
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square overflow-hidden rounded-lg bg-gray-100 ${
                    selectedImage === index ? 'ring-2 ring-black' : ''
                  }`}
                >
                  <Image
                    src={image.node.url}
                    alt={image.node.altText || ''}
                    fill
                    className="object-cover object-center"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <p className="text-2xl font-semibold mb-6">{formattedPrice}</p>
          
          <div className="mb-6">
            <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
          </div>

          {/* Variant Selector */}
          {product.variants.edges.length > 1 && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Options
              </label>
              <select
                value={selectedVariant}
                onChange={(e) => setSelectedVariant(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
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
            <label className="block text-sm font-medium mb-2">
              Quantity
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 px-3 py-2 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!currentVariant?.availableForSale || isAdding || loading}
            className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
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