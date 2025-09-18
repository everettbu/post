'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';

export default function CartButton() {
  const { cart, loading, openCheckout, removeItem, updateItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const [showNotification, setShowNotification] = useState(false);
  const [lastItemCount, setLastItemCount] = useState(-1);

  const itemCount = cart?.totalQuantity || 0;
  const totalAmount = cart?.cost.totalAmount.amount || '0';
  const currencyCode = cart?.cost.totalAmount.currencyCode || 'USD';
  
  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(totalAmount));

  // Detect when items are added to cart
  useEffect(() => {
    // Skip the initial render/mount
    if (lastItemCount === -1) {
      setLastItemCount(itemCount);
      return;
    }
    
    // Only show notification if count increased and we're not removing items
    if (itemCount > lastItemCount && removingItems.size === 0) {
      // Item was added
      setShowNotification(true);
      setIsOpen(true);
      
      // Clear notification badge after 2 seconds, but keep cart open
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 2000);
      
      setLastItemCount(itemCount);
      return () => clearTimeout(timer);
    } else {
      setLastItemCount(itemCount);
    }
  }, [itemCount, lastItemCount, removingItems.size]);

  const handleRemoveItem = async (lineId: string) => {
    setRemovingItems(prev => new Set(prev).add(lineId));
    try {
      await removeItem(lineId);
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(lineId);
        return newSet;
      });
    }
  };

  const handleUpdateQuantity = async (lineId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await handleRemoveItem(lineId);
    } else {
      await updateItem(lineId, newQuantity);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 right-8 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-all duration-300 z-50 ${
          showNotification ? 'ring-4 ring-green-400' : ''
        }`}
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

      {showNotification && !isOpen && (
        <div className="fixed bottom-24 right-8 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
          Item added to cart!
        </div>
      )}

      {isOpen && (
        <div className={`fixed bottom-24 left-1/2 transform -translate-x-1/2 md:left-auto md:right-8 md:transform-none bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-6 z-50 w-96 max-w-[calc(100vw-2rem)] transition-all duration-300 ${
          showNotification ? 'ring-2 ring-green-500' : ''
        }`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">
              Shopping Cart
              {showNotification && (
                <span className="ml-2 text-sm text-green-400">Item added!</span>
              )}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          {itemCount === 0 ? (
            <p className="text-gray-400 text-center py-8">Your cart is empty</p>
          ) : (
            <>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cart?.lines.edges.map((item) => (
                  <div key={item.node.id} className="flex items-center justify-between py-3 border-b border-gray-800">
                    <div className="flex-1 pr-4">
                      <p className="font-medium text-white">{item.node.merchandise.product.title}</p>
                      {item.node.merchandise.title !== 'Default Title' && (
                        <p className="text-sm text-gray-400 mt-1">
                          {item.node.merchandise.title}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleUpdateQuantity(item.node.id, item.node.quantity - 1)}
                          className="w-6 h-6 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 hover:text-white flex items-center justify-center text-sm"
                          disabled={loading}
                        >
                          {item.node.quantity === 1 ? '🗑' : '-'}
                        </button>
                        <span className="text-white w-8 text-center text-sm">{item.node.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.node.id, item.node.quantity + 1)}
                          className="w-6 h-6 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 hover:text-white flex items-center justify-center text-sm"
                          disabled={loading}
                        >
                          +
                        </button>
                      </div>
                      <p className="font-medium text-white min-w-[80px] text-right">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: item.node.merchandise.price.currencyCode,
                        }).format(parseFloat(item.node.merchandise.price.amount) * item.node.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-700 mt-4 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-lg font-semibold text-white">Total:</p>
                  <p className="text-lg font-bold text-white">{formattedTotal}</p>
                </div>
                <button
                  onClick={openCheckout}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
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