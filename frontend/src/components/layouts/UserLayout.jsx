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
    { path: '/admin', icon:ClipboardList, label: 'Admin Panel', public: false, adminOnly: true },
  ];

  // Check if user is admin (case-insensitive)
  const isAdmin = user?.role?.toLowerCase() === 'admin' || user?.role === 'ADMIN';
  
  // Combine nav items with admin items if user is admin
  const allNavItems = isAdmin ? [...navItems, ...adminNavItems] : navItems;

  return (
  <div className="min-h-screen bg-white">
      {/* Header */}
  <header className="bg-black shadow-lg relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400 rounded transition-all">
                BMS Kingdom of Taste
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleCartClick}
                className="relative p-2 rounded-lg transition-colors text-orange-500 hover:bg-orange-400 hover:text-black group"
                aria-label="View cart"
              >
                <ShoppingCart className="h-6 w-6 stroke-orange-500 group-hover:stroke-black group-hover:fill-none" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-black text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg border-2 border-black">
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
                    className="text-sm text-orange-500 bg-transparent hover:bg-orange-500 hover:text-black px-3 py-1 rounded-md transition-colors font-medium border border-orange-500"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm bg-orange-500 text-black hover:bg-orange-400 px-3 py-1 rounded-md transition-colors font-medium border border-orange-500"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-400 to-transparent pointer-events-none" />
      </header>

      {/* Navigation */}
  <nav className="bg-black shadow-md relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden">
          <div className="flex justify-start items-center space-x-8 w-full">
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
                    className={`flex items-center px-5 py-2 my-2 rounded-full font-semibold text-sm transition-all duration-200 relative ${
                      isActive
                        ? 'text-black bg-orange-500 shadow-md'
                        : 'text-orange-500 hover:text-black hover:bg-orange-500 hover:shadow-md'
                    }`}
                    style={{ maxWidth: 'fit-content', minWidth: '120px' }}
                  >
                    <span className="flex items-center justify-center w-full">
                      <Icon className="h-5 w-5 mr-2" />
                      {item.label}
                    </span>
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
  <footer className="bg-black border-t-4 border-orange-500 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-orange-500">
            <p className="mb-2 text-lg font-semibold text-orange-500">BMS Kingdom of taste</p>
            <p className="mb-1">📞 +94 11 217 1944 | 📍 No 187/1/B, Hokandara 10230</p>
            <p>
              <a href="https://www.facebook.com/share/1749XW4KBV/" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-400 font-medium transition-colors">
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
