import React, { useEffect, useState } from 'react';
import { SearchIcon, FilterIcon, PlusIcon, MinusIcon } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { menuCategories } from '../../data/menuData';
import { formatPrice } from "../../utils/currency";
import FoodImage from "../../components/common/FoodImage";
import { menuService } from "../../services/api";
import { useSearchParams } from 'react-router-dom';

const Menu = () => {
  const { addItem } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || null);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [itemQuantities, setItemQuantities] = useState({});
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Update selected category when URL parameter changes
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // Fetch menu items from API
  useEffect(() => {
    const fetchMenuItems = async () => {
      setIsLoading(true);
      try {
        const items = await menuService.getAllMenus();
        // menuService.getAllMenus() returns the data array directly
        setMenuItems(Array.isArray(items) ? items : []);
        
        // Initialize quantities after fetching items
        const initialQuantities = {};
        if (Array.isArray(items)) {
          items.forEach((item) => {
            initialQuantities[item.id] = 1;
          });
        }
        setItemQuantities(initialQuantities);
        
        setError(null);
      } catch (err) {
        console.error("Error fetching menu items:", err);
        setError("Failed to load menu items. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMenuItems();
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
    // Backend uses 'isAvailable' field
    const matchesAvailability = showAvailableOnly ? item.isAvailable : true;
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 py-12 rounded-2xl border-2 border-orange-200">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 text-orange-600">Our Menu</h1>
          <p className="text-lg max-w-2xl mx-auto text-gray-700">
            Explore our wide selection of delicious dishes prepared with the freshest ingredients
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
                  onChange={(e) => {
                    const category = e.target.value || null;
                    setSelectedCategory(category);
                    if (category) {
                      setSearchParams({ category });
                    } else {
                      setSearchParams({});
                    }
                  }}
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
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategory === null
                ? 'bg-orange-500 text-black shadow-md border-2 border-black'
                : 'bg-white text-black border-2 border-orange-500 hover:bg-orange-500 hover:text-black'
            }`}
            onClick={() => {
              setSelectedCategory(null);
              setSearchParams({});
            }}
          >
            All
          </button>
          {menuCategories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-orange-500 text-black shadow-md border-2 border-black'
                  : 'bg-white text-black border-2 border-orange-500 hover:bg-orange-500 hover:text-black'
              }`}
              onClick={() => {
                setSelectedCategory(category);
                setSearchParams({ category });
              }}
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
                  !item.isAvailable ? 'opacity-70' : ''
                }`}
              >
                <div className="h-48 overflow-hidden">
                  <FoodImage
                    src={item.imageUrl}
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
                  <p className="text-gray-800 mb-4 font-medium">{item.description}</p>
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
                        disabled={!item.isAvailable}
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
                        disabled={!item.isAvailable}
                      >
                        <PlusIcon size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => handleAddToCart(item.id)}
                      className={`px-4 py-2 rounded-md text-white ${
                        item.isAvailable
                          ? 'bg-purple-600 hover:bg-purple-700'
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                      disabled={!item.isAvailable}
                    >
                      {item.isAvailable ? 'Add to Cart' : 'Unavailable'}
                    </button>
                  </div>
                  {!item.isAvailable && (
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
