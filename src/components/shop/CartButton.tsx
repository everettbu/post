'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';

export default function CartButton() {
  const { cart, loading, openCheckout } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const itemCount = cart?.totalQuantity || 0;
  const totalAmount = cart?.cost.totalAmount.amount || '0';
  const currencyCode = cart?.cost.totalAmount.currencyCode || 'USD';
  
  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(totalAmount));

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 bg-black text-white rounded-full p-4 shadow-lg hover:bg-gray-800 transition-colors z-50"
        disabled={loading}
      >
        <div className="relative">
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6m0 0a2 2 0 100 4 2 2 0 000-4zm-10 0a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              {itemCount}
            </span>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-8 bg-white rounded-lg shadow-xl p-6 z-50 w-96 max-w-[calc(100vw-2rem)]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Shopping Cart</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {itemCount === 0 ? (
            <p className="text-gray-500 text-center py-8">Your cart is empty</p>
          ) : (
            <>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cart?.lines.edges.map((item) => (
                  <div key={item.node.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.node.merchandise.product.title}</p>
                      <p className="text-sm text-gray-500">
                        {item.node.merchandise.title} × {item.node.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: item.node.merchandise.price.currencyCode,
                      }).format(parseFloat(item.node.merchandise.price.amount) * item.node.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-lg font-semibold">Total:</p>
                  <p className="text-lg font-bold">{formattedTotal}</p>
                </div>
                <button
                  onClick={openCheckout}
                  className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}