import { NextRequest, NextResponse } from 'next/server';
import { getCustomers } from '@/lib/shopify/admin-api';

// GET /api/admin/customers - Fetch customers
export async function GET(request: NextRequest) {
  try {
    // Check for admin authentication (implement your auth logic here)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit');

    const customers = await getCustomers(limit ? parseInt(limit) : 10);
    return NextResponse.json(customers);
  } catch (error) {
    console.error('Error in customers API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}