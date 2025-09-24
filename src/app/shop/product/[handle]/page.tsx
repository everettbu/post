import { getProduct } from '@/lib/shopify/api';
import ProductDetail from '@/components/shop/ProductDetail';
import CartButton from '@/components/shop/CartButton';
import { notFound } from 'next/navigation';

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-32 px-4 sm:px-8">
      <ProductDetail product={product} />
      <CartButton />
    </div>
  );
}