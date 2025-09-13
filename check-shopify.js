#!/usr/bin/env node

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env.local') });

console.log('\n🔍 Checking Shopify Configuration...\n');

const required = {
  'NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN': process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
  'NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
};

const optional = {
  'SHOPIFY_ADMIN_ACCESS_TOKEN': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
  'SHOPIFY_API_KEY': process.env.SHOPIFY_API_KEY,
  'SHOPIFY_API_SECRET_KEY': process.env.SHOPIFY_API_SECRET_KEY,
};

let hasErrors = false;

console.log('📋 Required for Shop (Storefront API):');
console.log('━'.repeat(50));

for (const [key, value] of Object.entries(required)) {
  if (!value || value.includes('your-')) {
    console.log(`❌ ${key}: Not configured or using placeholder`);
    hasErrors = true;
  } else {
    const display = key.includes('TOKEN') 
      ? value.substring(0, 10) + '...' 
      : value;
    console.log(`✅ ${key}: ${display}`);
  }
}

console.log('\n📋 Optional (Admin API):');
console.log('━'.repeat(50));

for (const [key, value] of Object.entries(optional)) {
  if (!value || value.includes('your-')) {
    console.log(`⚠️  ${key}: Not configured`);
  } else {
    const display = value.substring(0, 10) + '...';
    console.log(`✅ ${key}: ${display}`);
  }
}

if (hasErrors) {
  console.log('\n❗ Action Required:');
  console.log('━'.repeat(50));
  console.log('1. Update your .env.local file with actual Shopify credentials');
  console.log('2. Replace "your-store" with your actual Shopify store subdomain');
  console.log('3. Add your Storefront API access token');
  console.log('\nExample:');
  console.log('NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=my-actual-store.myshopify.com');
  console.log('NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=abcd1234...');
} else {
  console.log('\n✨ Configuration looks good!');
  console.log('━'.repeat(50));
  console.log('Run "npm run dev" to start the server with your credentials.');
}

console.log('\n');