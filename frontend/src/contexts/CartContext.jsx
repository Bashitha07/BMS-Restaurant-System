import React, { useEffect, useState, createContext, useContext } from 'react'
import { toast } from 'react-hot-toast'

const CartContext = createContext(undefined)

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([])
  const [subtotal, setSubtotal] = useState(0)
  const [tax, setTax] = useState(0)
  const [total, setTotal] = useState(0)

  const getTotalItems = () => {
    return items.reduce((total, item) => {
      const q = Number(item?.quantity)
      return total + (Number.isFinite(q) ? q : 0)
    }, 0)
  }

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
    if (!item.available) {
      toast.error(`${item.name} is currently unavailable`)
      return
    }

    setItems((prevItems) => {
      // Check if item already exists in cart
      const existingItem = prevItems.find((i) => i.id === item.id)
      if (existingItem) {
        // Update quantity if item exists
        const updatedItems = prevItems.map((i) =>
          i.id === item.id
            ? {
                ...i,
                quantity: (Number.isFinite(Number(i.quantity)) ? Number(i.quantity) : 0) + safeQuantity,
              }
            : i,
        )
        toast.success(`Updated ${item.name} quantity in cart`)
        return updatedItems
      } else {
        // Add new item if it doesn't exist
        toast.success(`Added ${item.name} to cart`)
        return [
          ...prevItems,
          {
            ...item,
            quantity: safeQuantity,
          },
        ]
      }
    })
  }

  const removeItem = (id) => {
    setItems((prevItems) => {
      const itemToRemove = prevItems.find((item) => item.id === id)
      if (itemToRemove) {
        toast.success(`Removed ${itemToRemove.name} from cart`)
      }
      return prevItems.filter((item) => item.id !== id)
    })
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
    toast.success('Cart cleared')
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