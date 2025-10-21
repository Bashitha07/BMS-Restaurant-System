import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { toast } from 'react-hot-toast';
import { User, ShoppingBag, Menu as MenuIcon, Search, MapPin } from 'lucide-react';
import { useState } from 'react';

export default function Navbar({ onCartClick }) {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const totalItems = getTotalItems();

  return (
  <nav className="bg-primary shadow-sm border-b border-accent/30 sticky top-0 z-50">
  <div className="section-container">
  <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold text-sm">BMS</span>
            </div>
            <span className="text-xl font-bold text-accent hidden sm:block">
              Kingdom of Taste
            </span>
          </Link>

          {/* Location - Hidden on mobile */}
          <div className="hidden lg:flex items-center space-x-2 text-sm text-accent/80">
            <MapPin className="w-4 h-4 text-accent" />
            <span>Deliver to</span>
            <span className="font-medium text-accent">Current Location</span>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent/60 w-4 h-4" />
              <input
                type="text"
                placeholder="Search for restaurant, cuisine, or dish"
                className="w-full pl-10 pr-4 py-2 border border-accent/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/70 focus:border-transparent bg-primary text-accent placeholder-accent/60"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="relative p-2 hover:bg-accent/10 rounded-lg transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-accent" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-primary text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium border-2 border-primary">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 p-2 hover:bg-accent/10 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-accent/30 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-accent" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-accent">
                    {user.username}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-primary rounded-lg shadow-lg border border-accent/30 py-1 z-50">
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-accent hover:bg-accent/10"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Your Orders
                    </Link>
                    <Link
                      to="/reservations"
                      className="block px-4 py-2 text-sm text-accent hover:bg-accent/10"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Reservations
                    </Link>
                    <Link
                      to="/payments"
                      className="block px-4 py-2 text-sm text-accent hover:bg-accent/10"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Payment Methods
                    </Link>
                    {user.role === 'ADMIN' && (
                      <>
                        <div className="border-t border-accent/30 my-1"></div>
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-accent hover:bg-accent/10 font-medium"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      </>
                    )}
                    <div className="border-t border-accent/30 my-1"></div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-accent hover:text-accent/80 px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-accent text-primary text-sm px-4 py-2 rounded-lg font-semibold hover:bg-accent/80 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-accent/10 rounded-lg"
            >
              <MenuIcon className="w-5 h-5 text-accent" />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent/60 w-4 h-4" />
            <input
              type="text"
              placeholder="Search for food..."
              className="w-full pl-10 pr-4 py-2 border border-accent/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/70 bg-primary text-accent placeholder-accent/60"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}