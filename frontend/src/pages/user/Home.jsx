import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon, PlusIcon, StarIcon } from 'lucide-react';
import { menuItems, menuCategories } from '../../data/menuData';
import { useCart } from '../../contexts/CartContext';
import { formatPrice } from '../../utils/currency';
import CartSidebar from '../../components/common/CartSidebar';
import FoodImage from '../../components/common/FoodImage';

const Home = () => {
  const { addItem } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartOpen, setCartOpen] = useState(false);
  const [itemQuantities, setItemQuantities] = useState({});
  const [filteredItems, setFilteredItems] = useState(menuItems);
  const [animateHero, setAnimateHero] = useState(false);

  useEffect(() => {
    const initialQuantities = {};
    menuItems.forEach((item) => {
      initialQuantities[item.id] = 1;
    });
    setItemQuantities(initialQuantities);
    setTimeout(() => {
      setAnimateHero(true);
    }, 100);
  }, []);

  useEffect(() => {
    let filtered = menuItems;
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }
    setFilteredItems(filtered);
  }, [searchTerm, selectedCategory]);

  const handleAddToCart = (itemId) => {
    const item = menuItems.find((item) => item.id === itemId);
    if (item && item.isAvailable) {
      const q = Number(itemQuantities[itemId]);
      addItem(item, Number.isFinite(q) && q > 0 ? q : 1);
    }
  };

  return (
    <div className="bg-white min-h-screen">
  <section className="relative overflow-hidden bg-primary-500 text-white py-20">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div
            className={`transition-all duration-1000 transform ${
              animateHero ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">BMS Kingdom of Taste</h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-2xl mx-auto">
              Experience the authentic flavors of Sri Lanka
            </p>
          </div>
          <div
            className={`max-w-xl mx-auto relative transition-all duration-1000 delay-300 transform ${
              animateHero ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <input
              type="text"
              placeholder="Search for food, cuisines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-4 px-6 pr-12 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition">
              <SearchIcon size={20} />
            </button>
          </div>
        </div>
        <div className="absolute inset-0 w-full h-full">
          <img
            src={require('../../assets/images/food/hero-restaurant.jpg')}
            alt="Modern restaurant interior"
            className="w-full h-full object-cover object-center opacity-60"
            style={{ filter: 'brightness(0.85)' }}
          />
        </div>
      </section>
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 inline-block">
              Explore Categories
            </h2>
            <div className="h-1 w-24 bg-purple-500 mx-auto mt-2"></div>
          </div>
          <div className="flex overflow-x-auto pb-4 hide-scrollbar">
            <div className="flex space-x-4 px-4">
              {menuCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex flex-col items-center justify-center min-w-[120px] p-4 rounded-lg transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-purple-600 text-white shadow-lg transform -translate-y-1 scale-105'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200 hover:-translate-y-1'
                  }`}
                >
                  <div className="text-2xl mb-2">
                    {category === 'All' && '🍽️'}
                    {category === 'Rice' && '🍛'}
                    {category === 'Noodles' && '🍜'}
                    {category === 'Burgers' && '🍔'}
                    {category === 'Submarines' && '🥪'}
                    {category === 'Bites' && '🍗'}
                    {category === 'Juice' && '🥤'}
                    {category === 'Desserts' && '🍰'}
                  </div>
                  <span className="text-sm font-medium">{category}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 inline-block">
              {selectedCategory === 'All' ? 'All Menu Items' : selectedCategory}
            </h2>
            <div className="h-1 w-24 bg-purple-500 mx-auto mt-2"></div>
          </div>
          {filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700">No items found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or category filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                    !item.isAvailable ? 'opacity-60' : ''
                  }`}
                >
                  <div className="h-56 overflow-hidden relative">
                    <FoodImage
                      src={item.imageUrl}
                      alt={item.name}
                      category={item.category}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-purple-700">{formatPrice(item.price)}</span>
                      <button
                        onClick={() => handleAddToCart(item.id)}
                        disabled={!item.isAvailable}
                        className={`flex items-center gap-1 px-4 py-2 rounded-full transition-all duration-300 ${
                          item.isAvailable ? 'bg-purple-600 text-white hover:bg-purple-700 transform hover:scale-105' : 'bg-gray-300 cursor-not-allowed'
                        }`}
                      >
                        <PlusIcon size={18} />
                        {item.isAvailable ? 'Add to Cart' : 'Unavailable'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <section className="py-16 bg-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 inline-block">Why Choose Us</h2>
            <div className="h-1 w-24 bg-purple-500 mx-auto mt-2"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-md text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Hot and fresh food delivered to your doorstep in minutes</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Quality Food</h3>
              <p className="text-gray-600">Made with fresh ingredients and authentic Sri Lankan spices</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Payment</h3>
              <p className="text-gray-600">Multiple payment options for your convenience</p>
            </div>
          </div>
        </div>
      </section>
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <button
        onClick={() => setCartOpen(true)}
        className="fixed bottom-6 right-6 z-30 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-110"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </button>
      <style dangerouslySetInnerHTML={{
        __html: `
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .text-shadow {
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
        `
      }} />
    </div>
  );
};

export default Home;
