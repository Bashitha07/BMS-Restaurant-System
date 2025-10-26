import React, { useEffect, useState, createContext, useContext, useMemo } from 'react'
import { toast } from 'react-hot-toast'

const CartContext = createContext(undefined)

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([])
  const [subtotal, setSubtotal] = useState(0)
  const [tax, setTax] = useState(0)
  const [total, setTotal] = useState(0)

  // Memoize total items calculation to avoid recalculating on every render
  const totalItems = useMemo(() => {
    return items.reduce((total, item) => {
      const q = Number(item?.quantity)
      return total + (Number.isFinite(q) ? q : 0)
    }, 0)
  }, [items])
  
  const getTotalItems = () => totalItems

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
    // Calculate totals
    const newSubtotal = items.reduce((sum, item) => {
      const p = Number(item?.price)
      const q = Number(item?.quantity)
      const safeP = Number.isFinite(p) ? p : 0
      const safeQ = Number.isFinite(q) ? q : 0
      return sum + safeP * safeQ
    }, 0)
    const newTax = newSubtotal * 0.06 // 6% tax
    const newTotal = newSubtotal + newTax
    setSubtotal(newSubtotal)
    setTax(newTax)
    setTotal(newTotal)
  }, [items])

  const addItem = (item, quantity) => {
    const qNum = Number(quantity)
    const safeQuantity = Number.isFinite(qNum) && qNum > 0 ? qNum : 1
    if (!item.isAvailable) {
      toast.error(`${item.name} is currently unavailable`, { id: `unavailable-${item.id}` })
      return
    }

    // Check if item already exists in cart before updating state
    const existingItem = items.find((i) => i.id === item.id)
    
    setItems((prevItems) => {
      const existing = prevItems.find((i) => i.id === item.id)
      if (existing) {
        // Update quantity if item exists
        return prevItems.map((i) =>
          i.id === item.id
            ? {
                ...i,
                quantity: (Number.isFinite(Number(i.quantity)) ? Number(i.quantity) : 0) + safeQuantity,
              }
            : i,
        )
      } else {
        // Add new item if it doesn't exist
        return [
          ...prevItems,
          {
            ...item,
            quantity: safeQuantity,
          },
        ]
      }
    })
    
    // Show toast after state update is queued
    if (existingItem) {
      toast.success(`Updated ${item.name} quantity in cart`, { id: `update-${item.id}` })
    } else {
      toast.success(`Added ${item.name} to cart`, { id: `add-${item.id}` })
    }
  }

  const removeItem = (id) => {
    // Find the item before removing it
    const itemToRemove = items.find((item) => item.id === id)
    
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
    
    // Show toast after state update is queued
    if (itemToRemove) {
      toast.success(`Removed ${itemToRemove.name} from cart`, { id: `remove-${id}` })
    }
  }

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
            }
          : item,
      ),
    )
  }

  const clearCart = () => {
    setItems([])
    toast.success('Cart cleared', { id: 'clear-cart' })
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        tax,
        total,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export default CartProvider