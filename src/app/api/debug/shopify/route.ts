import { NextResponse } from 'next/server';
import { shopifyClient } from '@/lib/shopify/client';
import { adminClient } from '@/lib/shopify/admin-client';

export async function GET() {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

  // Check what's configured
  const config = {
    domain: domain ? `✓ Set (${domain})` : '✗ Not set',
    storefrontToken: storefrontToken ? `✓ Set (${storefrontToken.substring(0, 10)}...)` : '✗ Not set',
    adminToken: adminToken ? `✓ Set (${adminToken.substring(0, 10)}...)` : '✗ Not set',
    storefrontClientReady: shopifyClient ? '✓ Client created' : '✗ Client not created',
    adminClientReady: adminClient ? '✓ Client created' : '✗ Client not created',
  };

  // Try a simple query if client exists
  let testResult = null;
  if (shopifyClient) {
    try {
      const testQuery = `
        query TestConnection {
          shop {
            name
            primaryDomain {
              url
            }
          }
        }
      `;
      
      const { data, errors } = await shopifyClient.request(testQuery);
      
      if (errors) {
        testResult = { success: false, errors };
      } else {
        testResult = { success: true, shop: data?.shop };
      }
    } catch (error) {
      const errorDetails = error as { response?: { status?: number }, networkStatusCode?: number };
      testResult = { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: errorDetails.response?.status || errorDetails.networkStatusCode
      };
    }
  }

  return NextResponse.json({
    environment: config,
    connectionTest: testResult,
    note: 'Never share the full tokens! This endpoint should be removed in production.'
  });
}