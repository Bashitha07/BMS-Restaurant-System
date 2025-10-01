import React from 'react';
import { XIcon, PlusIcon, MinusIcon, ShoppingCartIcon } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
export function CartSidebar() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getTax,
    getTotal
  } = useCart();
  const navigate = useNavigate();
  const closeCart = () => {
    document.getElementById('cartSidebar')?.classList.remove('open');
  };
  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };
  return <div id="cartSidebar" className="fixed top-0 right-[-400px] w-full max-w-md h-full bg-white shadow-2xl transition-all duration-300 z-50 flex flex-col">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <ShoppingCartIcon size={20} />
            Your Cart
          </h3>
          <button onClick={closeCart} className="text-white hover:bg-white/20 p-2 rounded-full transition-all">
            <XIcon size={20} />
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto p-4">
        {items.length === 0 ? <div className="text-center py-8">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <ShoppingCartIcon size={32} className="text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-800 mb-2">
              Your cart is empty
            </h4>
            <p className="text-gray-500 mb-4">
              Add items from the menu to get started
            </p>
            <button onClick={closeCart} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 px-6 rounded-full hover:shadow-lg transition-all">
              Browse Menu
            </button>
          </div> : <div className="space-y-4">
            {items.map(item => <div key={item.menuItem.id} className="border-b pb-4">
                <div className="flex justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">
                      {item.menuItem.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Rs. {item.menuItem.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">
                      Rs. {(item.menuItem.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center bg-gray-100 rounded-full">
                    <button onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200">
                      <MinusIcon size={16} />
                    </button>
                    <span className="w-8 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200">
                      <PlusIcon size={16} />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.menuItem.id)} className="text-sm text-red-500 hover:text-red-700">
                    Remove
                  </button>
                </div>
              </div>)}
          </div>}
      </div>
      {items.length > 0 && <div className="border-t p-4 bg-gray-50">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">
                Rs. {getSubtotal().toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax (10%):</span>
              <span className="font-medium">Rs. {getTax().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2 mt-2">
              <span>Total:</span>
              <span>Rs. {getTotal().toFixed(2)}</span>
            </div>
          </div>
          <button onClick={handleCheckout} className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all">
            Checkout
          </button>
        </div>}
    </div>;
}