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
  <div className="min-h-screen bg-white">
      {/* Header */}
  <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-orange-300 rounded transition-all">
                BMS Kingdom of Taste
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleCartClick}
                className="relative p-2 rounded-lg transition-colors text-white hover:bg-white hover:text-orange-600 group"
                aria-label="View cart"
              >
                <ShoppingCart className="h-6 w-6 stroke-white group-hover:stroke-orange-600 group-hover:fill-none" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-orange-600 text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg border-2 border-orange-300">
                    {getTotalItems()}
                  </span>
                )}
              </button>
              {user && <NotificationDropdown iconColor="orange-500" badgeColor="orange-500" />} 
              {/* Conditional User Info and Logout */}
              {user ? (
                <>
                  <span className="text-sm text-orange-500 font-medium">Welcome, {user.username}</span>
                  <button
                    onClick={handleLogout}
                    className="text-sm bg-orange-500 text-black hover:bg-orange-400 px-3 py-1 rounded-md transition-colors font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="text-sm text-primary bg-accent hover:bg-accent/80 px-3 py-1 rounded-md transition-colors font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm text-accent bg-primary border border-accent hover:bg-accent hover:text-primary px-3 py-1 rounded-md transition-colors font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent pointer-events-none" />
      </header>

      {/* Navigation */}
  <nav className="bg-orange-500 shadow-md relative border-b-2 border-orange-600">
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
                        ? 'border-white text-white bg-orange-600'
                        : 'border-transparent text-white hover:text-orange-100 hover:border-white hover:bg-orange-600'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {item.label}
                  </Link>
                );
              })}
          </div>
        </div>
        <div className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-400 to-transparent pointer-events-none" />
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
  <footer className="bg-gradient-to-r from-orange-500 to-orange-600 border-t-4 border-orange-700 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-white">
            <p className="mb-2 text-lg font-semibold text-white">BMS Kingdom of taste</p>
            <p className="mb-1">📞 +94 11 217 1944 | 📍 No 187/1/B, Hokandara 10230</p>
            <p>
              <a href="https://www.facebook.com/share/1749XW4KBV/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-orange-100 font-medium transition-colors underline">
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
