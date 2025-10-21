import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { ShoppingCart, User, Home, Menu, Receipt, Calendar, Bell, Users, ChefHat, Settings, ClipboardList } from 'lucide-react';
import NotificationDropdown from '../ui/NotificationDropdown';
import { toast } from 'react-hot-toast';

const UserLayout = ({ children, onCartClick }) => {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (confirmed) {
      logout();
      toast.success('Logged out successfully. Thank you for visiting!');
      navigate('/', { replace: true });
    }
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    if (onCartClick) {
      onCartClick();
    }
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Home', public: true },
    { path: '/menu', icon: Menu, label: 'Menu', public: true },
    { path: '/cart', icon: ShoppingCart, label: 'Cart', public: true },
    { path: '/order-history', icon: Receipt, label: 'Orders', public: false },
    { path: '/reservations', icon: Calendar, label: 'Reservations', public: false },
    { path: '/profile', icon: User, label: 'Profile', public: false },
  ];

  // Add admin-specific navigation items for admin users
  const adminNavItems = [
    { path: '/admin/orders', icon: ClipboardList, label: 'Order Management', public: false, adminOnly: true },
    { path: '/profile?tab=users', icon: Users, label: 'User Management', public: false, adminOnly: true },
    { path: '/profile?tab=menu', icon: ChefHat, label: 'Menu Management', public: false, adminOnly: true },
  ];

  // Check if user is admin (case-insensitive)
  const isAdmin = user?.role?.toLowerCase() === 'admin' || user?.role === 'ADMIN';
  
  // Combine nav items with admin items if user is admin
  const allNavItems = isAdmin ? [...navItems, ...adminNavItems] : navItems;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-800 via-orange-800 to-red-800 shadow-lg border-b-4 border-amber-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-amber-100">🍽️ BMS Kingdom of taste</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleCartClick}
                className="relative hover:bg-amber-700 p-2 rounded-lg transition-colors text-amber-100 hover:text-white"
              >
                <ShoppingCart className="h-6 w-6" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg">
                    {getTotalItems()}
                  </span>
                )}
              </button>
              {user && <NotificationDropdown />}
              
              {/* Conditional User Info and Logout */}
              {user ? (
                <>
                  <span className="text-sm text-amber-100 font-medium">Welcome, {user.username}</span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-amber-200 hover:text-white bg-amber-700 hover:bg-amber-600 px-3 py-1 rounded-md transition-colors font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="text-sm text-amber-200 hover:text-white bg-amber-700 hover:bg-amber-600 px-3 py-1 rounded-md transition-colors font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm text-white bg-orange-600 hover:bg-orange-700 px-3 py-1 rounded-md transition-colors font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gradient-to-r from-amber-100 via-orange-100 to-yellow-100 shadow-md border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {allNavItems
              .filter(item => {
                // Show public items to everyone
                if (item.public) return true;
                // Show private items only to logged in users
                if (!item.public && user) {
                  // If it's admin-only, check if user is admin
                  if (item.adminOnly) {
                    return isAdmin;
                  }
                  return true;
                }
                return false;
              })
              .map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-3 py-4 border-b-3 font-semibold text-sm transition-all duration-200 ${
                      isActive
                        ? 'border-amber-600 text-amber-800 bg-amber-50'
                        : 'border-transparent text-amber-700 hover:text-amber-900 hover:border-amber-400 hover:bg-amber-50'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {item.label}
                  </Link>
                );
              })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-amber-800 via-orange-800 to-red-800 border-t-4 border-amber-300 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-amber-100">
            <p className="mb-2 text-lg font-semibold">🍽️ BMS Kingdom of taste</p>
            <p className="mb-1">📞 +94 11 217 1944 | 📍 No 187/1/B, Hokandara 10230</p>
            <p>
              <a href="https://www.facebook.com/share/1749XW4KBV/" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:text-amber-100 font-medium transition-colors">
                Follow us on Facebook
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;
