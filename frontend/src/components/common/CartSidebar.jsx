import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Plus, Minus, Trash2, CreditCard } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { formatPrice } from '../../utils/currency';

const CartSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart, getTotalItems } = useCart();
  const [isClearing, setIsClearing] = useState(false);

  // Safely compute total items to avoid NaN rendering
  const rawTotalItems = typeof getTotalItems === 'function' ? getTotalItems() : 0;
  const totalItemsCount = Number.isFinite(rawTotalItems) ? rawTotalItems : 0;

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.06;
  const total = subtotal + tax;

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(items.find(item => item.id === itemId));
      return;
    }
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (item) => {
    removeItem(item.id);
  };

  const handleClearCart = async () => {
    setIsClearing(true);
    setTimeout(() => {
      clearCart();
      setIsClearing(false);
    }, 300);
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl transform transition-all duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingBag className="h-6 w-6 text-gray-700" />
                  {totalItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItemsCount}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Your Cart</h3>
                  <p className="text-gray-600 text-sm">
                    {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <ShoppingBag className="h-12 w-12 text-gray-400" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h4>
                <p className="text-gray-600 mb-6 max-w-sm">
                  Add some delicious items from our menu to get started
                </p>
                <button
                  onClick={() => {
                    onClose();
                    navigate('/menu');
                  }}
                  className="btn-primary"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 ${
                      isClearing ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-base">
                          {item.name}
                        </h4>
                        <p className="text-gray-600 text-sm mt-1">
                          {item.description?.substring(0, 60)}
                          {item.description?.length > 60 ? '...' : ''}
                        </p>
                        <div className="flex items-center mt-2">
                          <span className="text-gray-900 font-medium">
                            {formatPrice(item.price)} each
                          </span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="font-semibold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center bg-gray-100 rounded-lg border border-gray-200">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-200 transition-colors rounded-l-lg"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="mx-3 font-medium text-gray-900 min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-200 transition-colors rounded-r-lg"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Summary */}
          {items.length > 0 && (
            <div className="bg-gray-50 border-t border-gray-200">
              <div className="p-6">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalItemsCount} items)</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (6%)</span>
                    <span className="font-medium">{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-lg pt-3 border-t border-gray-200 text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    <CreditCard className="h-5 w-5" />
                    Proceed to Checkout • {formatPrice(total)}
                  </button>

                  <button
                    onClick={handleClearCart}
                    disabled={isClearing}
                    className="w-full py-3 text-gray-600 hover:text-red-600 text-sm font-medium transition-colors hover:bg-red-50 rounded-lg disabled:opacity-50"
                  >
                    {isClearing ? 'Clearing...' : 'Clear Cart'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;