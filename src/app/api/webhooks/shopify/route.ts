import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Verify Shopify webhook signature
function verifyWebhookSignature(
  rawBody: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) return false;
  
  const hash = crypto
    .createHmac('sha256', secret)
    .update(rawBody, 'utf8')
    .digest('base64');
  
  return hash === signature;
}

// POST /api/webhooks/shopify - Handle Shopify webhooks
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-shopify-hmac-sha256');
    const topic = request.headers.get('x-shopify-topic');
    // const shop = request.headers.get('x-shopify-shop-domain'); // Uncomment if needed for shop validation
    
    // Verify webhook signature
    const webhookSecret = process.env.SHOPIFY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('Webhook secret not configured');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
    
    if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = JSON.parse(rawBody);
    
    // Handle different webhook topics
    switch (topic) {
      case 'orders/create':
        await handleOrderCreated(data);
        break;
        
      case 'orders/updated':
        await handleOrderUpdated(data);
        break;
        
      case 'orders/fulfilled':
        await handleOrderFulfilled(data);
        break;
        
      case 'orders/cancelled':
        await handleOrderCancelled(data);
        break;
        
      case 'products/create':
        await handleProductCreated(data);
        break;
        
      case 'products/update':
        await handleProductUpdated(data);
        break;
        
      case 'customers/create':
        await handleCustomerCreated(data);
        break;
        
      case 'customers/update':
        await handleCustomerUpdated(data);
        break;
        
      default:
        console.log(`Unhandled webhook topic: ${topic}`);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Webhook payload types
interface OrderWebhookPayload {
  id: number;
  email: string;
  total_price: string;
  line_items: Array<{
    id: number;
    title: string;
    quantity: number;
    price: string;
  }>;
}

interface ProductWebhookPayload {
  id: number;
  title: string;
  handle: string;
  vendor: string;
  product_type: string;
}

interface CustomerWebhookPayload {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

// Webhook handlers
async function handleOrderCreated(order: OrderWebhookPayload) {
  console.log('New order created:', order.id);
  // Add your order creation logic here
  // e.g., send confirmation email, update inventory, etc.
}

async function handleOrderUpdated(order: OrderWebhookPayload) {
  console.log('Order updated:', order.id);
  // Add your order update logic here
}

async function handleOrderFulfilled(order: OrderWebhookPayload) {
  console.log('Order fulfilled:', order.id);
  // Add your fulfillment logic here
  // e.g., send shipping notification
}

async function handleOrderCancelled(order: OrderWebhookPayload) {
  console.log('Order cancelled:', order.id);
  // Add your cancellation logic here
  // e.g., restock inventory, send cancellation email
}

async function handleProductCreated(product: ProductWebhookPayload) {
  console.log('Product created:', product.id);
  // Add your product creation logic here
}

async function handleProductUpdated(product: ProductWebhookPayload) {
  console.log('Product updated:', product.id);
  // Add your product update logic here
}

async function handleCustomerCreated(customer: CustomerWebhookPayload) {
  console.log('Customer created:', customer.id);
  // Add your customer creation logic here
  // e.g., send welcome email
}

async function handleCustomerUpdated(customer: CustomerWebhookPayload) {
  console.log('Customer updated:', customer.id);
  // Add your customer update logic here
}