import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { toast } from 'react-hot-toast';
import { User, ShoppingBag, Menu as MenuIcon, Search, MapPin, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar({ onCartClick }) {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setIsMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const totalItems = getTotalItems();

  return (
  <nav className="bg-primary-900 shadow-sm border-b border-primary-800 sticky top-0 z-50">
      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-primary-900 font-bold text-sm">BMS</span>
            </div>
            <span className="text-xl font-bold text-accent-400 hidden sm:block">
              Kingdom of Taste
            </span>
          </Link>

          {/* Location - Hidden on mobile */}
          <div className="hidden lg:flex items-center space-x-2 text-sm text-accent-200">
            <MapPin className="w-4 h-4" />
            <span>Deliver to</span>
            <span className="font-medium text-accent-100">Current Location</span>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-400 w-4 h-4" />
              <input
                type="text"
                placeholder={user ? "Search for restaurant, cuisine, or dish" : "Search menu (Sign in for personalized results)"}
                className="w-full pl-10 pr-4 py-2 border border-primary-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent bg-primary-800 text-accent-100 placeholder-accent-200"
              />
              {!user && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <Link
                    to="/login"
                    className="text-xs text-accent-400 hover:text-accent-500 font-medium"
                  >
                    Sign in
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="relative p-2 hover:bg-primary-800 rounded-lg transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-accent-400" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-primary-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 p-2 hover:bg-primary-800 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-700 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-accent-400" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-accent-200">
                    {user.username}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-primary-900 rounded-lg shadow-lg border border-primary-800 py-1 z-50">
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-accent-200 hover:bg-primary-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Your Orders
                    </Link>
                    <Link
                      to="/reservations"
                      className="block px-4 py-2 text-sm text-accent-200 hover:bg-primary-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Reservations
                    </Link>
                    <Link
                      to="/payments"
                      className="block px-4 py-2 text-sm text-accent-200 hover:bg-primary-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Payment Methods
                    </Link>
                    {user.role === 'ADMIN' && (
                      <>
                        <div className="border-t border-gray-100 my-1"></div>
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-accent-400 hover:bg-primary-800 font-medium"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      </>
                    )}
                    <div className="border-t border-primary-800 my-1"></div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-primary-800"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-accent-400 hover:text-accent-500 px-4 py-2 rounded-md transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-primary-900 bg-accent-500 hover:bg-accent-600 px-4 py-2 rounded-md transition-colors shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-primary-800 rounded-lg"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-accent-400" />
              ) : (
                <MenuIcon className="w-5 h-5 text-accent-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-primary-900 border-t border-primary-800">
            <div className="px-4 py-2 space-y-1">
              {/* Mobile Navigation Links */}
              <Link
                to="/menu"
                className="block px-3 py-2 text-base font-medium text-accent-200 hover:text-accent-100 hover:bg-primary-800 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Menu
              </Link>
              
              {user && (
                <>
                  <Link
                    to="/orders"
                    className="block px-3 py-2 text-base font-medium text-accent-200 hover:text-accent-100 hover:bg-primary-800 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Your Orders
                  </Link>
                  <Link
                    to="/reservations"
                    className="block px-3 py-2 text-base font-medium text-accent-200 hover:text-accent-100 hover:bg-primary-800 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Reservations
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-base font-medium text-accent-200 hover:text-accent-100 hover:bg-primary-800 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  {user.role === 'ADMIN' && (
                    <Link
                      to="/admin"
                      className="block px-3 py-2 text-base font-medium text-accent-400 hover:text-accent-500 hover:bg-primary-800 rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                </>
              )}
              
              {/* Mobile Auth Section */}
              <div className="pt-4 pb-3 border-t border-primary-800">
                {user ? (
                  <div className="space-y-1">
                    <div className="px-3 py-2">
                      <div className="text-base font-medium text-accent-100">{user.username}</div>
                      <div className="text-sm text-accent-200">{user.email}</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-red-500 hover:text-red-400 hover:bg-primary-800 rounded-md"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Link
                      to="/login"
                      className="block px-3 py-2 text-base font-medium text-accent-200 hover:text-accent-100 hover:bg-primary-800 rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="block px-3 py-2 text-base font-medium text-primary-900 bg-accent-500 hover:bg-accent-600 rounded-md text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search for food..."
              className="w-full pl-10 pr-4 py-2 border border-primary-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-400 bg-primary-800 text-accent-100 placeholder-accent-200"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}