# Shopify Admin API Setup Guide

## Overview
Your app is now configured with both Storefront API (customer-facing) and Admin API (backend management) access to Shopify.

## Setting Up Admin API Access

### 1. Create a Custom App in Shopify

1. Go to your Shopify Admin Dashboard
2. Navigate to **Settings** → **Apps and sales channels**
3. Click **Develop apps**
4. Click **Create an app**
5. Name your app (e.g., "Joe P Store Admin")

### 2. Configure API Scopes

In your app configuration, click **Configure Admin API scopes** and enable:

**Products & Inventory:**
- `read_products`, `write_products`
- `read_inventory`, `write_inventory`

**Orders & Fulfillment:**
- `read_orders`, `write_orders`
- `read_fulfillments`, `write_fulfillments`
- `read_shipping`, `write_shipping`

**Customers:**
- `read_customers`, `write_customers`

**Other recommended scopes:**
- `read_locations`
- `read_price_rules`, `write_price_rules`
- `read_discounts`, `write_discounts`

### 3. Generate Access Tokens

1. After configuring scopes, click **Install app**
2. In the **API credentials** tab, you'll find:
   - **Admin API access token** (starts with `shpat_`)
   - **API key** 
   - **API secret key**

### 4. Configure Webhooks

1. In the app configuration, go to **Webhooks**
2. Add webhook URLs for events you want to track:
   - Order creation: `https://your-domain.com/api/webhooks/shopify`
   - Order update: `https://your-domain.com/api/webhooks/shopify`
   - Product update: `https://your-domain.com/api/webhooks/shopify`
3. Copy the **Webhook signing secret**

### 5. Update Environment Variables

Update your `.env.local` file with the credentials:

```env
# Shopify Storefront API (Public)
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-token

# Shopify Admin API (Private - Server only)
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_your_admin_token
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET_KEY=your_api_secret_key
SHOPIFY_WEBHOOK_SECRET=your_webhook_secret
SHOPIFY_APP_URL=https://your-domain.com
```

## Available Admin Features

### Admin API Functions (`/src/lib/shopify/admin-api.ts`)

**Order Management:**
- `getOrders()` - Fetch recent orders
- `getOrder(orderId)` - Get specific order details
- `createFulfillment()` - Fulfill orders

**Customer Management:**
- `getCustomers()` - Fetch customer list
- Customer order history and spending data

**Product Management:**
- `createProduct()` - Add new products
- `updateProduct()` - Modify existing products
- `updateInventory()` - Manage stock levels

**Inventory Management:**
- Track stock levels
- Update quantities
- Manage multiple locations

### API Routes

**Orders:** `/api/admin/orders`
- GET: Fetch orders (requires Bearer token auth)
- Query params: `?id=ORDER_ID` or `?limit=20`

**Customers:** `/api/admin/customers`
- GET: Fetch customers (requires Bearer token auth)
- Query params: `?limit=20`

**Webhooks:** `/api/webhooks/shopify`
- POST: Receives Shopify webhook events
- Automatically verified using HMAC signature

### Admin Dashboard Component

The `AdminDashboard` component (`/src/components/shop/AdminDashboard.tsx`) provides:
- Order management interface
- Customer list view
- Payment and fulfillment status tracking
- Total sales overview

## Security Considerations

1. **Never expose admin tokens client-side** - All admin API calls should be made from server-side routes
2. **Implement authentication** - Add proper auth middleware to protect admin routes
3. **Verify webhooks** - Always validate webhook signatures
4. **Use environment variables** - Never hardcode credentials
5. **Implement rate limiting** - Protect your API routes from abuse

## Testing

1. **Test webhook handling:**
   ```bash
   ngrok http 3000
   ```
   Update your Shopify webhook URLs with the ngrok URL

2. **Test admin API:**
   ```bash
   curl http://localhost:3000/api/admin/orders \
     -H "Authorization: Bearer your-test-token"
   ```

## Next Steps

1. Implement authentication for admin routes
2. Add more webhook handlers as needed
3. Create admin UI for managing products/orders
4. Set up automated fulfillment workflows
5. Implement customer email notifications

## Troubleshooting

**"Admin client is not configured"**
- Ensure `SHOPIFY_ADMIN_ACCESS_TOKEN` is set in `.env.local`
- Restart your development server

**"Invalid webhook signature"**
- Verify `SHOPIFY_WEBHOOK_SECRET` matches your Shopify app settings
- Check that raw body is being used for signature verification

**"Unauthorized" errors**
- Check that your admin access token has required scopes
- Ensure token hasn't expired (regenerate if needed)