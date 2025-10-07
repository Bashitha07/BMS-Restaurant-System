import { useEffect, useState } from 'react';
import { menuService } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-hot-toast';
import { Search, Filter, Plus, Minus, ShoppingCart } from 'lucide-react';

const menuCategories = [
  'All',
  'Rice',
  'Noodles', 
  'Kottu',
  'Burgers',
  'Submarines',
  'Bites',
  'Juice',
  'Desserts',
];

// Placeholder images for different categories
const getCategoryImage = (category) => {
  const imageMap = {
    'Rice': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
    'Noodles': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
    'Kottu': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
    'Burgers': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    'Submarines': 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400',
    'Bites': 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400',
    'Juice': 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400',
    'Desserts': 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400',
  };
  return imageMap[category] || 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400';
};

export default function Menu({ featured = false, maxItems = null }) {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [quantities, setQuantities] = useState({});
  const { addItem } = useCart();

  useEffect(() => {
    loadMenus();
  }, []);

  const loadMenus = async () => {
    try {
      const response = await menuService.getAllMenus();
      if (response?.data) {
        setMenus(response.data);
      } else {
        setMenus([]);
        setError('No menu items found');
      }
    } catch (error) {
      setError('Failed to load menu items');
      toast.error('Failed to load menu items');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedMenus = () => {
    let filtered = menus;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        default:
          return 0;
      }
    });

    // Limit items for featured display
    if (maxItems) {
      filtered = filtered.slice(0, maxItems);
    }

    return filtered;
  };

  const handleQuantityChange = (itemId, change) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + change)
    }));
  };

  const handleAddToCart = (item) => {
    const quantity = quantities[item.id] || 1;
    addItem({ ...item, quantity });
    toast.success(`Added ${quantity} ${item.name}(s) to cart!`);
    setQuantities(prev => ({ ...prev, [item.id]: 0 }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error && !featured) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={loadMenus}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      {!featured && (
        <>
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 mb-8 rounded-lg">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Our Menu</h1>
              <p className="text-indigo-200 max-w-2xl mx-auto">
                Explore our wide selection of delicious dishes prepared with the
                freshest ingredients
              </p>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative flex-grow">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {menuCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </>
      )}

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedMenus().map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={item.imageUrl || getCategoryImage(item.category)}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = getCategoryImage(item.category);
                }}
              />
              {!item.isAvailable && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-semibold">Currently Unavailable</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {item.category}
                </span>
              </div>
              
              <p className="text-gray-600 mb-3 text-sm">{item.description}</p>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold text-primary-600">
                  LKR {item.price?.toFixed(2) || '0.00'}
                </span>
                <div className="flex items-center space-x-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.isAvailable 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              {item.isAvailable && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, -1)}
                      className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                      disabled={(quantities[item.id] || 0) <= 0}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-semibold">
                      {quantities[item.id] || 0}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.id, 1)}
                      className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={(quantities[item.id] || 0) <= 0}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart size={16} />
                    <span>Add to Cart</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredAndSortedMenus().length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No menu items found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}