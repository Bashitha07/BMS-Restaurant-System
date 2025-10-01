import React from 'react'
import { useCart } from '../../contexts/CartContext'

export default function Cart() {
  const { items, removeItem, updateQuantity, subtotal, tax, total } = useCart()
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Your cart is empty</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-4">
            {/* Cart items would go here */}
            <p className="text-gray-600">Cart items will be displayed here</p>
          </div>
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
