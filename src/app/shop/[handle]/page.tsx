import { getProduct } from '@/lib/shopify/api';
import ProductDetail from '@/components/shop/ProductDetail';
import CartButton from '@/components/shop/CartButton';
import { notFound } from 'next/navigation';

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Await params for Next.js 15
  const resolvedParams = await params;
  const handle = resolvedParams.handle;
  
  try {
    
    console.log('Product page - Handle:', handle);
    
    // Fetch the product with error handling
    const product = await getProduct(handle);
    
    console.log('Product fetched:', product ? `Success - ${product.title}` : 'Not found');
    
    if (!product) {
      console.log('Product not found, returning 404');
      notFound();
    }

    // Temporary debug for production
    console.log('Product data shape:', {
      id: product.id,
      title: product.title,
      handle: product.handle,
      hasImages: !!product.images?.edges?.length,
      hasVariants: !!product.variants?.edges?.length,
      priceRange: product.priceRange
    });

    return (
      <div className="min-h-screen pt-32 px-4 sm:px-8">
        <ProductDetail product={product} />
        <CartButton />
      </div>
    );
  } catch (error) {
    console.error('Error in ProductPage:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    console.error('Params received:', params);
    
    // In development, show the error
    if (process.env.NODE_ENV === 'development') {
      return (
        <div className="min-h-screen pt-32 px-4 sm:px-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <h1 className="font-bold">Error loading product</h1>
            <p>Handle: {handle}</p>
            <pre className="mt-2 text-sm">{error?.toString()}</pre>
          </div>
        </div>
      );
    }
    // In production, show not found
    notFound();
  }
}