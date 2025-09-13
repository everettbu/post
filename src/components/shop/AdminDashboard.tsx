'use client';

import { useState, useEffect } from 'react';

interface Order {
  id: string;
  name: string;
  email: string;
  totalPriceSet: {
    shopMoney: {
      amount: string;
      currencyCode: string;
    };
  };
  createdAt: string;
  displayFulfillmentStatus: string;
  displayFinancialStatus: string;
}

interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  ordersCount: number;
  totalSpentV2: {
    amount: string;
    currencyCode: string;
  };
}

export default function AdminDashboard({ token }: { token: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'customers'>('orders');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch orders
        const ordersRes = await fetch('/api/admin/orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData);
        }

        // Fetch customers
        const customersRes = await fetch('/api/admin/customers', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (customersRes.ok) {
          const customersData = await customersRes.json();
          setCustomers(customersData);
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-2 px-4 font-medium ${
              activeTab === 'orders'
                ? 'border-b-2 border-black text-black'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`pb-2 px-4 font-medium ${
              activeTab === 'customers'
                ? 'border-b-2 border-black text-black'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Customers ({customers.length})
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fulfillment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: order.totalPriceSet.shopMoney.currencyCode,
                      }).format(parseFloat(order.totalPriceSet.shopMoney.amount))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.displayFinancialStatus === 'PAID'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.displayFinancialStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.displayFulfillmentStatus === 'FULFILLED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {order.displayFulfillmentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Spent
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {customer.firstName} {customer.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.ordersCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: customer.totalSpentV2.currencyCode,
                      }).format(parseFloat(customer.totalSpentV2.amount))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}