import React, { useEffect, useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { menuItems, menuCategories } from '../data/menuData';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import MenuItem from '../components/menu/MenuItem';

const Menu = () => {
  const { addItem } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [showFilters, setShowFilters] = useState(false);
  const [itemQuantities, setItemQuantities] = useState({});

  // Calculate max price for the price range
  const maxMenuPrice = useMemo(() => {
    return Math.max(...menuItems.map(item => item.price));
  }, []);

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

  // Filter and sort menu items
  const filteredItems = useMemo(() => {
    let filtered = menuItems.filter((item) => {
      const matchesSearch = !searchTerm || (
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      
      const matchesAvailability = !showAvailableOnly || item.available;
      
      const matchesPriceRange = 
        item.price >= priceRange.min && 
        item.price <= priceRange.max;

      return matchesSearch && matchesCategory && matchesAvailability && matchesPriceRange;
    });

    // Sort the filtered items
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'popularity':
          return b.popularity - a.popularity;
        default:
          return 0;
      }
    });
  }, [menuItems, searchTerm, selectedCategory, showAvailableOnly, priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="section-container py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Delicious Food, Delivered
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Fresh ingredients, authentic flavors, and quick delivery to satisfy your cravings
            </p>
          </div>
        </div>
      </div>

      <div className="section-container py-6">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for dishes, cuisine, or ingredients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-12"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex gap-3">
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="input-field min-w-[160px]"
              >
                <option value="">All Categories</option>
                {menuCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-white rounded-lg border border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="input-field"
                  >
                    <option value="name">Name</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="popularity">Popularity</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                      className="input-field w-20"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                      className="input-field w-20"
                    />
                  </div>
                </div>

                <div className="flex items-end">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showAvailableOnly}
                      onChange={() => setShowAvailableOnly(!showAvailableOnly)}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Available only</span>
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === null
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
          {menuCategories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            {filteredItems.length} {filteredItems.length === 1 ? 'dish' : 'dishes'} found
          </p>
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">�</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No dishes found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <MenuItem
                key={item.id}
                item={item}
                quantity={itemQuantities[item.id] || 1}
                onQuantityChange={(newQuantity) => handleQuantityChange(item.id, newQuantity)}
                onAddToCart={() => handleAddToCart(item.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;