import React, { useEffect, useState } from 'react';
import { SearchIcon, FilterIcon, PlusIcon, MinusIcon } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { menuItems, menuCategories } from '../../data/menuData';
import { formatPrice } from '../../utils/currency';
import FoodImage from '../../components/FoodImage';

const Menu = () => {
  const { addItem } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [itemQuantities, setItemQuantities] = useState({});

  // Initialize all item quantities to 1
  useEffect(() => {
    const initialQuantities = {};
    menuItems.forEach((item) => {
      initialQuantities[item.id] = 1;
    });
    setItemQuantities(initialQuantities);
  }, []);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity >= 1) {
      setItemQuantities((prev) => ({
        ...prev,
        [itemId]: newQuantity,
      }));
    }
  };

  const handleAddToCart = (itemId) => {
    const item = menuItems.find((item) => item.id === itemId);
    if (item) {
      const q = Number(itemQuantities[itemId]);
      addItem(item, Number.isFinite(q) && q > 0 ? q : 1);
    }
  };

  // Filter menu items based on search term, category, and availability
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? item.category === selectedCategory
      : true;
    const matchesAvailability = showAvailableOnly ? item.available : true;
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Menu</h1>
          <p className="text-indigo-200 max-w-2xl mx-auto">
            Explore our wide selection of delicious dishes prepared with the
            freshest ingredients
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <SearchIcon
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex gap-4">
              <div className="relative min-w-[180px]">
                <FilterIcon
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                />
                <select
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(e.target.value || null)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                >
                  <option value="">All Categories</option>
                  {menuCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAvailableOnly}
                  onChange={() => setShowAvailableOnly(!showAvailableOnly)}
                  className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-gray-700">Available Only</span>
              </label>
            </div>
          </div>
        </div>
        {/* Menu Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            className={`px-4 py-2 rounded-full text-sm ${
              selectedCategory === null
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
          {menuCategories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        {/* Menu Items */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No menu items found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 ${
                  !item.available ? 'opacity-70' : ''
                }`}
              >
                <div className="h-48 overflow-hidden">
                  <FoodImage
                    src={item.image}
                    alt={item.name}
                    category={item.category}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{item.name}</h3>
                    <span className="text-purple-700 font-bold">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.id,
                            itemQuantities[item.id] - 1
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300"
                        disabled={!item.available}
                      >
                        <MinusIcon size={16} />
                      </button>
                      <span className="mx-3">{itemQuantities[item.id] || 1}</span>
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.id,
                            itemQuantities[item.id] + 1
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300"
                        disabled={!item.available}
                      >
                        <PlusIcon size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => handleAddToCart(item.id)}
                      className={`px-4 py-2 rounded-md text-white ${
                        item.available
                          ? 'bg-purple-600 hover:bg-purple-700'
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                      disabled={!item.available}
                    >
                      {item.available ? 'Add to Cart' : 'Unavailable'}
                    </button>
                  </div>
                  {!item.available && (
                    <p className="mt-2 text-red-500 text-sm">
                      Currently unavailable
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
