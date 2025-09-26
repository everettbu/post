import { getProducts } from '@/lib/shopify/api';
import ProductCard from '@/components/shop/ProductCard';
import CartButton from '@/components/shop/CartButton';
import { sortProductsByCustomOrder } from '@/lib/product-order';

export default async function ShopPage() {
  const products = await getProducts(20);
  const sortedProducts = products ? sortProductsByCustomOrder(products) : [];

  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Shop Coming Soon</h1>
          <p className="text-gray-600">
            Products will be available once you connect your Shopify store.
          </p>
          <div className="mt-8 p-4 bg-gray-100 rounded-lg max-w-md mx-auto">
            <p className="text-sm text-gray-700">
              <strong>To connect your store:</strong>
            </p>
            <ol className="text-left text-sm text-gray-600 mt-2 space-y-1">
              <li>1. Create a Shopify store</li>
              <li>2. Generate a Storefront API access token</li>
              <li>3. Update the .env.local file with your credentials</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      
      <CartButton />
    </div>
  );
}