import { createAdminApiClient } from '@shopify/admin-api-client';

// Admin API Client for direct API access
const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

// Only create client if credentials are available
export const adminClient = domain && accessToken ? createAdminApiClient({
  storeDomain: `https://${domain}`,
  apiVersion: '2025-01',
  accessToken: accessToken,
}) : null;

export default adminClient;