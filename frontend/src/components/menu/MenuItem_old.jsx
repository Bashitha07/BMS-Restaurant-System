import React from "react";
import { Plus, Minus } from "lucide-react";
import { toast } from "react-hot-toast";

const MenuItem = ({ item, quantity, onQuantityChange, onAddToCart }) => {
  return (
  <div className="card hover:shadow-lg transition-all duration-200 overflow-hidden rounded-2xl">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-700/40 to-transparent"></div>
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {item.featured && (
            <span className="bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              Popular
            </span>
          )}
          {item.isSpicy && (
            <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              🌶️ Spicy
            </span>
          )}
          {!item.available && (
            <span className="bg-gray-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              Sold Out
            </span>
          )}
        </div>
      </div>
      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2">
            {item.name}
          </h3>
          <div className="ml-2 flex-shrink-0">
            <span className="text-lg font-bold text-gray-900">
              Rs. {item.price.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {item.description}
        </p>

        {/* Category and Dietary Info */}
        <div className="flex flex-wrap gap-1 mb-4">
          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
            {item.category}
          </span>
        </div>

        {/* Actions */}
        {item.available ? (
          <div className="flex items-center justify-between">
            {/* Quantity Controls */}
            <div className="flex items-center border border-gray-200 rounded-2xl overflow-hidden">
              <button
                onClick={() => onQuantityChange(quantity - 1)}
                className="p-2 hover:bg-gray-50 text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 font-medium text-gray-900 min-w-[50px] text-center border-x border-gray-200">
                {quantity}
              </span>
              <button
                onClick={() => onQuantityChange(quantity + 1)}
                className="p-2 hover:bg-gray-50 text-gray-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={() => {
                onAddToCart();
                toast.success(`${item.name} added to cart!`);
              }}
              className="btn-primary px-6 py-2 text-sm"
            >
              Add
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center py-3">
            <span className="text-gray-500 font-medium">Currently Unavailable</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default MenuItem;