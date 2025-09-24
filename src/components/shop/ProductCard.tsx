'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShopifyProduct } from '@/lib/shopify/types';

interface ProductCardProps {
  product: ShopifyProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: product.priceRange.minVariantPrice.currencyCode,
  }).format(price);

  const imageUrl = product.images.edges[0]?.node.url || '/placeholder.png';
  const imageAlt = product.images.edges[0]?.node.altText || product.title;

  return (
    <Link href={`/shop/${product.handle}`}>
      <div className="group cursor-pointer">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="mt-4 space-y-1">
          <h3 className="text-lg font-medium text-white group-hover:text-gray-300 transition-colors">
            {product.title}
          </h3>
          <p className="text-lg font-semibold text-gray-200">{formattedPrice}</p>
        </div>
      </div>
    </Link>
  );
}