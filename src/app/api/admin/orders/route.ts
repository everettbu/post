import { NextRequest, NextResponse } from 'next/server';
import { getOrders, getOrder } from '@/lib/shopify/admin-api';

// GET /api/admin/orders - Fetch orders
export async function GET(request: NextRequest) {
  try {
    // Check for admin authentication (implement your auth logic here)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get('id');
    const limit = searchParams.get('limit');

    if (orderId) {
      const order = await getOrder(orderId);
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json(order);
    }

    const orders = await getOrders(limit ? parseInt(limit) : 10);
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error in orders API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}