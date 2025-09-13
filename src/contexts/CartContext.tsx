'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ShopifyCart } from '@/lib/shopify/types';
import { createCart, addToCart, updateCart, removeFromCart, getCart } from '@/lib/shopify/api';

interface CartContextType {
  cart: ShopifyCart | null;
  loading: boolean;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  openCheckout: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_ID_KEY = 'shopify_cart_id';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [loading, setLoading] = useState(true);

  // Load cart on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCartId = localStorage.getItem(CART_ID_KEY);
        if (savedCartId) {
          const existingCart = await getCart(savedCartId);
          if (existingCart) {
            setCart(existingCart);
          } else {
            // Cart no longer exists, clear the saved ID
            localStorage.removeItem(CART_ID_KEY);
          }
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  // Save cart ID when cart changes
  useEffect(() => {
    if (cart?.id) {
      localStorage.setItem(CART_ID_KEY, cart.id);
    }
  }, [cart]);

  const addItem = async (variantId: string, quantity: number = 1) => {
    setLoading(true);
    try {
      let updatedCart: ShopifyCart | null;
      
      if (!cart) {
        // Create a new cart with the item
        updatedCart = await createCart([{ merchandiseId: variantId, quantity }]);
      } else {
        // Add to existing cart
        updatedCart = await addToCart(cart.id, [{ merchandiseId: variantId, quantity }]);
      }
      
      if (updatedCart) {
        setCart(updatedCart);
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (lineId: string, quantity: number) => {
    if (!cart) return;
    
    setLoading(true);
    try {
      const updatedCart = await updateCart(cart.id, [{ id: lineId, quantity }]);
      if (updatedCart) {
        setCart(updatedCart);
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (lineId: string) => {
    if (!cart) return;
    
    setLoading(true);
    try {
      const updatedCart = await removeFromCart(cart.id, [lineId]);
      if (updatedCart) {
        setCart(updatedCart);
      }
    } catch (error) {
      console.error('Error removing cart item:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!cart) return;
    
    setLoading(true);
    try {
      const lineIds = cart.lines.edges.map(edge => edge.node.id);
      const updatedCart = await removeFromCart(cart.id, lineIds);
      if (updatedCart) {
        setCart(updatedCart);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const openCheckout = () => {
    if (cart?.checkoutUrl) {
      window.open(cart.checkoutUrl, '_blank');
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        openCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}