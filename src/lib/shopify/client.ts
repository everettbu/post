import { createStorefrontApiClient } from '@shopify/storefront-api-client';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!domain || !storefrontAccessToken) {
  console.warn('Shopify environment variables are not configured');
}

export const shopifyClient = domain && storefrontAccessToken ? createStorefrontApiClient({
  storeDomain: `https://${domain}`,
  apiVersion: '2025-01',
  publicAccessToken: storefrontAccessToken,
}) : null;

export default shopifyClient;