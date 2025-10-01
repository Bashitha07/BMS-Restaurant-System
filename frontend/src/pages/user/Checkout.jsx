import React from 'react'
import { useCart } from '../../contexts/CartContext'

export default function Checkout() {
  const { items, subtotal, tax, total } = useCart()
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <p className="text-gray-600">
            Checkout form will be implemented here
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <p className="text-gray-600">Order summary will be displayed here</p>
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
      </div>
    </div>
  )
}
