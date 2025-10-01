import React, { useState, createContext, useContext } from 'react';
export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
};
export type CartItem = {
  menuItem: MenuItem;
  quantity: number;
};
type CartContextType = {
  items: CartItem[];
  addItem: (item: MenuItem, quantity: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getTax: () => number;
  getTotal: () => number;
};
const CartContext = createContext<CartContextType | undefined>(undefined);
export function CartProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const addItem = (menuItem: MenuItem, quantity: number) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.menuItem.id === menuItem.id);
      if (existingItem) {
        return prevItems.map(item => item.menuItem.id === menuItem.id ? {
          ...item,
          quantity: item.quantity + quantity
        } : item);
      } else {
        return [...prevItems, {
          menuItem,
          quantity
        }];
      }
    });
  };
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems(prevItems => prevItems.map(item => item.menuItem.id === itemId ? {
      ...item,
      quantity
    } : item));
  };
  const removeItem = (itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.menuItem.id !== itemId));
  };
  const clearCart = () => {
    setItems([]);
  };
  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };
  const getSubtotal = () => {
    return items.reduce((total, item) => total + item.menuItem.price * item.quantity, 0);
  };
  const getTax = () => {
    return getSubtotal() * 0.1; // Assuming 10% tax
  };
  const getTotal = () => {
    return getSubtotal() + getTax();
  };
  return <CartContext.Provider value={{
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalItems,
    getSubtotal,
    getTax,
    getTotal
  }}>
      {children}
    </CartContext.Provider>;
}
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}