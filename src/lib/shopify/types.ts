export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        price: {
          amount: string;
          currencyCode: string;
        };
      };
    }>;
  };
}

export interface CartItem {
  id: string;
  variantId: string;
  productId: string;
  title: string;
  variantTitle: string;
  quantity: number;
  price: string;
  currencyCode: string;
  image?: string;
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
  lines: {
    edges: Array<{
      node: {
        id: string;
        quantity: number;
        merchandise: {
          id: string;
          title: string;
          product: {
            id: string;
            title: string;
            handle: string;
            images: {
              edges: Array<{
                node: {
                  url: string;
                };
              }>;
            };
          };
          price: {
            amount: string;
            currencyCode: string;
          };
        };
      };
    }>;
  };
}