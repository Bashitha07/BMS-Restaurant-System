import React, { useState } from 'react';
import { PlusIcon, MinusIcon, StarIcon } from 'lucide-react';
import { MenuItem as MenuItemType } from '../../contexts/CartContext';
import { useCart } from '../../contexts/CartContext';
type MenuItemProps = {
  item: MenuItemType;
};
export function MenuItem({
  item
}: MenuItemProps) {
  const {
    addItem
  } = useCart();
  const [quantity, setQuantity] = useState(1);
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  const handleAddToCart = () => {
    addItem(item, quantity);
    setQuantity(1);
  };
  // Generate a random rating between 4.0 and 5.0
  const rating = (4 + Math.random()).toFixed(1);
  return <div className="bg-white rounded-xl overflow-hidden shadow-md transition-all hover:shadow-xl hover:-translate-y-2">
      <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
          <div className="flex items-center text-yellow-500">
            <StarIcon size={16} fill="currentColor" />
            <span className="ml-1 text-sm">{rating}</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {item.description}
        </p>
        <div className="flex justify-between items-center">
          <p className="text-xl font-bold text-gray-800">
            Rs. {item.price.toFixed(2)}
          </p>
          <div className="flex items-center">
            <div className="flex items-center mr-2 bg-gray-100 rounded-full">
              <button onClick={decrementQuantity} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200">
                <MinusIcon size={16} />
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button onClick={incrementQuantity} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200">
                <PlusIcon size={16} />
              </button>
            </div>
            <button onClick={handleAddToCart} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 px-4 rounded-full flex items-center gap-1 hover:shadow-lg transition-all">
              <PlusIcon size={16} />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>;
}