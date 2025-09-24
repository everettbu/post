import { createStorefrontApiClient } from '@shopify/storefront-api-client';

// Determine if we're on the server or client
const isServer = typeof window === 'undefined';

// Use server-side variables on server, NEXT_PUBLIC on client
const domain = isServer 
  ? (process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN)
  : process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;

const storefrontAccessToken = isServer
  ? (process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN)
  : process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!domain || !storefrontAccessToken) {
  console.warn('Shopify environment variables are not configured');
  if (!isServer) {
    console.warn('Client-side requires NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN');
  }
}

export const shopifyClient = domain && storefrontAccessToken ? createStorefrontApiClient({
  storeDomain: `https://${domain}`,
  apiVersion: '2025-01',
  publicAccessToken: storefrontAccessToken,
}) : null;

export default shopifyClient;