import { shopifyClient } from './client';
import { ShopifyProduct, ShopifyCart } from './types';
import {
  PRODUCTS_QUERY,
  PRODUCT_QUERY,
  CREATE_CART_MUTATION,
  ADD_TO_CART_MUTATION,
  UPDATE_CART_MUTATION,
  REMOVE_FROM_CART_MUTATION,
  GET_CART_QUERY,
} from './queries';

export async function getProducts(first: number = 10): Promise<ShopifyProduct[]> {
  if (!shopifyClient) {
    console.error('Shopify client is not configured');
    return [];
  }

  try {
    const { data, errors } = await shopifyClient.request(PRODUCTS_QUERY, {
      variables: { first },
    });

    if (errors) {
      console.error('Error fetching products:', errors);
      return [];
    }

    return data?.products?.edges?.map((edge: { node: ShopifyProduct }) => edge.node) || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  if (!shopifyClient) {
    console.error('Shopify client is not configured');
    return null;
  }

  try {
    const { data, errors } = await shopifyClient.request(PRODUCT_QUERY, {
      variables: { handle },
    });

    if (errors) {
      console.error('Error fetching product:', errors);
      return null;
    }

    return data?.product || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function createCart(lineItems?: Array<{ merchandiseId: string; quantity: number }>): Promise<ShopifyCart | null> {
  if (!shopifyClient) {
    console.error('Shopify client is not configured');
    return null;
  }

  try {
    const { data, errors } = await shopifyClient.request(CREATE_CART_MUTATION, {
      variables: { lineItems: lineItems || [] },
    });

    if (errors) {
      console.error('Error creating cart:', errors);
      return null;
    }

    return data?.cartCreate?.cart || null;
  } catch (error) {
    console.error('Error creating cart:', error);
    return null;
  }
}

export async function addToCart(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>
): Promise<ShopifyCart | null> {
  if (!shopifyClient) {
    console.error('Shopify client is not configured');
    return null;
  }

  try {
    const { data, errors } = await shopifyClient.request(ADD_TO_CART_MUTATION, {
      variables: { cartId, lines },
    });

    if (errors) {
      console.error('Error adding to cart:', errors);
      return null;
    }

    return data?.cartLinesAdd?.cart || null;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return null;
  }
}

export async function updateCart(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>
): Promise<ShopifyCart | null> {
  if (!shopifyClient) {
    console.error('Shopify client is not configured');
    return null;
  }

  try {
    const { data, errors } = await shopifyClient.request(UPDATE_CART_MUTATION, {
      variables: { cartId, lines },
    });

    if (errors) {
      console.error('Error updating cart:', errors);
      return null;
    }

    return data?.cartLinesUpdate?.cart || null;
  } catch (error) {
    console.error('Error updating cart:', error);
    return null;
  }
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<ShopifyCart | null> {
  if (!shopifyClient) {
    console.error('Shopify client is not configured');
    return null;
  }

  try {
    const { data, errors } = await shopifyClient.request(REMOVE_FROM_CART_MUTATION, {
      variables: { cartId, lineIds },
    });

    if (errors) {
      console.error('Error removing from cart:', errors);
      return null;
    }

    return data?.cartLinesRemove?.cart || null;
  } catch (error) {
    console.error('Error removing from cart:', error);
    return null;
  }
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  if (!shopifyClient) {
    console.error('Shopify client is not configured');
    return null;
  }

  try {
    const { data, errors } = await shopifyClient.request(GET_CART_QUERY, {
      variables: { cartId },
    });

    if (errors) {
      console.error('Error fetching cart:', errors);
      return null;
    }

    return data?.cart || null;
  } catch (error) {
    console.error('Error fetching cart:', error);
    return null;
  }
}