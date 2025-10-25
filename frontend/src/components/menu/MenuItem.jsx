import React, { useState } from 'react';
import { Star, Plus, Minus } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import FoodImage from '../common/FoodImage';
import toast from 'react-hot-toast';

export default function MenuItem({ item }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    // Create cart item structure
    const cartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      description: item.description,
      image: item.imageUrl,
      quantity: quantity
    };
    
    addToCart(cartItem);
    toast.success(`Added ${item.name} to cart!`);
    setQuantity(1);
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  return (
  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-1 group border-2 border-orange-300">
      <div className="relative overflow-hidden">
        <FoodImage
          src={item.imageUrl || item.image}
          alt={item.name}
          category={item.category}
          itemName={item.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Unavailable
            </span>
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {item.name}
          </h3>
        </div>
        
        <p className="text-gray-700 text-sm mb-3 line-clamp-2 font-medium">
          {item.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xl font-bold text-gray-900">
              LKR {typeof item.price === 'number' ? item.price.toLocaleString() : item.price}
            </span>
            <span className="text-sm text-gray-500 ml-2 capitalize">
              {item.category}
            </span>
          </div>
        </div>

        {item.isAvailable ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center bg-gray-100 rounded-lg border border-gray-200">
              <button
                onClick={decrementQuantity}
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-200 transition-colors rounded-l-lg"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="mx-3 font-medium text-gray-900 min-w-[2rem] text-center">
                {quantity}
              </span>
              <button
                onClick={incrementQuantity}
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-200 transition-colors rounded-r-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <button
              onClick={handleAddToCart}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 hover:shadow-md flex items-center gap-2 active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        ) : (
          <button
            disabled
            className="w-full bg-gray-300 text-gray-500 px-6 py-2 rounded-lg font-semibold cursor-not-allowed"
          >
            Unavailable
          </button>
        )}
      </div>
    </div>
  );
}